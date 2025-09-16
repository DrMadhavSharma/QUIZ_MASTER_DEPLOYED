from .database import db 
from .models import *  #Transaction
from flask import current_app as app, jsonify, request, render_template,send_from_directory
from flask_security import auth_required, roles_required, roles_accepted, current_user, login_user
from werkzeug.security import check_password_hash, generate_password_hash
from .utils import roles_list
from app import app
from flask import Flask, render_template, request, redirect, url_for
import random
from flask import Flask, send_file
import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for non-GUI rendering
import matplotlib.pyplot as plt
import io
from io import BytesIO
import base64
from celery.result import AsyncResult
from .tasks import csv_report, monthly_report
from .utils import task_results
import uuid
from app import cache_route,cache_delete_pattern
from app import cache
import json

with app.app_context():
    @app.route("/health")
    def health_check():
        return "OK", 200
    @app.route("/test-cache")
    @cache.cached(timeout=60)
    def test_cache():
        import time
        return f"Time: {time.time()}"
    @app.route('/', methods = ['GET'])
    def home():
        return render_template('index.html')

    @app.route('/logout', methods=['GET'])
    def logout():
        session.clear()
        response = make_response({"message": "Logged out successfully"})
        response.delete_cookie('session')  # Adjust cookie name if necessary
        return response
        print(response)
    @app.route('/user/<int:user_id>/graph', methods=['GET'])
    def generate_graph(user_id):
        cache_key = f"user_score_graph:{user_id}"
        cached_img = cache.get(cache_key)

        if cached_img:
            print("CACHE HIT")
            return send_file(io.BytesIO(cached_img), mimetype='image/png')

        print("CACHE MISS")
        # Validate user existence
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Fetch quiz attempts
        attempts = QuizAttempt.query.filter_by(user_id=user_id).all()
 
        if not attempts:
            return jsonify({'message': 'No quiz attempts found for this user.'}), 200

        # Prepare data for visualization
        subjects = []
        scores = []

        for attempt in attempts:
            quiz = Quiz.query.get(attempt.quiz_id)
            if quiz:
                subjects.append(quiz.title)
                scores.append(attempt.score)

        # Plot using Matplotlib
        plt.figure(figsize=(4, 4))
        plt.bar(subjects, scores, color='skyblue')
        plt.xlabel('Quiz Title')
        plt.ylabel('Score')
        plt.title(f'Quiz Scores for {user.username}')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()

        # Save graph to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()
        # Save raw bytes in Redis
        cache.set(cache_key, img.getvalue(), timeout=300)
        cache_delete_pattern("quizes")           # For route cache
        return send_file(img, mimetype='image/png')
    @app.route('/user/<int:user_id>/total_subject_chart', methods=['GET'])
    def generate_total_subject_chart(user_id):
        cache_key = f"subject_chart:{user_id}"
        cached_img = cache.get(cache_key)

        if cached_img:
            print("CACHE HIT")
            return send_file(io.BytesIO(cached_img), mimetype='image/png')

        print("CACHE MISS")
        # Get the total number of quizzes
        total_quizzes = Quiz.query.count()
        if total_quizzes == 0:
            return jsonify({'message': 'No quizzes found in the database.'}), 200

        # Get the number of quizzes per subject using joins
        subject_counts = (
            db.session.query(Subject.name, db.func.count(Quiz.id))
            .join(Chapter, Chapter.subject_id == Subject.id)
            .join(Quiz, Quiz.chapter_id == Chapter.id)
            .group_by(Subject.name)
            .all()
        )

        # Extract subject names and their counts
        subjects, quiz_counts = zip(*subject_counts) if subject_counts else ([], [])

        # Calculate "Others" if necessary
        subject_quiz_total = sum(quiz_counts)
        if subject_quiz_total < total_quizzes:
            subjects += ('Others',)
            quiz_counts += (total_quizzes - subject_quiz_total,)

        # Plotting using Matplotlib
        plt.figure(figsize=(4, 4))
        plt.pie(
            quiz_counts,
            labels=subjects,
            autopct='%1.1f%%',
            startangle=140,
            colors=plt.cm.Set3.colors
        )
        plt.axis('equal')
        plt.title('Distribution of Quizzes by Subject')

        # Save to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        # Save raw bytes in Redis
        cache.set(cache_key, img.getvalue(), timeout=300)

        cache_delete_pattern("quizes")  # only if you need to invalidate another cache
        return send_file(io.BytesIO(img.getvalue()), mimetype='image/png')


    @app.route('/admin/summary', methods=['GET'])
    def admin_summary():
        cache_key = "admin_summary"
        cached_data = cache.get(cache_key)

        if cached_data:
            print("CACHE HIT")
            return jsonify(json.loads(cached_data))

        print("CACHE MISS")
        # Fetch counts
        num_questions = Question.query.count()
        num_quizzes = Quiz.query.count()
        num_options = Option.query.count()
        num_subjects = Subject.query.count()
        num_chapters = Chapter.query.count()
        num_users = User.query.count()

        # Find top scorer
        top_scorer = (
            db.session.query(User.username, db.func.max(QuizAttempt.score))
            .join(QuizAttempt)
            .group_by(User.username)
            .order_by(db.func.max(QuizAttempt.score).desc())
            .first()
        )

        # Plot summary chart
        labels = ['Questions', 'Quizzes', 'Options', 'Subjects', 'Chapters', 'Users']
        values = [num_questions, num_quizzes, num_options, num_subjects, num_chapters, num_users]

        plt.figure(figsize=(10, 6))
        plt.bar(labels, values, color='skyblue')
        plt.title('Admin Summary Statistics')
        plt.xlabel('Category')
        plt.ylabel('Count')

        # Add top scorer text
        if top_scorer:
            plt.figtext(
                0.15, 0.85,
                f'Top Scorer: {top_scorer[0]} with {top_scorer[1]} points',
                fontsize=10, color='darkred'
            )

        # Save chart to memory
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        plt.close()

        # Convert image to base64
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

        # Prepare response
        response = {
            "summary_data": {
                "Questions": num_questions,
                "Quizzes": num_quizzes,
                "Options": num_options,
                "Subjects": num_subjects,
                "Chapters": num_chapters,
                "Users": num_users
            },
            "top_scorer": {
                "name": top_scorer[0],
                "points": top_scorer[1]
            } if top_scorer else None,
            "chart": image_base64
        }

        # Save JSON response in Redis
        cache.set(cache_key, json.dumps(response), timeout=300)

        cache_delete_pattern("quizes")  # if you still want to invalidate that
        return jsonify(response)


    
    @app.route('/api/register', methods=['POST']) #or @app.post('/api/register')
    def create_user():
        credentials = request.get_json()
        if not app.security.datastore.find_user(email = credentials["email"]):
            app.security.datastore.create_user(email = credentials["email"],
                                            username = credentials["username"],
                                            password = generate_password_hash(credentials["password"]),
                                            roles = ['user'])
            db.session.commit()
            return jsonify({
                "message": "User created successfully"
            }), 201
        
        return jsonify({
            "message": "User already exists!"
        }), 400
    
    @app.route('/api/home')
    @auth_required('token')
    @roles_accepted('user', 'admin')#and (user must be both admin and user)
    # @roles_accepted(['user', 'admin']) #OR (user could be either admin or user)
    def user_home():
        user = current_user # we could directly retrieve the users data stored in current user session in cookies
        return jsonify({
            "username": user.username,
            "email": user.email,
            "roles": roles_list(user.roles)
        })

    # @app.route('/api/login', methods=['POST'])
    # def user_login():
    #     body = request.get_json() #converts json string to json
    #     email = body['email']
    #     password = body['password']

    #     if not email:
    #         return jsonify({
    #             "message": "Email is required!"
    #         }), 400
        
    #     user = app.security.datastore.find_user(email = email) #finding user with given email with flask authentication

    #     if user:
    #         if check_password_hash(user.password, password):
                
    #             # if current_user.is_authenticated:
    #             #     return jsonify({
    #             #     "message": "Already logged in!"
    #             # }), 400
    #             login_user(user) #used to load current user information
    #             return jsonify({
    #                 "id": user.id,
    #                 "username": user.username,
    #                 "auth-token": user.get_auth_token(),
    #                 # "roles": roles_list(user.roles) 
    #                 "roles": roles_list(current_user.roles) 
    #             })
    #         else:
    #             return jsonify({
    #                 "message": "Incorrect Password"
    #             }), 400
    #     else:
    #         return jsonify({
    #                 "message": "User Not Found!"
    #             }), 404 
    @app.route('/api/login', methods=['POST'])
    def user_login():
        body = request.get_json()
        email = body.get('email')
        password = body.get('password')
    
        if not email or not password:
            return jsonify({"message": "Email and password are required!"}), 400
    
        try:
            user = app.security.datastore.find_user(email=email)
        except SQLAlchemyError:
            db.session.rollback()
            return jsonify({"message": "Database error"}), 500
    
        if not user:
            return jsonify({"message": "User Not Found!"}), 404
    
        if not check_password_hash(user.password, password):
            return jsonify({"message": "Incorrect Password"}), 400
    
        login_user(user)
    
        return jsonify({
            "id": user.id,
            "username": user.username,
            "auth-token": user.get_auth_token(),
            "roles": roles_list(user.roles)
        })

    @app.route('/api/adminDASHBOARD')
    @auth_required('token') # Authentication required (देखेगा कि user है )                          
    @roles_required('admin') # RBAC/Authorization (देखेगा कि कौन सा  user है -admin,normal user)
    def admin_home():
        return jsonify({
            "message": "admin logged in successfully"
        })
    #SUBJECT
    #GETTING SUBJECT
    @app.route('/api/adminhome/getsubject', methods =['GET'])
    @cache_route(timeout=300, key_prefix="all_subjects")
    @auth_required('token')
    @roles_required('admin')
    def get(): #either admin or general user ,if we had written @roles_required then only that particular will be allowed
            subjects = Subject.query.all()
            return [{'id': s.id, 'name': s.name} for s in subjects], 200
    #CREATE SUBJECT
    @app.route('/api/adminhome/createsubject', methods =['POST'])
    @auth_required('token') # Authentication required (देखेगा कि user है )                          
    @roles_required('admin')
    def subject():
        data = request.get_json()

        # Validate data
        subject_name = data.get("name")
        if not subject_name:
            return jsonify({"message": "Subject name is required!"}), 400

        # Check if subject already exists
        if Subject.query.filter_by(name=subject_name).first():
            return jsonify({"message": "Subject already exists!"}), 400

        # Create new subject
        new_subject = Subject(name=subject_name)
        db.session.add(new_subject)
        db.session.commit()
        cache_delete_pattern("quizes")           # For route cache
        return jsonify({"message": "Subject created successfully!"}), 201
   

    # Update Subject
    @app.route('/api/adminhome/updatesubject/<int:subject_id>', methods=['PUT'])
    @auth_required('token')                          
    @roles_required('admin')
    def update_subject(subject_id):
        data = request.get_json()
        subject_name = data.get("name")

        if not subject_name:
            return jsonify({"message": "Subject name is required!"}), 400

        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({"message": "Subject not found!"}), 404

        # Check if subject name already exists (excluding itself)
        if Subject.query.filter(Subject.name == subject_name, Subject.id != subject_id).first():
            return jsonify({"message": "Subject with this name already exists!"}), 400

        subject.name = subject_name
        db.session.commit()
        cache_delete_pattern("quizes")           # For route cache
        return jsonify({"message": "Subject updated successfully!"}), 200

    # Delete Subject
    @app.route('/api/adminhome/deletesubject/<int:subject_id>', methods=['DELETE'])
    @auth_required('token')                          
    @roles_required('admin')
    def delete_subject(subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({"message": "Subject not found!"}), 404

        db.session.delete(subject)
        db.session.commit()
        cache_delete_pattern("quizes")           # For route cache
        return jsonify({"message": "Subject deleted successfully!"}), 200


    #CHAPTERS
    #GETTING chapters
    @app.route('/api/adminhome/getchapters/<int:subject_id>', methods=['GET'])
    @cache_route(timeout=300, key_prefix="all_chapters")
    @auth_required('token')
    @roles_required('admin')
    def get_chapters(subject_id):
       chapters = Chapter.query.filter_by(subject_id=subject_id).all()
       return jsonify([{'id': c.id, 'name': c.name, 'subject_id': c.subject_id} for c in chapters]), 200

    # Create Chapter
    @app.route('/api/adminhome/createchapter', methods=['POST'])
    @auth_required('token')                          
    @roles_required('admin')
    def create_chapter():
        data = request.get_json()
        name = data.get("name")
        subject_id = data.get("subject_id")

        if not name or not subject_id:
            return jsonify({"message": "Chapter name and subject_id are required!"}), 400

        # Check if subject exists
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({"message": "Subject not found!"}), 404

        # Check if chapter with the same name exists for the subject
        if Chapter.query.filter_by(name=name, subject_id=subject_id).first():
            return jsonify({"message": "Chapter with this name already exists for the subject!"}), 400

        # Create a new chapter
        new_chapter = Chapter(name=name, subject_id=subject_id)
        db.session.add(new_chapter)
        db.session.commit()
        cache_delete_pattern("quizes")           # For route cache
        return jsonify({"message": "Chapter created successfully!", "chapter_id": new_chapter.id}), 201


    # Update Chapter
    @app.route('/api/adminhome/updatechapter/<int:chapter_id>', methods=['PUT'])
    @auth_required('token')                          
    @roles_required('admin')
    def update_chapter(chapter_id):
        data = request.get_json()
        name = data.get("name")
        subject_id = data.get("subject_id")

        if not name or not subject_id:
            return jsonify({"message": "Chapter name and subject_id are required!"}), 400

        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return jsonify({"message": "Chapter not found!"}), 404

        # Check if subject exists
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({"message": "Subject not found!"}), 404

        # Check if chapter with the same name already exists (excluding itself)
        if Chapter.query.filter(Chapter.name == name, Chapter.subject_id == subject_id, Chapter.id != chapter_id).first():
            return jsonify({"message": "Chapter with this name already exists for the subject!"}), 400

        # Update the chapter
        chapter.name = name
        chapter.subject_id = subject_id
        db.session.commit()
        cache_delete_pattern("quizes")           # For route cache
        return jsonify({"message": "Chapter updated successfully!"}), 200


    # Delete Chapter
    @app.route('/api/adminhome/deletechapter/<int:chapter_id>', methods=['DELETE'])
    @auth_required('token')                          
    @roles_required('admin')
    def delete_chapter(chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return jsonify({"message": "Chapter not found!"}), 404

        # Ensure there are no associated quizzes before deleting
        # if chapter.quizzes:
        #     return jsonify({"message": "Cannot delete chapter with existing quizzes!"}), 400

        db.session.delete(chapter)
        db.session.commit()
        cache_delete_pattern("quizes")           # For route cache
        return jsonify({"message": "Chapter deleted successfully!"}), 200


    # Dummy Payment Form
    @app.route('/payment', methods=['GET'])
    def payment_form():
        return render_template('payment_form.html')

    # Process Payment
    @app.route('/process_payment', methods=['POST'])
    def process_payment():
        data = request.get_json()

        if not data:
            return "Invalid JSON data.", 400

        card_number = data.get('card_number')
        expiry_date = data.get('expiry_date')
        cvv = data.get('cvv')
        amount = data.get('amount')

        if not (card_number and expiry_date and cvv and amount):
            return "All fields are required.", 400

        # Simulate Payment (50% Success Rate)
        payment_success = random.choice([True, False])
        status = 'success' if payment_success else 'failure'

        return redirect(url_for('payment_status', status=status))

    @app.route('/payment_status')
    def payment_status():
        status = request.args.get('status')
        return jsonify({"payment_status": status})
        
    # #---------------csv&other async jobs---------------------#
    # @app.route('/api/export') # this manually triggers the job
    # def export_csv():
    #     result = csv_report.delay() # async object
    #     return jsonify({
    #         "id": result.id,
    #         "result": result.result,

    #     })

    # @app.route('/api/csv_result/<id>') # just create to test the status of result
    # def csv_result(id):
    #     # res = AsyncResult(id)
    #     # return send_from_directory('static', res.result)
    #     res = csv_report.AsyncResult(id)
    #     if res.ready():
    #         if res.result:  # ensure it's not None
    #             return send_from_directory('static', res.result)
    #         else:
    #             return {"error": "Task failed or returned no file"}, 500
    #     else:
    #         return {"status": "pending"}, 202
        

    # @app.route('/api/mail')
    # def send_reports():
    #     res = monthly_report.delay()
    #     return {
    #         "result": res.result
    #     }
    import os
    import requests
    from flask import Flask, jsonify, request, send_from_directory


    QSTASH_URL = os.getenv("QSTASH_URL", "https://qstash.upstash.io/v2/publish")
    QSTASH_TOKEN = os.getenv("QSTASH_TOKEN")


    # ----------- ROUTES (trigger tasks via QStash) -----------

    @app.route('/api/export')
    @cache_route(timeout=300, key_prefix="all_csv")
    def export_csv():
        task_id = str(uuid.uuid4())  # generate unique ID
        task_results[task_id] = "pending"

        # Ask QStash to call our worker route
        response = requests.post(
            "https://qstash.upstash.io/v2/publish/https://quiz-master-deployed.onrender.com/tasks/csv_report",
            headers={
                "Authorization": f"Bearer {QSTASH_TOKEN}",
                "Content-Type": "application/json"
            },
            json={"task_id": task_id}
        )

        return jsonify({
            "id": task_id,
            "status": "queued"
        })


    @app.route('/api/csv_result/<task_id>')
    def csv_result(task_id):
        result = task_results.get(task_id)
        
        if result == "pending":
            return jsonify({"status": "pending"}), 202

        if not result:
            return jsonify({"status": "pending"}), 202

        if result == "failed":
            return jsonify({"error": "Task failed"}), 500

        # If we have a filename, return the actual CSV file
        return send_from_directory("static", result, as_attachment=True)


    @app.route('/api/mail')
    def send_reports():
        """Publish monthly report job to QStash"""
        response = requests.post(
            f"{QSTASH_URL}/tasks/monthly_report",
            headers={
                "Authorization": f"Bearer {QSTASH_TOKEN}",
                "Content-Type": "application/json"
            },
            json={}  # no payload needed
        )
        return jsonify(response.json())
    from application.tasks import task_csv_report, task_monthly_report

    @app.route('/tasks/csv_report', methods=['POST'])
    def csv_report():
        return task_csv_report()

    @app.route('/tasks/monthly_report', methods=['POST'])
    def monthly_report():
        return task_monthly_report()

    @app.route('/tasks/quiz_update', methods=['POST'])
    def quiz_update():
        data = request.json
        quiz_id = data.get("quiz_id")

        # data = request.json
        # quiz_id = data.get("quiz_id")  # Pass quiz_id from QStash
        if not quiz_id:
            return {"error": "quiz_id missing"}, 400

        # Get all users from the database
        users = User.query.all()

        text_template = (
            "Hi {username}, we have crafted some new questions based on current trends in our new quiz! "
            "Please check the app at https://quiz-master-deployed.onrender.com/"
        )

        for user in users[1:]:
            message = text_template.format(username=user.username)
            response = requests.post(
                "https://chat.googleapis.com/v1/spaces/AAAAGc1HvB0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=tum8EkYGU3DBQ41TVS27E8DFsmL1mfSCAVyjtNisjrY",
                headers={"Content-Type": "application/json"},
                json={"text": message}
            )

            if response.status_code == 200:
                notification = Notification(user_id=user.id, message=message)
                db.session.add(notification)
            else:
                print(f"Failed to send to {user.username}: {response.status_code}")

        db.session.commit()
        return jsonify({"result": "Notifications sent to all users"})
