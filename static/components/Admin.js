export default {
  template: `
<div>

<!-- Existing Content -->
<div>
  <div class="container mt-5">
    <h2>Subjects</h2>
    
   <!-- Add Subject Section -->
<div class="col-12 text-end">
  <button 
    @click="showAddSubjectForm = !showAddSubjectForm"
    style="background-color:#000000; color:#ffffff; border:2px solid #000000; padding:8px 16px; font-size:15px; border-radius:6px; box-shadow:0 2px 5px rgba(0,0,0,0.3);"
    @mouseover="hoverButton"
    @mouseleave="resetButton">
    {{ showAddSubjectForm ? 'Cancel' : 'Add Subject' }}
  </button>
</div>

<div v-if="showAddSubjectForm" class="col-12 mt-3">
  <input 
    v-model="newSubject.name" 
    type="text" 
    placeholder="Enter Subject Name" 
    style="background-color:#ffffff; border:2px solid #000000; padding:8px; font-size:15px; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.3); margin-bottom:8px; width:100%; color:#000000;" 
  />
  <button 
    @click="addSubject"
    style="background-color:#000000; color:#ffffff; border:2px solid #000000; padding:8px 16px; font-size:15px; border-radius:6px; box-shadow:0 2px 5px rgba(0,0,0,0.3);"
    @mouseover="hoverButton"
    @mouseleave="resetButton">
    Add
  </button>
</div>

    
   <!-- Subjects and Chapters Section -->
<div class="row container-fluid p-4" style="background-color:white;">
  <div class="col-md-6 mb-4" v-for="subject in subjects" :key="subject.id">
    <div class="card" style="border:2px solid #000000; box-shadow:0 2px 5px rgba(0,0,0,0.3); border-radius:8px;">
      <div class="card-header d-flex justify-content-between align-items-center" 
           style="background-color:#000000; color:#ffffff; padding:10px; border-radius:8px 8px 0 0;">
        <h5 class="mb-0" style="font-size:16px;">{{ subject.name }}</h5>
        <div>
          <button @click="editSubject(subject)" 
                  style="background-color:#333333; color:#ffffff; border:1px solid #333333; padding:4px 10px; font-size:13px; border-radius:4px; margin-right:5px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"
                  @mouseover="hoverButton"
                  @mouseleave="resetButton">
            Edit
          </button>
          <button @click="deleteSubject(subject.id)" 
                  style="background-color:#000000; color:#ffffff; border:1px solid #000000; padding:4px 10px; font-size:13px; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"
                  @mouseover="hoverButton"
                  @mouseleave="resetButton">
            Delete
          </button>
        </div>
      </div>

      <div class="card-body" style="padding:12px;">
        <h6 style="color:#000000; font-size:15px;">Chapters:</h6>
        <input v-model="newChapter.name" type="text" placeholder="Enter Chapter Name" 
               style="background-color:#ffffff; border:2px solid #000000; padding:6px; font-size:14px; border-radius:4px; width:100%; margin-bottom:8px; box-shadow:0 1px 2px rgba(0,0,0,0.3); color:#000000;" />
        <button @click="addChapter(subject.id)" 
                style="background-color:#000000; color:#ffffff; border:2px solid #000000; padding:6px 12px; font-size:13px; border-radius:4px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"
                @mouseover="hoverButton"
                @mouseleave="resetButton">
          Add Chapter
        </button>

        <table v-if="filteredChapters(subject.id).length" 
               style="width:100%; border-collapse:collapse; margin-top:10px; font-size:14px;">
          <thead style="background-color:#000000; color:#ffffff;">
            <tr>
              <th style="padding:6px; border:2px solid #000000;">Serial No.</th>
              <th style="padding:6px; border:2px solid #000000;">Chapter Name</th>
              <th style="padding:6px; border:2px solid #000000;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(chapter, index) in filteredChapters(subject.id)" :key="chapter.id" 
                style="background-color:#ffffff; border:2px solid #000000;">
              <td style="padding:6px; border:2px solid #000000; color:#000000;">{{ index + 1 }}</td>
              <td style="padding:6px; border:2px solid #000000; color:#000000;">{{ chapter.name }}</td>
              <td style="padding:6px; border:2px solid #000000;">
                <button @click="editChapter(chapter)" 
                        style="background-color:#333333; color:#ffffff; border:1px solid #333333; padding:4px 8px; font-size:12px; border-radius:4px; margin-right:4px; box-shadow:0 1px 2px rgba(0,0,0,0.3);"
                        @mouseover="hoverButton"
                        @mouseleave="resetButton">
                  Edit
                </button>
                <button @click="deleteChapter(chapter.id, subject.id)" 
                        style="background-color:#000000; color:#ffffff; border:1px solid #000000; padding:4px 8px; font-size:12px; border-radius:4px; margin-right:4px; box-shadow:0 1px 2px rgba(0,0,0,0.3);"
                        @mouseover="hoverButton"
                        @mouseleave="resetButton">
                  Delete
                </button>
                <button @click="openQuizModal(chapter)" 
                        style="background-color:#333333; color:#ffffff; border:1px solid #333333; padding:4px 8px; font-size:12px; border-radius:4px; box-shadow:0 1px 2px rgba(0,0,0,0.3);"
                        @mouseover="hoverButton"
                        @mouseleave="resetButton">
                        
                  Manage Quizzes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

        <!-- Quiz Management Modal -->
<div v-if="showQuizModal" class="modal show d-block fade" tabindex="-1" role="dialog" style="background-color:rgba(0,0,0,0.4);">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content" style="border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.2); border:none;">
      
      <!-- Modal Header -->
      <div class="modal-header" style="background-color:#000000; color:#ffffff; border-radius:8px 8px 0 0; padding:10px 15px;">
        <h5 class="modal-title" style="font-size:16px;">Manage Quizzes for {{ currentChapter ? currentChapter.name : '' }}</h5>
        <button type="button" @click="showQuizModal = false" 
                style="background:none; border:none; font-size:20px; color:#ffffff; cursor:pointer;">&times;</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body" style="padding:15px; background-color:white; border-radius:0 0 8px 8px;">
        <input v-model="newQuiz.title" type="text" placeholder="Quiz Title" 
               style="background-color:#ffffff; border:2px solid #000000; padding:8px; font-size:14px; border-radius:4px; width:100%; margin-bottom:8px; color:#000000;" />
        <input v-model="newQuiz.date" type="date" 
               style="background-color:#ffffff; border:2px solid #000000; padding:8px; font-size:14px; border-radius:4px; width:100%; margin-bottom:8px; color:#000000;" />
        <input v-model="newQuiz.duration" type="number" placeholder="Duration (minutes)" 
               style="background-color:#ffffff; border:2px solid #000000; padding:8px; font-size:14px; border-radius:4px; width:100%; margin-bottom:8px; color:#000000;" />
        <button @click="addQuiz" 
                style="background-color:#000000; color:#ffffff; border:2px solid #000000; padding:8px 16px; font-size:14px; border-radius:4px; width:100%; margin-bottom:10px; box-shadow:0 2px 5px rgba(0,0,0,0.3);"
                @mouseover="hoverButton"
                @mouseleave="resetButton">
          Add Quiz
        </button>

        <!-- Quizzes Table -->
        <table v-if="quizzes.length" style="width:100%; border-collapse:collapse; margin-top:10px; font-size:14px;">
          <thead style="background-color:#000000; color:#ffffff;">
            <tr>
              <th style="padding:6px; border:2px solid #000000;">Title</th>
              <th style="padding:6px; border:2px solid #000000;">Date</th>
              <th style="padding:6px; border:2px solid #000000;">Duration (min)</th>
              <th style="padding:6px; border:2px solid #000000;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.id" style="background-color:#ffffff; border:2px solid #000000;">
              <td style="padding:6px; border:2px solid #000000; color:#000000;">{{ quiz.title }}</td>
              <td style="padding:6px; border:2px solid #000000; color:#000000;">{{ quiz.date }}</td>
              <td style="padding:6px; border:2px solid #000000; color:#000000;">{{ quiz.duration }}</td>
              <td style="padding:6px; border:2px solid #000000;">
                <button @click="editQuiz(quiz)" 
                        style="background-color:#333333; color:#ffffff; border:1px solid #333333; padding:4px 8px; font-size:12px; border-radius:4px; margin-right:4px; box-shadow:0 1px 2px rgba(0,0,0,0.3);"
                        @mouseover="hoverButton"
                        @mouseleave="resetButton">
                  Edit
                </button>
                <button @click="deleteQuiz(quiz.id)" 
                        style="background-color:#000000; color:#ffffff; border:1px solid #000000; padding:4px 8px; font-size:12px; border-radius:4px; margin-right:4px; box-shadow:0 1px 2px rgba(0,0,0,0.3);"
                        @mouseover="hoverButton"
                        @mouseleave="resetButton">
                  Delete
                </button>
                <button @click="openQuestionModal(quiz)" 
                        style="background-color:#000000; color:#ffffff; border:1px solid #000000; padding:4px 8px; font-size:12px; border-radius:4px; box-shadow:0 1px 2px rgba(0,0,0,0.3);"
                        @mouseover="hoverButton"
                        @mouseleave="resetButton">
                  Manage Questions
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else style="text-align:center; color:#666; margin-top:10px;">No quizzes available. Add a new quiz to get started.</p>
      </div>
    </div>
  </div>
</div>


       <!-- Question Management Modal -->
<div v-if="showQuestionModal" class="modal show d-block fade" tabindex="-1" role="dialog" style="background-color:rgba(0,0,0,0.4);">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content" style="border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.2); border:none;">

      <!-- Header Section -->
      <div class="modal-header" style="background-color:#333; color:white; border-radius:8px 8px 0 0; padding:10px 15px;">
        <h5 class="modal-title" style="font-size:16px;">Manage Questions for {{ currentQuiz ? currentQuiz.title : '' }}</h5>
        <button type="button" @click="showQuestionModal_refresh" style="background:none; border:none; font-size:20px; color:white; cursor:pointer;">&times;</button>
      </div>

      <!-- Body Section -->
      <div class="modal-body" style="padding:15px; background-color:white; border-radius:0 0 8px 8px;">
        <!-- Add Question Section -->
        <input v-model="newQuestion.text" type="text" placeholder="Enter Question" 
               style="background-color:whitesmoke; border:1px solid #ccc; padding:8px; font-size:14px; border-radius:4px; width:100%; margin-bottom:10px;" />

        <div v-for="(option, index) in newQuestion.options" :key="index">
          <input v-model="newQuestion.options[index]" type="text" :placeholder="'Option ' + (index + 1)" 
                 style="background-color:whitesmoke; border:1px solid #ccc; padding:8px; font-size:14px; border-radius:4px; width:100%; margin-bottom:8px;" />
        </div>

        <input v-model="newQuestion.correctOption" type="number" placeholder="Correct Option (1-4)" min="1" max="4"
               style="background-color:whitesmoke; border:1px solid #ccc; padding:8px; font-size:14px; border-radius:4px; width:100%; margin-bottom:12px;" />
        
        <button @click="addQuestion" 
                style="background-color:#333; color:white; border:none; padding:8px 16px; font-size:14px; border-radius:4px; width:100%; margin-bottom:10px; box-shadow:0 2px 5px rgba(0,0,0,0.2);"
                @mouseover="hoverButton"
                @mouseleave="resetButton">
          Add Question
        </button>

        <!-- Questions Table -->
        <table v-if="questions.length" style="width:100%; border-collapse:collapse; margin-top:10px; font-size:14px;">
          <thead style="background-color:#333; color:white;">
            <tr>
              <th style="padding:6px; border:1px solid #ddd;">Question</th>
              <th style="padding:6px; border:1px solid #ddd;">Options</th>
              <th style="padding:6px; border:1px solid #ddd;">Correct Option</th>
              <th style="padding:6px; border:1px solid #ddd;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in questions" :key="question.id" style="background-color:white; border:1px solid #ddd;">
              <td style="padding:6px; border:1px solid #ddd;">{{ question.text }}</td>
              <td style="padding:6px; border:1px solid #ddd;">{{ question.options ? question.options.map(opt => opt.text).join(', ') : 'No Options' }}</td>
              <td style="padding:6px; border:1px solid #ddd;">{{ question.correct_option }}</td>
              <td style="padding:6px; border:1px solid #ddd;">
                <button @click="toggleEdit(index)" 
                        style="background-color:#333; color:white; border:none; padding:4px 8px; font-size:12px; border-radius:4px; margin-right:4px; box-shadow:0 1px 2px rgba(0,0,0,0.2);"
                  @mouseover="hoverButton"
                  @mouseleave="resetButton">
                  Edit
                </button>
                <button v-if="currentQuiz && currentQuiz.id" @click="deleteQuestion(index)" 
                        style="background-color:#b33; color:white; border:none; padding:4px 8px; font-size:12px; border-radius:4px; box-shadow:0 1px 2px rgba(0,0,0,0.2);"
                  @mouseover="hoverButton"
                  @mouseleave="resetButton">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else style="text-align:center; color:#666; margin-top:10px;">No questions available. Add one to get started!</p>
      </div>
    </div>
  </div>
</div>

<!-- Edit Form (Visible Only if Editing) -->
<div v-if="editingIndex !== null" class="modal show d-block fade" tabindex="-1" role="dialog" style="background-color:rgba(0,0,0,0.4);">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content" style="border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.2); border:none;">

      <!-- Modal Header -->
      <div class="modal-header" style="background-color:#333; color:white; border-radius:8px 8px 0 0; padding:10px 15px;">
        <h5 class="modal-title" style="font-size:16px;">Edit Question</h5>
        <button type="button" @click="editingIndex = null" style="background:none; border:none; font-size:20px; color:white; cursor:pointer;">&times;</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body" style="padding:15px; background-color:white; border-radius:0 0 8px 8px;">
        <!-- Edit Question Input -->
        <input v-model="questions[editingIndex].text" placeholder="Edit question text"
               style="background-color:whitesmoke; border:1px solid #ccc; padding:8px; font-size:14px; border-radius:4px; width:100%; margin-bottom:10px;" />

        <!-- Edit Options Section -->
        <h6 style="font-size:14px; margin-bottom:8px;">Edit Options</h6>
        <div v-for="(option, i) in questions[editingIndex].options" :key="i" style="margin-bottom:8px;">
          <input v-model="option.text" placeholder="Edit option"
                 style="background-color:whitesmoke; border:1px solid #ccc; padding:8px; font-size:14px; border-radius:4px; width:100%;" />
        </div>

        <!-- Save Changes Button -->
        <button @click="editQuestion(questions[editingIndex])"
                style="background-color:#333; color:white; border:none; padding:8px 16px; font-size:14px; border-radius:4px; width:100%; margin-top:10px; box-shadow:0 2px 5px rgba(0,0,0,0.2);"
                @mouseover="hoverButton"
                @mouseleave="resetButton">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>

  `,
  data() {
    return {
      userData: { username: "Admin" },
      subjects: [],
      chapters: [],
      showAddSubjectForm: false,
      showAddChapterForm: false,
      newChapter: {
        name: "",
        subject_id: 0, // Use null for an unset ID
      },
      quiz_id: this.$route.params.quiz_id, // Ensure quiz_id is available
      editChapterData: null,
      newSubject: { name: "" },
      editSubjectData: null,
      quizzes: [],
      questions: [],
      editQuizData: null,
      editQuestionData: null,
      editingIndex: null,
      currentQuiz: {},
      currentQuestion: {},
      showQuizModal: false,
      showQuestionModal: false,
      currentChapter: {},
      newQuiz: { title: "", chapter_id: "", date: "", duration: "" },
      newQuestion: {
        text: '',
        options: ['', '', '', ''], // Pre-initialize with empty strings
        correctOption: null
      },
      refreshKey: 0, // Initial key value

    };
  },

  mounted() {
    this.loadSubjects();
  },
  computed: {
    filteredChapters() {
      return (subjectId) => {
        return this.chapters.filter(
          (chapter) => chapter.subject_id === subjectId
        );
      };
    },
  },

  methods:{showQuestionModal_refresh(){
    this.showQuestionModal = false;
    setTimeout(() => {
      window.location.reload();
    }, 500); // Adjust the delay if needed
  },
    updateOption(index, value) {
      Vue.set(this.newQuestion.options, index, value);
    }
  
,  
    toggleAddSubjectForm() {
      this.showAddSubjectForm = !this.showAddSubjectForm;
    },
    loadSubjects() {
      fetch("/api/adminhome/getsubject", {
        method: "GET",
        headers: { "Authentication-Token": localStorage.getItem("auth_token") },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            throw new Error("Invalid subject data");
          }

          this.subjects = data;
          console.log("Subjects Loaded:", this.subjects);
          this.chapters = []; // Clear chapters to prevent duplicates
          return Promise.all(
            this.subjects.map((subject) => this.loadChapters(subject.id))
          );
        })
        .then(() => console.log("All chapters loaded successfully"))
        .catch((error) => console.error("Error fetching subjects:", error));
    },

    addSubject() {
      if (!this.newSubject.name) {
        alert("Subject name is required");
        return;
      }

      fetch("/api/adminhome/createsubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token"),
        },
        body: JSON.stringify(this.newSubject),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add subject");
          }
          return response.json();
        })
        .then(() => {
          this.newSubject.name = "";
          this.showAddSubjectForm = false; // Close the form after adding
          this.loadSubjects(); // Reload subjects
          alert("Subject added successfully!");
        })
        .catch((error) => {
          console.error("Error adding subject:", error);
          alert(error.message || "An error occurred while adding the subject.");
        });
    },
    editSubject(subject) {
      const newName = prompt("Enter new subject name:", subject.name);
      if (newName) {
        fetch(`/api/adminhome/updatesubject/${subject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({ name: newName }),
        })
          .then(() => this.loadSubjects())
          .catch((error) => console.error("Error updating subject:", error));
      }
    },

    deleteSubject(id) {
      if (confirm("Are you sure you want to delete this subject?")) {
        fetch(`/api/adminhome/deletesubject/${id}`, {
          method: "DELETE",
          headers: {
            "Authentication-Token": localStorage.getItem("auth_token"),
          },
        })
          .then(() => this.loadSubjects())
          .catch((error) => console.error("Error deleting subject:", error));
      }
    },
    loadChapters(subjectId) {
      fetch(`/api/adminhome/getchapters/${subjectId}`, {
        method: "GET",
        headers: { "Authentication-Token": localStorage.getItem("auth_token") },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Chapters for Subject ${subjectId}:`, data);
          this.chapters = this.chapters.filter(
            (chapter) => chapter.subject_id !== subjectId
          ); // Remove chapters from previous subject before adding new ones
          this.chapters = [...this.chapters, ...data];
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    },

    addChapter(subjectId) {
      if (!this.newChapter.name) {
        alert("Chapter name is required");
        return;
      }

      fetch("/api/adminhome/createchapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token"),
        },
        body: JSON.stringify({
          name: this.newChapter.name,
          subject_id: subjectId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add chapter");
          }
          return response.json();
        })
        .then(() => {
          this.newChapter.name = "";
          this.loadChapters(subjectId);
          alert("Chapter added successfully!");
        })
        .catch((error) => console.error("Error adding chapter:", error));
    },

    editChapter(chapter) {
      const newName = prompt("Enter new chapter name:", chapter.name);
      if (newName) {
        fetch(`/api/adminhome/updatechapter/${chapter.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({
            name: newName,
            subject_id: chapter.subject_id, // Include subject_id
          }),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((err) => {
                throw new Error(err.message);
              });
            }
            return response.json();
          })
          .then(() => this.loadChapters(chapter.subject_id))
          .catch((error) => console.error("Error updating chapter:", error));
      }
    },
    deleteChapter(chapterId) {
      if (confirm("Are you sure you want to delete this chapter?")) {
        fetch(`/api/adminhome/deletechapter/${chapterId}`, {
          method: "DELETE",
          headers: {
            "Authentication-Token": localStorage.getItem("auth_token"),
          },
        })
          .then(() => {
            const subjectId = this.chapters.find(
              (ch) => ch.id === chapterId
            )?.subject_id;
            if (subjectId) this.loadChapters(subjectId);
          })
          .catch((error) => console.error("Error deleting chapter:", error));
      }
    },
    openQuizModal(chapter) {
      console.log("Opening quiz modal for Chapter ID:", chapter.id);
      this.currentChapter = chapter;
      this.showQuizModal = true;
      fetch(`/api/getquiz?chapter_id=${chapter.id}`,{
        method: "GET",
        headers: { "Authentication-Token": localStorage.getItem("auth_token") ,
          "Content-Type": "application/json",},
      })
        .then((response) => response.json())
        .then((data) => {
          this.quizzes = Array.isArray(data) ? data : [];
        })
        .catch((error) => console.error("Error fetching quizzes:", error));
    },
    addQuiz() {
      if (!this.newQuiz.title || !this.newQuiz.date || !this.newQuiz.duration) {
        alert("Please fill in all fields.");
        return;
      }
      this.newQuiz.chapter_id = this.currentChapter?.id;
      fetch("/api/createquiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token"),
        },
        body: JSON.stringify(this.newQuiz),
      })
        .then((response) => response.json())
        .then(() => this.fetchQuizzes()) // refreshes the quizes
        .then((data) => {
          if (data && data.id) {
            this.quizzes.push(data);
            this.newQuiz = {
              title: "",
              date: "",
              duration: "",
              chapter_id: this.currentChapter.id,
            };
          }
        })
        .catch((error) => console.error("Error adding quiz:", error));
    },
    editQuiz(quiz) {
      const newTitle = prompt("Enter new quiz title:", quiz.title);
      if (newTitle) {
        fetch(`/api/updatequiz/${quiz.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" ,
          "Authentication-Token": localStorage.getItem("auth_token")
          },
          body: JSON.stringify({ title: newTitle }),
        })
          .then((response) => response.json())
          .then(() => this.fetchQuizzes())
          .catch((error) => console.error("Error updating quiz:", error));
      }
    },
    deleteQuiz(quizId) {
      fetch(`/api/deletequiz/${quizId}`, {
        method: "DELETE",
        headers: { "Authentication-Token": localStorage.getItem("auth_token") },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete quiz");
          return response.json();
        })
        .then(() => {
          this.quizzes = this.quizzes.filter((q) => q.id !== quizId);
        })
        .catch((error) => console.error("Error deleting quiz:", error));
    },
    fetchQuizzes() {
      fetch(`/api/getquiz?chapter_id=${this.currentChapter.id}`,{
        headers: {
        "Content-Type": "application/json",
        "Authentication-Token": localStorage.getItem("auth_token"),
      },})
        .then((response) => response.json())
        .then((data) => (this.quizzes = data))
        .catch((error) => console.error("Error fetching quizzes:", error));
    },
    openQuestionModal(quiz) {
      this.currentQuiz = quiz;
      this.showQuestionModal = true;
      console.log("Quiz ID:", this.currentQuiz.id);
      fetch(`/api/quiz/${this.currentQuiz.id}/question`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")},
        
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => (this.questions = data))
        .catch((error) => console.error("Error fetching questions:", error));
    },

    addQuestion() {
      if (!this.currentQuiz || !this.currentQuiz.id) {
        console.error("Current quiz is not defined or invalid.");
        return;
      }
    
      if (!this.newQuestion?.text?.trim()) {
        alert("Question text is required.");
        return;
      }
    
      if (!Array.isArray(this.newQuestion.options) || this.newQuestion.options.length < 2 || this.newQuestion.options.length > 4) {
        alert("Please provide 2 to 4 options.");
        return;
      }
    
      const correctOptionIndex = parseInt(this.newQuestion.correctOption, 10);
      if (isNaN(correctOptionIndex) || correctOptionIndex < 0 || correctOptionIndex > this.newQuestion.options.length) {
        alert("Invalid correct option.");
        return;
      }
    
      const requestBody = {
        text: this.newQuestion.text,
        options: this.newQuestion.options,
        correct_option: correctOptionIndex,
      };
    
      fetch(`/api/quiz/${this.currentQuiz.id}/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization-Token": localStorage.getItem("auth_token"),
        },
          body: JSON.stringify(requestBody),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
  console.log('Question Added:', data);

  // Refresh questions for the current quiz
  this.fetchQuestions(this.currentQuiz.id);
  setTimeout(() => {
    alert("Question added successfully!");
  }, 500); // Short delay before proceeding
  // Reset form
  this.newQuestion = {
    text: "",
    options: ["", "", "", ""],
    correctOption: "",
  };
})

        .catch((error) => console.error("Error adding question:", error));
    }
    
,toggleEdit(index) {
  this.editingIndex = index; // Set editingIndex to show the form
  console.log('Editing question at index:', index);
}
,
editQuestion(question) {
  if (!question.option_ids || question.option_ids.length !== question.options.length) {
    question.option_ids = question.options.map((opt) => opt.option_id);
  }

  const updatedOptions = question.options.map((option, index) => ({
    option_id: option.option_id || question.option_ids[index],
    text: option.text,
  }));

  fetch(`/api/questions/${question.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedOptions),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      this.editingIndex = null; // Close the form
    })
    .catch((error) => {
      console.error("Error updating question:", error);
      alert(error.message || "An error occurred while updating the question.");
    });
}

, 
  updateOption(index, value) {
    this.$set(this.newQuestion.options, index, value);
}
, 
deleteQuestion(index) {
  const question = this.questions[index];
  fetch(`/api/questions/${question.id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    if (response.ok) {
      this.questions.splice(index, 1);
      console.log("Question deleted successfully.");
    } else {
      response.json().then(data => console.error("Error:", data.message));
    }
  })
  .catch(error => console.error("Error deleting question:", error));
}
,fetchQuestions(quizId) {
  if (!quizId) {
    console.error("Quiz ID is required to fetch questions.");
    return;
  }

  fetch(`/api/quiz/${quizId}/question`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization-Token": localStorage.getItem("auth_token")},
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched Questions:', data);
      this.questions = data; // Assuming API returns a list of questions
    })
    .catch(error => console.error('Error fetching questions:', error));
}



,

    created() {
      this.loadSubjects();
    }, hoverButton(event) {
      event.target.style.backgroundColor = '#2c2c2c';
      event.target.style.color = '#ffffff';
      event.target.style.transform = 'scale(1.05)';
      event.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
    },
    resetButton(event) {
      event.target.style.backgroundColor = '#ffffff';
      event.target.style.color = '#2c2c2c';
      event.target.style.transform = 'scale(1)';
      event.target.style.boxShadow = 'none';
    }
  },
};
