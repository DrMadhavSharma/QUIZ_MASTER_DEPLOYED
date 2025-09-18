
import csv
import datetime
import requests
from celery import Celery, shared_task
from .models import Quiz, User, Notification, db
from .utils import format_report
from .mail import send_email
from .utils import task_results

@shared_task(ignore_results = False, name = "download_csv_report")
def csv_report():
    quizzes = Quiz.query.all() # admin
    csv_file_name = f"transaction_{datetime.datetime.now().strftime("%f")}.csv" #transaction_123456.csv
    with open(f'static/{csv_file_name}', 'w', newline = "") as csvfile:
    # csvfile = open(f'static/{csv_file_name}', 'w', newline = "")
        sr_no = 1
        Quiz_csv = csv.writer(csvfile, delimiter = ',')
        Quiz_csv.writerow(['Sr No.', 'title', 'chapter_id', 'date', 'Duration'])
        for q in quizzes:
            this_quiz = [sr_no, q.title, q.chapter_id, q.date, q.duration]
            Quiz_csv.writerow(this_quiz)
            sr_no += 1

    return csv_file_name

@shared_task(ignore_results=False, name="monthly_report")
def monthly_report():
    users = User.query.all()
    for user in users[1:]:
        user_data = {
            'username': user.username,
            'email': user.email,
        }
        user_quizzes = []
        total_score = 0

        for quiz_attempt in user.quizzes_attempted:
            this_quiz = {
                "id": quiz_attempt.id,
                "user_id": quiz_attempt.user_id,
                "quiz_id": quiz_attempt.quiz_id,
                "score": quiz_attempt.score,
                "date_attempted": quiz_attempt.date_attempted,
            }
            user_quizzes.append(this_quiz)
            total_score += quiz_attempt.score  # Calculate total score

        user_data['quizzes'] = user_quizzes
        user_data['total'] = total_score
        
        # Render email content
        message = format_report('templates/mail_details.html', user_data)
        send_email(user.email, subject="Monthly Transaction Report - Quiz Master", message=message)

    return "Monthly reports sent"



@shared_task(ignore_results=False, name="quiz_update")
def quiz_update(quiz_id):
    # Get all users from the database
    users = User.query.all()

    # Message Template
    text_template = (
        f"Hi {{username}}, we have crafted some new questions based on current trends in our new quiz! "
        f"Please check the app at https://babu-gnw2.onrender.com/"
    )

    # Iterate through users and send notifications
    for user in users[1:]:
        message = text_template.format(username=user.username)
        response = requests.post(
            "https://chat.googleapis.com/v1/spaces/AAAAGc1HvB0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=tum8EkYGU3DBQ41TVS27E8DFsmL1mfSCAVyjtNisjrY",
            headers={"Content-Type": "application/json"} , json={"text" : message}
        )

        # Log the notification to the database
        if response.status_code == 200:
            notification = Notification(user_id=user.id, message=message)
            db.session.add(notification)
        else:
            print(f"Failed to send to {user.username}: {response.status_code}")

    # Commit notifications
    db.session.commit()

    return "Notifications sent to all users"


    
# https://chat.googleapis.com/v1/spaces/AAAAGc1HvB0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=tum8EkYGU3DBQ41TVS27E8DFsmL1mfSCAVyjtNisjrY



    # |||||||||||||||||||||||||||||||||||||||||| ---> 10 mins 
    # |\\\\\\\\\\\\\\\\\\\|\\\\\\\\\\\\\\\\\\\\\ ---> with cache  
    # ignore_results = False,do not ignore the task in which it is mentioned
import datetime
import csv
import requests
from flask import request, jsonify, send_from_directory
from .models import Quiz, User, Notification ,db
from .utils import format_report

def task_csv_report():

    data = request.get_json()
    task_id = data.get("task_id")

    try:
        quizzes = Quiz.query.all()  # fetch all quizzes
        csv_file_name = f"transaction_{datetime.datetime.now().strftime('%f')}.csv"

        with open(f'static/{csv_file_name}', 'w', newline="") as csvfile:
            sr_no = 1
            Quiz_csv = csv.writer(csvfile, delimiter=',')
            Quiz_csv.writerow(['Sr No.', 'title', 'chapter_id', 'date', 'Duration'])
            for q in quizzes:
                this_quiz = [sr_no, q.title, q.chapter_id, q.date, q.duration]
                Quiz_csv.writerow(this_quiz)
                sr_no += 1

        # mark result done
        task_results[task_id] = csv_file_name
        return jsonify({"status": "done", "task_id": task_id, "file": csv_file_name}), 200

    except Exception as e:
        task_results[task_id] = "failed"
        return jsonify({"error": str(e)}), 500



# def task_monthly_report():


#     users = User.query.all()
#     for user in users[1:]:  # skip first admin user?
#         # ✅ Validate email
#         if not user.email or "@" not in user.email:
#             print(f"[SKIP] Invalid or missing email for user id={user.id}, email={user.email}")
#             continue

#         # ✅ Prepare user data
#         user_data = {
#             'username': user.username,
#             'email': user.email,
#             'quizzes': [],
#             'total': 0
#         }

#         total_score = 0
#         for quiz_attempt in user.quizzes_attempted:
#             this_quiz = {
#                 "id": quiz_attempt.id,
#                 "user_id": quiz_attempt.user_id,
#                 "quiz_id": quiz_attempt.quiz_id,
#                 "score": quiz_attempt.score,
#                 "date_attempted": quiz_attempt.date_attempted,
#             }
#             user_data['quizzes'].append(this_quiz)
#             total_score += quiz_attempt.score

#         user_data['total'] = total_score

#         # ✅ Render email content
#         message = format_report('templates/mail_details.html', user_data)

#         # ✅ Try sending
#         try:
#             send_email(
#                 to_address=user.email.strip(),
#                 subject="Monthly Transaction Report - Quiz Master",
#                 message=message
#             )
#             print(f"[OK] Report sent to {user.email}")
#         except Exception as e:
#             print(f"[FAIL] Could not send to {user.email}: {e}")

#     return jsonify({"result": "Monthly reports sent"})
# 🚀 Step 1: Publish one job per user
import os
import time
QSTASH_URL = os.getenv("QSTASH_URL", "https://qstash.upstash.io/v2/publish")
QSTASH_TOKEN = os.getenv("QSTASH_TOKEN")

def task_monthly_report():
    users = User.query.all()

    for user in users[1:]:  # skip admin
        if not user.email or "@" not in user.email:
            print(f"[SKIP] Invalid email for user {user.id}")
            continue

        # Publish one job to QStash for this user
        requests.post(
            f"{QSTASH_URL}/tasks/send_user_report",
            headers={
                "Authorization": f"Bearer {QSTASH_TOKEN}",
                "Content-Type": "application/json"
            },
            json={"user_id": user.id}
        )
        # 🔹 wait between jobs so Resend never bursts too fast
        time.sleep(0.6)   # ~1.6 requests/sec (safe under 2/sec)
    return jsonify({"result": "Queued all user reports"})


