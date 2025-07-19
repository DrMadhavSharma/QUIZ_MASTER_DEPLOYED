(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function s(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=s(r);fetch(r.href,i)}})();const c={template:`
<div>
  <div class="container-fluid">
    <!-- Hero Section -->
    <div class="row vh-100 bg-primary text-white d-flex align-items-center justify-content-center text-center" 
      style="background-image: url('https://via.placeholder.com/1500'); background-size: cover; background-position: center;">
      <div class="col">
        <h1 class="display-4 fw-bold" 
          style="animation: bounceIn 1.5s both;">
          WELCOME TO QUIZ MASTER
        </h1>
        <p class="lead mb-4" 
          style="animation: fadeIn 1.5s;">
          Test your knowledge and become the ultimate quiz champion!
        </p>
        <router-link class="btn btn-lg btn-warning" 
          style="animation: pulse 1.5s infinite;" to="/login">Start Quiz</router-link>
      </div>
    </div>

    <!-- Features Section -->
    <div class="row py-5 bg-info text-white">
      <div class="col text-center">
        <h2 class="fw-bold mb-4">Why Choose Quiz Master?</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card border-0 shadow-lg bg-light rounded">
              <div class="card-body">
                <h3 class="card-title text-primary">Interactive Quizzes</h3>
                <p class="card-text">Enjoy interactive quizzes with multiple difficulty levels.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-0 shadow-lg bg-light rounded">
              <div class="card-body">
                <h3 class="card-title text-primary">Real-time Scores</h3>
                <p class="card-text">Track your performance and compete with others in real-time!</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-0 shadow-lg bg-light rounded">
              <div class="card-body">
                <h3 class="card-title text-primary">Detailed Analytics</h3>
                <p class="card-text">Gain insights into your strengths and areas to improve.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Section -->
    <div class="row bg-dark text-white py-5">
      <div class="col text-center">
        <h2 class="fw-bold mb-4">Ready to Challenge Yourself?</h2>
        <p class="lead mb-4">Join thousands of others in the ultimate quiz showdown!</p>
        <router-link class="btn btn-lg btn-success" 
          style="animation: heartBeat 1.5s infinite;" to="/login">Get Started</router-link>
      </div>
    </div>

    <!-- Footer Section -->
    
  </div>
</div`},d={template:`
    <div class="row justify-content-center align-items-center" style="height: 100vh; background-color: #f8f9fa;">
  <div class="col-12 col-md-8 col-lg-4">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-5">
        <h2 class="text-center text-primary mb-4">Welcome Back!</h2>
        
        <p v-if="message" class="text-center text-danger">{{ message }}</p>
        <form @submit.prevent="loginUser">
       
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="name@example.com" required>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Enter your password" required>
          </div>

          <div class="d-grid">
            <button class="btn btn-primary btn-lg" @click="loginUser">Login</button>
          </div>
        </form>
        <p class="text-center mt-3 text-muted">Don't have an account? <router-link class="btn btn-warning me-2" to="/register">Register</router-link></p>
      </div> 
    </div>
  </div>
</div>`,data:function(){return{formData:{email:"",password:""},message:""}},methods:{loginUser:function(){fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>t.json()).then(t=>{console.log(t),Object.keys(t).includes("auth-token")?(localStorage.setItem("auth_token",t["auth-token"]),localStorage.setItem("id",t.id),localStorage.setItem("username",t.username),t.roles.includes("admin")?this.$router.push("/admin"):this.$router.push("/dashboard")):this.message=t.message})}}},u={template:`
    <div class="row justify-content-center align-items-center" style="height: 100vh; background-color: #f8f9fa;">
  <div class="col-md-4">
    <div class="card shadow-lg p-4 rounded-4">
      <h2 class="text-center text-primary mb-4">Create an Account</h2>
      
      <div class="mb-3">
        <label for="email" class="form-label">Email Address</label>
        <input type="text" id="email" class="form-control" v-model="formData.email" placeholder="Enter your email" required>
      </div>
      
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" id="username" class="form-control" v-model="formData.username" placeholder="Choose a username" required>
      </div>

      <div class="mb-3">
        <label for="pass" class="form-label">Password</label>
        <input type="password" id="pass" class="form-control" v-model="formData.password" placeholder="Create a password" required>
      </div>
      
      <div class="text-center">
        <button class="btn btn-primary btn-lg w-100" @click="addUser">Register</button>
      </div>
    </div>
  </div>
</div>`,data:function(){return{formData:{email:"",password:"",username:""}}},methods:{addUser:function(){fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>t.json()).then(t=>{alert(t.message),this.$router.push("/login")})}}},h={template:`
<div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg" style="background-color: #003366; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
    <div class="container-fluid">
      <!-- Brand with Hover Animation -->
      <a class="navbar-brand fs-2 text-warning fw-bold" href="#"
         :style="{ color: navbarColor }" 
         @mouseover="changeColor('#ff6600')" 
         @mouseleave="changeColor('#ffcc00')">QUIZ MASTER</a>

      <!-- Mobile Menu Toggle -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" 
        style="border: none; background-color: transparent;">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- SCORES and Summary Buttons -->
      <div id="SCORES" class="text-center mt-4">
        <button @click="MOVETOSCORES()" class="btn btn-outline-light mx-2 btn-lg" 
          style="transition: all 0.3s ease-in-out;" 
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">SCORES</button>
        <button @click="MOVETOSUMMARY()" class="btn btn-outline-light mx-2 btn-lg" 
          style="transition: all 0.3s ease-in-out;" 
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Summary</button>
        
      </div>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <router-link id="routerl" class="btn btn-outline-light me-2" to="/adminSummary" 
          style="transition: all 0.3s ease-in-out;" 
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">SUMMARY</router-link>

        <!-- Admin-only Search Bar -->
        <form id="search" class=" me-auto" @submit.prevent="performSearch">
          <input class="form-control me-2" type="search" v-model="searchQuery" placeholder="Search quizzes" aria-label="Search"
            style="border-radius: 5px; padding: 0.5rem;">
          <select v-model="searchCategory" class="form-select me-2" style="border-radius: 5px; padding: 0.5rem;">
            <option value="users">Users</option>
            <option value="subjects">Subjects</option>
            <option value="quizzes">Quizzes</option>
            <option value="chapters">Chapters</option>
            <option value="options">Options</option>
          </select>
          <button class="btn btn-outline-success" type="submit" 
            style="border-radius: 5px; padding: 0.5rem;">Search</button>
        </form>

        <!-- No Results Modal -->
        <div v-if="searchPerformed && !results.length" class="modal fade show d-block" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">No Results Found</h5>
                <button type="button" class="btn-close" @click="searchPerformed = false;" 
                  style="background-color: transparent; border: none;">&times;</button>
              </div>
              <div class="modal-body">
                <p>No results match your search query. Please try again.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="searchPerformed = false;" 
                  style="border-radius: 5px;">Close</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Modal -->
        <div v-if="results.length" class="modal fade show d-block" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Search Results</h5>
                <button type="button" class="btn-close" @click="results = []; searchPerformed = false;" 
                  style="background-color: transparent; border: none;">&times;</button>
              </div>
              <div class="modal-body">
                <ul>
                  <li v-for="result in results" :key="result.id">
                    {{ result.name || result.title || result.username || result.text || result.email }}
                  </li>
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="results = []; searchPerformed = false;" 
                  style="border-radius: 5px;">Close</button>
              </div>
            </div>
          </div>
        </div>

        <!-- User Authentication Links -->
        <ul class="navbar-nav align-items-center">
          <li class="nav-item">
            <router-link class="btn btn-outline-light me-2" to="/login" 
              style="transition: all 0.3s ease-in-out;
              " 
              @mouseover="hoverButton($event)" 
              @mouseleave="resetButton($event)">Login</router-link>
          </li>
          <li class="nav-item">
            <button class="btn btn-danger" @click="logout" 
              style="transition: all 0.3s ease-in-out;" 
              @mouseover="hoverButton($event)" 
              @mouseleave="resetButton($event)">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
 `,data:function(){return{loggedIn:localStorage.getItem("auth_token"),searchQuery:"",searchCategory:"users",results:[],error:"",searchPerformed:!1,userId:null,authToken:localStorage.getItem("authToken"),navbarColor:"#ffcc00"}},mounted(){this.checkSearchVisibility(),this.CHECKSCORESVISIBILITY()},watch:{$route(t){console.log("URL changed:",t.fullPath),this.checkSearchVisibility(),this.CHECKSCORESVISIBILITY()},authToken(t,e){this.checkSearchVisibility(),this.CHECKSCORESVISIBILITY()}},props:{isAdmin:Boolean},methods:{logout(){fetch("/logout",{method:"GET",credentials:"include"}).then(t=>{t.ok?(localStorage.removeItem("userRole"),localStorage.removeItem("auth_token"),alert("Logged out successfully!"),this.$router.push("/login")):alert("Logout failed. Please try again.")}).catch(t=>{console.error("Logout error:",t)})},checkSearchVisibility(){const t=this.$route.path,e=document.getElementById("search"),s=document.getElementById("routerl");t.includes("admin")?(e.style.display="flex",s.style.display="flex",console.log("Admin detected via router")):(e.style.display="none",s.style.display="none",console.log("Not an admin via router"))},async performSearch(){if(!this.searchQuery){this.error="Please enter a search query";return}this.error="",this.searchPerformed=!0;const t=localStorage.getItem("auth_token");if(console.log("Token:",t),!t){this.error="Authentication token not found";return}try{const e=await fetch(`/search/${this.searchCategory}?q=${encodeURIComponent(this.searchQuery)}`,{method:"GET",headers:{"Authentication-Token":t,Accept:"application/json"}});if(!e.ok){const s=await e.json().catch(()=>null);throw new Error((s==null?void 0:s.error)||`HTTP Error ${e.status}`)}this.results=await e.json()}catch(e){this.error=e.message,console.error("Error:",e),this.results=[]}},MOVETOSCORES(){const t=localStorage.getItem("id");this.$router.push({path:`/scores/${t}`})},MOVETOSUMMARY(){const t=localStorage.getItem("id");this.$router.push({path:`/summary/${t}`})},CHECKSCORESVISIBILITY(){const t=this.$route.path,e=document.getElementById("SCORES"),s=localStorage.getItem("auth_token");!t.includes("admin")&s!=null?(e.style.display="flex",console.log("registered user detected via router")):(e.style.display="none",console.log("Not a user via router"))},changeColor(t){this.navbarColor=t},hoverButton(t){t.target.style.transform="scale(1.1)",t.target.style.boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"},resetButton(t){t.target.style.transform="scale(1)",t.target.style.boxShadow="none"}}},m={template:`
    <div class="row bg-secondary text-white text-center py-4">
        <div class="col">
            <div class="text-center mt-2">
                <p> QUIZ MASTER  | &copy; copyright 2025 | created  by 23F3004142 </p>
            </div>
        </div>
    </div>`},p={template:`
<div>

<!-- Existing Content -->
<div>
  <div class="container mt-5">
    <h2>Subjects</h2>
    
    <!-- Add Subject Section -->
    <div class="col-12 text-end  ">
      <button class="btn btn-primary" @click="showAddSubjectForm = !showAddSubjectForm">
        {{ showAddSubjectForm ? 'Cancel' : 'Add Subject' }}
      </button>
    </div>
    
    <div v-if="showAddSubjectForm" class="col-12">
      <input v-model="newSubject.name" type="text" placeholder="Enter Subject Name" class="form-control mb-2" />
      <button @click="addSubject" class="btn btn-success">Add</button>
    </div>
    
    <!-- Subjects and Chapters Section -->
    <div class="row container-fluid bg-gradient bg-info p-4">
  <div class="col-md-6 mb-4" v-for="subject in subjects" :key="subject.id">
    <div class="card shadow-lg border-0">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{{ subject.name }}</h5>
        <div>
          <button class="btn btn-warning btn-sm me-2" @click="editSubject(subject)">Edit</button>
          <button class="btn btn-danger btn-sm" @click="deleteSubject(subject.id)">Delete</button>
        </div>
      </div>

      <div class="card-body">
        <h6 class="text-success">Chapters:</h6>
        <input v-model="newChapter.name" type="text" placeholder="Enter Chapter Name" class="form-control mb-2" />
        <button @click="addChapter(subject.id)" class="btn btn-primary btn-sm mb-3">Add Chapter</button>

        <table class="table table-hover table-striped table-bordered" v-if="filteredChapters(subject.id).length">
          <thead class="table-dark">
            <tr>
              <th>Serial No.</th>
              <th>Chapter Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(chapter, index) in filteredChapters(subject.id)" :key="chapter.id">
              <td>{{ index + 1 }}</td>
              <td>{{ chapter.name }}</td>
              <td>
                <button @click="editChapter(chapter)" class="btn btn-sm btn-primary me-1">Edit</button>
                <button @click="deleteChapter(chapter.id, subject.id)" class="btn btn-sm btn-danger me-1">Delete</button>
                <button @click="openQuizModal(chapter)" class="btn btn-sm btn-info">Manage Quizzes</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

        <!-- Quiz Management Modal -->
<div v-if="showQuizModal" class="modal show d-block fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content shadow-lg border-0">
      <div class="modal-header bg-success text-white">
        <h5 class="modal-title">Manage Quizzes for {{ currentChapter ? currentChapter.name : '' }}</h5>
        <button type="button" class="btn-close" @click="showQuizModal = false"></button>
      </div>

      <div class="modal-body">
        <input v-model="newQuiz.title" type="text" placeholder="Quiz Title" class="form-control mb-2" />
        <input v-model="newQuiz.date" type="date" class="form-control mb-2" />
        <input v-model="newQuiz.duration" type="number" placeholder="Duration (minutes)" class="form-control mb-2" />
        <button @click="addQuiz" class="btn btn-success w-100">Add Quiz</button>

        <!-- Quizzes Table -->
        <table class="table table-hover table-striped mt-3" v-if="quizzes.length">
          <thead class="table-primary">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Duration (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.id">
              <td>{{ quiz.title }}</td>
              <td>{{ quiz.date }}</td>
              <td>{{ quiz.duration }}</td>
              <td>
                <button @click="editQuiz(quiz)" class="btn btn-sm btn-warning me-1">Edit</button>
                <button @click="deleteQuiz(quiz.id)" class="btn btn-sm btn-danger me-1">Delete</button>
                <button @click="openQuestionModal(quiz)" class="btn btn-sm btn-info">Manage Questions</button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-muted text-center mt-3">No quizzes available. Add a new quiz to get started.</p>
      </div>
    </div>
  </div>
</div>

        <!-- Question Management Modal -->
<div v-if="showQuestionModal" class="modal show d-block fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content shadow-lg border-0">
      <!-- Header Section -->
      <div class="modal-header bg-warning text-dark">
        <h5 class="modal-title">Manage Questions for {{ currentQuiz ? currentQuiz.title : '' }}</h5>
        <button type="button" class="btn-close" @click="showQuestionModal_refresh"></button>
      </div>

      <!-- Body Section -->
      <div class="modal-body">
        <!-- Add Question Section -->
        <input v-model="newQuestion.text" type="text" placeholder="Enter Question" class="form-control mb-3" />
        
        <div v-for="(option, index) in newQuestion.options" :key="index">
          <input
            v-model="newQuestion.options[index]"
            type="text"
            :placeholder="'Option ' + (index + 1)"
            class="form-control mb-2"
          />
        </div>

        <input
          v-model="newQuestion.correctOption"
          type="number"
          placeholder="Correct Option (1-4)"
          class="form-control mb-3" min="1" max="4"
        />
        
        <button @click="addQuestion" class="btn btn-success w-100">Add Question</button>

        <!-- Questions Table -->
        <table class="table table-hover table-striped mt-4" v-if="questions.length">
          <thead class="table-success">
            <tr>
              <th>Question</th>
              <th>Options</th>
              <th>Correct Option</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in questions" :key="question.id">
              <td>{{ question.text }}</td>
              <td>{{ question.options ? question.options.map(opt => opt.text).join(', ') : 'No Options' }}</td>
              <td>{{ question.correct_option }}</td>
              <td>
                <button @click="toggleEdit(index)" class="btn btn-primary btn-sm me-1">Edit</button>
                <button
                  v-if="currentQuiz && currentQuiz.id"
                  @click="deleteQuestion(index)"
                  class="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-center text-muted mt-4">No questions available. Add one to get started!</p>
      </div>
    </div>
  </div>
</div>
<!-- Edit Form (Visible Only if Editing) -->
<div v-if="editingIndex !== null" class="modal show d-block fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content shadow-lg border-0">
      <!-- Modal Header -->
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">Edit Question</h5>
        <button type="button" class="btn-close" @click="editingIndex = null"></button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Edit Question Input -->
        <input 
          v-model="questions[editingIndex].text" 
          placeholder="Edit question text" 
          class="form-control mb-3"
        />

        <!-- Edit Options Section -->
        <h6 class="mb-3">Edit Options</h6>
        <div v-for="(option, i) in questions[editingIndex].options" :key="i" class="mb-2">
          <input 
            v-model="option.text" 
            placeholder="Edit option"  
            class="form-control"
          />
        </div>

        <!-- Save Changes Button -->
        <button 
          class="btn btn-success w-100"
          @click="editQuestion(questions[editingIndex])"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>

</div>
  `,data(){return{userData:{username:"Admin"},subjects:[],chapters:[],showAddSubjectForm:!1,showAddChapterForm:!1,newChapter:{name:"",subject_id:0},quiz_id:this.$route.params.quiz_id,editChapterData:null,newSubject:{name:""},editSubjectData:null,quizzes:[],questions:[],editQuizData:null,editQuestionData:null,editingIndex:null,currentQuiz:{},currentQuestion:{},showQuizModal:!1,showQuestionModal:!1,currentChapter:{},newQuiz:{title:"",chapter_id:"",date:"",duration:""},newQuestion:{text:"",options:["","","",""],correctOption:null},refreshKey:0}},mounted(){this.loadSubjects()},computed:{filteredChapters(){return t=>this.chapters.filter(e=>e.subject_id===t)}},methods:{showQuestionModal_refresh(){this.showQuestionModal=!1,setTimeout(()=>{window.location.reload()},500)},updateOption(t,e){Vue.set(this.newQuestion.options,t,e)},toggleAddSubjectForm(){this.showAddSubjectForm=!this.showAddSubjectForm},loadSubjects(){fetch("/api/adminhome/getsubject",{method:"GET",headers:{"Authentication-Token":localStorage.getItem("auth_token")}}).then(t=>t.json()).then(t=>{if(!Array.isArray(t))throw new Error("Invalid subject data");return this.subjects=t,console.log("Subjects Loaded:",this.subjects),this.chapters=[],Promise.all(this.subjects.map(e=>this.loadChapters(e.id)))}).then(()=>console.log("All chapters loaded successfully")).catch(t=>console.error("Error fetching subjects:",t))},addSubject(){if(!this.newSubject.name){alert("Subject name is required");return}fetch("/api/adminhome/createsubject",{method:"POST",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")},body:JSON.stringify(this.newSubject)}).then(t=>{if(!t.ok)throw new Error("Failed to add subject");return t.json()}).then(()=>{this.newSubject.name="",this.showAddSubjectForm=!1,this.loadSubjects(),alert("Subject added successfully!")}).catch(t=>{console.error("Error adding subject:",t),alert(t.message||"An error occurred while adding the subject.")})},editSubject(t){const e=prompt("Enter new subject name:",t.name);e&&fetch(`/api/adminhome/updatesubject/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")},body:JSON.stringify({name:e})}).then(()=>this.loadSubjects()).catch(s=>console.error("Error updating subject:",s))},deleteSubject(t){confirm("Are you sure you want to delete this subject?")&&fetch(`/api/adminhome/deletesubject/${t}`,{method:"DELETE",headers:{"Authentication-Token":localStorage.getItem("auth_token")}}).then(()=>this.loadSubjects()).catch(e=>console.error("Error deleting subject:",e))},loadChapters(t){fetch(`/api/adminhome/getchapters/${t}`,{method:"GET",headers:{"Authentication-Token":localStorage.getItem("auth_token")}}).then(e=>{if(!e.ok)throw new Error(`HTTP Error! Status: ${e.status}`);return e.json()}).then(e=>{console.log(`Chapters for Subject ${t}:`,e),this.chapters=this.chapters.filter(s=>s.subject_id!==t),this.chapters=[...this.chapters,...e]}).catch(e=>console.error("Error fetching chapters:",e))},addChapter(t){if(!this.newChapter.name){alert("Chapter name is required");return}fetch("/api/adminhome/createchapter",{method:"POST",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")},body:JSON.stringify({name:this.newChapter.name,subject_id:t})}).then(e=>{if(!e.ok)throw new Error("Failed to add chapter");return e.json()}).then(()=>{this.newChapter.name="",this.loadChapters(t),alert("Chapter added successfully!")}).catch(e=>console.error("Error adding chapter:",e))},editChapter(t){const e=prompt("Enter new chapter name:",t.name);e&&fetch(`/api/adminhome/updatechapter/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")},body:JSON.stringify({name:e,subject_id:t.subject_id})}).then(s=>s.ok?s.json():s.json().then(o=>{throw new Error(o.message)})).then(()=>this.loadChapters(t.subject_id)).catch(s=>console.error("Error updating chapter:",s))},deleteChapter(t){confirm("Are you sure you want to delete this chapter?")&&fetch(`/api/adminhome/deletechapter/${t}`,{method:"DELETE",headers:{"Authentication-Token":localStorage.getItem("auth_token")}}).then(()=>{var s;const e=(s=this.chapters.find(o=>o.id===t))==null?void 0:s.subject_id;e&&this.loadChapters(e)}).catch(e=>console.error("Error deleting chapter:",e))},openQuizModal(t){console.log("Opening quiz modal for Chapter ID:",t.id),this.currentChapter=t,this.showQuizModal=!0,fetch(`/api/getquiz?chapter_id=${t.id}`,{method:"GET",headers:{"Authentication-Token":localStorage.getItem("auth_token"),"Content-Type":"application/json"}}).then(e=>e.json()).then(e=>{this.quizzes=Array.isArray(e)?e:[]}).catch(e=>console.error("Error fetching quizzes:",e))},addQuiz(){var t;if(!this.newQuiz.title||!this.newQuiz.date||!this.newQuiz.duration){alert("Please fill in all fields.");return}this.newQuiz.chapter_id=(t=this.currentChapter)==null?void 0:t.id,fetch("/api/createquiz",{method:"POST",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")},body:JSON.stringify(this.newQuiz)}).then(e=>e.json()).then(()=>this.fetchQuizzes()).then(e=>{e&&e.id&&(this.quizzes.push(e),this.newQuiz={title:"",date:"",duration:"",chapter_id:this.currentChapter.id})}).catch(e=>console.error("Error adding quiz:",e))},editQuiz(t){const e=prompt("Enter new quiz title:",t.title);e&&fetch(`/api/updatequiz/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")},body:JSON.stringify({title:e})}).then(s=>s.json()).then(()=>this.fetchQuizzes()).catch(s=>console.error("Error updating quiz:",s))},deleteQuiz(t){fetch(`/api/deletequiz/${t}`,{method:"DELETE",headers:{"Authentication-Token":localStorage.getItem("auth_token")}}).then(e=>{if(!e.ok)throw new Error("Failed to delete quiz");return e.json()}).then(()=>{this.quizzes=this.quizzes.filter(e=>e.id!==t)}).catch(e=>console.error("Error deleting quiz:",e))},fetchQuizzes(){fetch(`/api/getquiz?chapter_id=${this.currentChapter.id}`,{headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")}}).then(t=>t.json()).then(t=>this.quizzes=t).catch(t=>console.error("Error fetching quizzes:",t))},openQuestionModal(t){this.currentQuiz=t,this.showQuestionModal=!0,console.log("Quiz ID:",this.currentQuiz.id),fetch(`/api/quiz/${this.currentQuiz.id}/question`,{method:"GET",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")}}).then(e=>{if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);return e.json()}).then(e=>this.questions=e).catch(e=>console.error("Error fetching questions:",e))},addQuestion(){var s,o;if(!this.currentQuiz||!this.currentQuiz.id){console.error("Current quiz is not defined or invalid.");return}if(!((o=(s=this.newQuestion)==null?void 0:s.text)!=null&&o.trim())){alert("Question text is required.");return}if(!Array.isArray(this.newQuestion.options)||this.newQuestion.options.length<2||this.newQuestion.options.length>4){alert("Please provide 2 to 4 options.");return}const t=parseInt(this.newQuestion.correctOption,10);if(isNaN(t)||t<0||t>this.newQuestion.options.length){alert("Invalid correct option.");return}const e={text:this.newQuestion.text,options:this.newQuestion.options,correct_option:t};fetch(`/api/quiz/${this.currentQuiz.id}/question`,{method:"POST",headers:{"Content-Type":"application/json","Authorization-Token":localStorage.getItem("auth_token")},body:JSON.stringify(e)}).then(r=>{if(!r.ok)throw new Error(`HTTP error! Status: ${r.status}`);return r.json()}).then(r=>{console.log("Question Added:",r),this.fetchQuestions(this.currentQuiz.id),setTimeout(()=>{alert("Question added successfully!")},500),this.newQuestion={text:"",options:["","","",""],correctOption:""}}).catch(r=>console.error("Error adding question:",r))},toggleEdit(t){this.editingIndex=t,console.log("Editing question at index:",t)},editQuestion(t){(!t.option_ids||t.option_ids.length!==t.options.length)&&(t.option_ids=t.options.map(s=>s.option_id));const e=t.options.map((s,o)=>({option_id:s.option_id||t.option_ids[o],text:s.text}));fetch(`/api/questions/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify(e)}).then(s=>s.ok?s.json():s.json().then(o=>Promise.reject(o))).then(s=>{alert(s.message),this.editingIndex=null}).catch(s=>{console.error("Error updating question:",s),alert(s.message||"An error occurred while updating the question.")})},updateOption(t,e){this.$set(this.newQuestion.options,t,e)},deleteQuestion(t){const e=this.questions[t];fetch(`/api/questions/${e.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(s=>{s.ok?(this.questions.splice(t,1),console.log("Question deleted successfully.")):s.json().then(o=>console.error("Error:",o.message))}).catch(s=>console.error("Error deleting question:",s))},fetchQuestions(t){if(!t){console.error("Quiz ID is required to fetch questions.");return}fetch(`/api/quiz/${t}/question`,{headers:{"Content-Type":"application/json","Authorization-Token":localStorage.getItem("auth_token")}}).then(e=>{if(!e.ok)throw new Error(`Failed to fetch questions: ${e.status}`);return e.json()}).then(e=>{console.log("Fetched Questions:",e),this.questions=e}).catch(e=>console.error("Error fetching questions:",e))},created(){this.loadSubjects()}}},b={template:`
    <div class="container py-5">
  <!-- Header Section -->
  <div class="text-center mb-4">
    <h1 class="fw-bold text-primary">👤 USER_HOME 😊</h1>
    <h2 class="text-secondary">All Available Quizzes</h2>
    <div>
      <router-link  class="btn btn-outline-dark mx-2 btn-lg" to="/payment" 
        style="transition: all 0.3s ease-in-out;" 
        >PAYMENT</router-link>
  </div>
  </div>
  

  <!-- Quizzes Table Section -->
  <div v-if="quizzes.length">
    <div class="table-responsive">
      <table class="table table-hover table-striped table-bordered shadow">
        <thead class="table-dark">
          <tr>
            <th>S no.</th>
            <th>📚 Title</th>
            <th>📅 Date</th>
            <th>⏳ Duration (min)</th>
            <th>CHAPTER</th>
            <th>🚀 Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quiz in quizzes" :key="quiz.id">
            <td class="fw-bold">{{ quiz.id }}</td>
            <td>{{ quiz.title }}</td>
            <td>{{ quiz.date }}</td>
            <td>{{ quiz.duration }}</td>
            <td>{{ quiz.chapter?.name || 'Unknown' }}</td>
              <button class="btn btn-success btn-sm" @click="startQuiz(quiz)">
                🎯 Start Quiz
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- No Quizzes Message Section -->
  <div v-else class="text-center">
    <p class="text-danger fw-bold">⚠️ No quizzes available at the moment. Please check back later!</p>
  </div>

  <!-- Back to Dashboard Button -->
  <div class="text-center mt-4">
    <router-link to="/dashboard" class="btn btn-outline-secondary">
      🔙 Back to Dashboard
    </router-link>
  </div>
</div>

    `,data(){return{quizzes:[],userId:null}},methods:{fetchQuizzes(){console.log("Fetching quizzes..."),fetch("/api/getquiz",{method:"GET",headers:{"Authentication-Token":localStorage.getItem("auth_token"),"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{this.quizzes=Array.isArray(t)?t:[]}).catch(t=>console.error("Error fetching quizzes:",t))},startQuiz(t){if(!t||!t.id||!t.duration){console.error("Quiz ID or duration is missing!");return}console.log(`Starting quiz with ID: ${t.id}, Duration: ${t.duration}`),this.$router.push({path:`/quiz/${t.id}`,query:{duration:t.duration}})}},mounted(){this.fetchQuizzes()}},v={template:`
    <div class="container py-5">
  <!-- Timer and Progress Section -->
  <div v-if="questions.length">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <h4 class="me-2 text-primary fw-bold">⏳ TIME LEFT:</h4>
        <span class="badge bg-danger fs-4 p-3 shadow">{{ formattedTime }}</span>
      </div>
      <div class="d-flex align-items-center">
        <h5 class="me-2">✅ Questions Attempted:</h5>
        <span class="badge bg-success fs-5 p-2">{{ attemptedQuestions }} / {{ questions.length }}</span>
      </div>
    </div>

    <!-- Question Card -->
    <div class="card shadow-lg border-0 p-4 mb-4">
      <h5 class="fw-bold text-dark mb-4">{{ currentIndex + 1 }}. {{ currentQuestion.text }}</h5>

      <!-- Options Section with Highlight on Hover -->
      <div class="list-group">
        <label
          class="list-group-item list-group-item-action py-3"
          v-for="(option, optIndex) in currentQuestion.options"
          :key="optIndex"
        >
          <input
            type="radio"
            :name="'question-' + currentQuestion.id  "
            :value="optIndex"
            v-model="userAnswers[currentQuestion.id]"
            @change="{setUserAnswer(optIndex),updateAttemptedCount()}"
            class="form-check-input me-2"
          />
          {{ option.text  }}
        </label>
      </div>

      <!-- Navigation Buttons -->
      <div class="d-flex justify-content-between mt-4">
        <button class="btn btn-outline-secondary" @click="prevQuestion" :disabled="currentIndex === 0">
          ⬅️ Previous
        </button>
        <button class="btn btn-primary" @click="nextQuestion" v-if="currentIndex < questions.length - 1">
          Next ➡️
        </button>
        <button class="btn btn-success" @click="submitAnswers" v-if="currentIndex === questions.length - 1">
          ✅ Submit Answers
        </button>
      </div>
    </div>
  </div>

  <!-- No Questions Section -->
  <div v-else class="text-center">
    <p class="text-danger fw-bold">⚠️ No questions available for this quiz.</p>
    <router-link to="/dashboard" class="btn btn-outline-primary">🔙 Back to Quizzes</router-link>
  </div>
</div>


    `,data(){return{quiz:{},questions:[],userAnswers:{},timeLeft:0,timerInterval:null,currentIndex:0,timerInterval:null,timeLeft:0}},computed:{formattedTime(){const t=Math.floor(this.timeLeft/60),e=this.timeLeft%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`},currentQuestion(){return this.questions[this.currentIndex]||{}},attemptedQuestions(){return Object.keys(this.userAnswers).length}},methods:{setUserAnswer(t){this.userAnswers[this.questions[this.currentIndex].id]=t,this.updateAttemptedCount()},nextQuestion(){this.currentIndex<this.questions.length-1&&this.currentIndex++},prevQuestion(){this.currentIndex>0&&this.currentIndex--},updateAttemptedCount(){this.attemptedQuestions=Object.keys(this.userAnswers).length},submitAnswers(){clearInterval(this.timerInterval),console.log("Submitting answers...");const t=localStorage.getItem("id"),e=this.$route.params.quiz_id;if(!t||!e){console.error("Missing user_id or quiz_id");return}const s=this.calculateScore();fetch(`/user/${t}/attempt_quiz/${this.$route.params.quiz_id}`,{method:"POST",headers:{"Authentication-Token":localStorage.getItem("auth_token"),"Content-Type":"application/json"},body:JSON.stringify({score:s})}).then(o=>o.json()).then(o=>{o.error?alert(`Error: ${o.error}`):(alert(o.message),this.$router.push({path:`/scores/${t}`}))}).catch(o=>console.error("Error submitting quiz:",o))},calculateScore(){let t=0,e=0;return this.questions.length<10&&(e=10/this.questions.length),this.questions.forEach(s=>{const o=this.userAnswers[s.id];console.log(`Question: ${s.text}`),console.log(`Selected Option ID: ${o}, Correct Option ID: ${s.correct_option}`),o+1===s.correct_option?(console.log("Correct!"),t++):console.log("Incorrect!")}),t=t*e,console.log(`Final Score: ${t}`),t},fetchQuizData(){const t=this.$route.params.quiz_id;fetch(`/api/getquiz?quiz_id=${t}`).then(e=>e.ok?e.json():e.text().then(s=>{throw new Error(s||"Failed to fetch quiz data")})).then(e=>{this.quiz=e,this.fetchQuestions(t)}).catch(e=>console.error("Error fetching quiz data:",e))},startTimer(){if(isNaN(this.timeLeft)||this.timeLeft<=0){console.error("Invalid quiz duration!");return}this.timerInterval&&clearInterval(this.timerInterval),this.timerInterval=setInterval(()=>{this.timeLeft>0?this.timeLeft--:(clearInterval(this.timerInterval),alert("Time is up!"),this.submitAnswers())},1e3)},fetchQuestions(t){fetch(`/api/quiz/${t}/question`,{method:"GET",headers:{"Content-Type":"application/json","Authentication-Token":localStorage.getItem("auth_token")}}).then(e=>{if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);return e.json()}).then(e=>this.questions=e).catch(e=>console.error("Error fetching questions:",e))}},mounted(){this.fetchQuizData();const t=this.$route.query.duration;t?(this.timeLeft=parseInt(t)*60,this.startTimer()):console.error("Quiz duration is missing!")}},g={template:`
    <div v-if="user" class="container mt-5">
  <!-- Header Section -->
  <div class="text-center">
    <h1 class="display-3 fw-bold mb-3">🎉 Quiz Results for <span class="text-primary">{{ user }}</span></h1>
    <p class="lead">Total Attempts: <span class="badge bg-info fs-6">{{ totalAttempts }}</span></p>
  </div>

  <!-- Accordion Section for Quiz Results -->
  <div class="row justify-content-center mt-4">
    <div class="col-lg-8">
      <div class="accordion shadow-lg" id="accordionAttempts">
        <div class="accordion-item" v-for="(attempt, index) in attempts" :key="index">
          <h2 class="accordion-header" :id="'heading' + index">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    :data-bs-target="'#collapse' + index" aria-expanded="false" :aria-controls="'collapse' + index">
              <span class="fw-bold">{{ attempt.quiz_title || 'Quiz Not Found' }}</span> 
              - Score: <span class="text-success">{{ attempt.score }}</span> / 
              <span class="text-warning">{{ attempt.max_score || 'N/A' }}</span> 
              ({{ attempt.percentage || 'N/A' }}%)
            </button>
          </h2>
          <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index" data-bs-parent="#accordionAttempts">
            <div class="accordion-body">
              <p><i class="bi bi-calendar-check"></i> <strong>Date Attempted:</strong> {{ attempt.date_attempted }}</p>
              <p><i class="bi bi-clipboard-check"></i> <strong>Score:</strong> {{ attempt.score }} / {{ attempt.max_score || 'N/A' }}</p>
              <p><i class="bi bi-percent"></i> <strong>Percentage:</strong> {{ attempt.percentage || 'N/A' }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Back to Quizzes Button -->
  <div class="text-center mt-5">
    <router-link to="/dashboard" class="btn btn-lg btn-outline-primary shadow-sm">🔙 Back to Quizzes</router-link>
  </div>
</div>

<!-- No Results Section -->
<div v-else-if="message" class="text-center mt-5">
  <h1 class="display-4 text-secondary">😔 {{ message }}</h1>
  <router-link to="/dashboard" class="btn btn-lg btn-outline-secondary mt-3">Go to Quizzes</router-link>
</div>

<!-- Error Section -->
<div v-else-if="error" class="text-center mt-5">
  <h1 class="display-4 text-danger">🚨 {{ error }}</h1>
  <router-link to="/dashboard" class="btn btn-lg btn-outline-secondary mt-3">Go to Quizzes</router-link>
</div>

<!-- Loading Spinner -->
<div v-else class="text-center mt-5">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>

  `,data(){return{user:null,totalAttempts:0,attempts:[],message:"",error:""}},methods:{async fetchResults(){try{const t=this.$route.params.userId,e=await fetch(`/user/${t}/dashboard`),s=await e.json();e.status===404?this.error=s.error:e.status===200&&s.message?this.message=s.message:(this.user=s.user,this.totalAttempts=s.total_attempts,this.attempts=s.attempts)}catch(t){console.error("Fetch Error:",t),this.error="An error occurred while fetching quiz results."}}},mounted(){this.fetchResults()}},f={data(){return{userId:this.$route.params.userId,graphUrl:"",subjectChartUrl:""}},async created(){await this.fetchGraph(),await this.fetchTotalSubjectChart()},methods:{async fetchGraph(){try{const t=await fetch(`/user/${this.userId}/graph`);if(!t.ok)throw new Error(`Error: ${t.statusText}`);const e=await t.blob();this.graphUrl=URL.createObjectURL(e)}catch(t){console.error("Error fetching graph:",t)}},async fetchTotalSubjectChart(){try{const t=await fetch(`/user/${this.userId}/total_subject_chart`);if(!t.ok)throw new Error(`Error: ${t.statusText}`);const e=await t.blob();this.subjectChartUrl=URL.createObjectURL(e)}catch(t){console.error("Error fetching subject chart:",t)}}},template:`
  <div class="container py-5">
  <div class="row g-4">
    <!-- User Score Summary Section -->
    <div class="col-lg-6">
      <div class="card shadow-lg border-0">
        <div class="card-header bg-primary text-white text-center">
          <h3 class="mb-0">📊 User Score Summary</h3>
        </div>
        <div class="card-body">
          <h4 class="card-title text-center text-secondary">Quiz Score Overview</h4>
          <div class="d-flex justify-content-center">
            <img :src="graphUrl" alt="Graph" class="img-fluid rounded-3 shadow" v-if="graphUrl" />
            <p v-else class="text-muted">⏳ Loading graph...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Distribution Summary Section -->
    <div class="col-lg-6">
      <div class="card shadow-lg border-0">
        <div class="card-header bg-success text-white text-center">
          <h3 class="mb-0">📚 Quiz Distribution Summary</h3>
        </div>
        <div class="card-body">
          <h4 class="text-center text-secondary">Total Quizzes by Subject (User ID: {{ userId }})</h4>
          <div class="d-flex justify-content-center">
            <img :src="subjectChartUrl" alt="Subject Chart" class="img-fluid rounded-3 shadow" v-if="subjectChartUrl" />
            <p v-else class="text-muted">⏳ Loading subject chart...</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Back to Dashboard Button -->
  <div class="text-center mt-5">
    <router-link to="/dashboard" class="btn btn-outline-primary btn-lg">
      🔙 Back to Quizzes
    </router-link>
  </div>
</div>

`},y={template:`
      <div class="container my-5">
  <h1 class="text-primary mb-4">Admin Summary</h1>
  <div class="row border">
    <div class="text-end my-2">
        <button @click="csvExport" class="btn btn-secondary">Download CSV</button>
    </div>
  </div>

  <!-- Summary Details Section -->
  <div v-if="summaryData" class="card mb-4">
    <div class="card-header bg-info text-white">
      <h2 class="mb-0">Summary Details</h2>
    </div>
    <div class="card-body">
      <ul class="list-group">
        <li v-for="(value, key) in summaryData" :key="key" class="list-group-item d-flex justify-content-between">
          <strong class="text-capitalize">{{ key }}</strong>
          <span>{{ value }}</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Top Scorer Section -->
  <div v-if="topScorer" class="alert alert-success d-flex align-items-center" role="alert">
    <i class="bi bi-trophy me-2"></i>
    <div>
      <h2 class="mb-1">🏆 Top Scorer</h2>
      <p class="mb-0">{{ topScorer.name }} with <strong>{{ topScorer.points }}</strong> points</p>
    </div>
  </div>

  <!-- Chart Section -->
  <div v-if="chartSrc" class="card mb-4">
    <div class="card-header bg-warning">
      <h2 class="mb-0">📊 Graph</h2>
    </div>
    <div class="card-body text-center">
      <img :src="chartSrc" alt="Admin Summary Chart" class="img-fluid rounded shadow-lg" />
    </div>
  </div>

  <!-- Error Section -->
  <div v-if="error" class="alert alert-danger" role="alert">
    ⚠️ {{ error }}
  </div>
</div>

    `,data(){return{summaryData:null,topScorer:null,chartSrc:null,error:null}},methods:{async fetchAdminSummary(){try{const t=await fetch("/admin/summary");if(!t.ok)throw new Error(`Error fetching summary: ${t.status} - ${t.statusText}`);const e=await t.json();this.summaryData=e.summary_data,this.topScorer=e.top_scorer,this.chartSrc=`data:image/png;base64,${e.chart}`}catch(t){this.error=t.message,console.error("Error in fetchAdminSummary:",t)}},csvExport(){fetch("/api/export").then(t=>t.json()).then(t=>{window.location.href=`/api/csv_result/${t.id}`})}},mounted(){this.fetchAdminSummary()}},w={template:`
      <div class="container py-5">
        <h1 class="text-center mb-4 text-primary">Welcome to the Quiz Payment Portal</h1>
        <form @submit.prevent="submitPayment" class="card p-4 shadow">
          <div class="mb-3">
            <label for="card_number" class="form-label">Card Number:</label>
            <input type="text" v-model="card_number" class="form-control" required maxlength="16" placeholder="1234 5678 9101 1121" />
          </div>
          
          <div class="mb-3">
            <label for="expiry_date" class="form-label">Expiry Date (MM/YY):</label>
            <input type="text" v-model="expiry_date" class="form-control" required placeholder="MM/YY" />
          </div>
  
          <div class="mb-3">
            <label for="cvv" class="form-label">CVV:</label>
            <input type="text" v-model="cvv" class="form-control" required maxlength="3" placeholder="123" />
          </div>
  
          <div class="mb-3">
            <label for="amount" class="form-label">Amount (USD):</label>
            <input type="number" step="0.01" v-model="amount" class="form-control" required placeholder="Amount" />
          </div>
  
          <button type="submit" class="btn btn-success w-100">Pay Now</button>
        </form>
  
        <div v-if="message" class="alert mt-4" :class="{'alert-success': message.includes('success'), 'alert-danger': message.includes('failure')}">{{ message }}</div>
      </div>
    `,data:function(){return{card_number:"",expiry_date:"",cvv:"",amount:"",message:""}},methods:{submitPayment:function(){const t={card_number:this.card_number,expiry_date:this.expiry_date,cvv:this.cvv,amount:this.amount};fetch("/process_payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(e=>e.json()).then(e=>{this.message=`Payment ${e.payment_status}`}).catch(e=>{this.message="Error processing payment."})}}},S=[{path:"/",component:c},{path:"/login",component:d},{path:"/register",component:u},{path:"/dashboard",component:b},{path:"/quiz/:quiz_id",component:v},{path:"/scores/:userId",component:g},{path:"/summary/:userId",component:f},{path:"/adminSummary",component:y},{path:"/admin",component:p},{path:"/payment",component:w}],n=new VueRouter({routes:S}),l=new Vue({el:"#app",router:n,template:`                    
        <div class="container">
        <nav-bar :isAdmin="isAdmin"></nav-bar>
        
        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <router-view v-else></router-view> 
        <foot></foot>
        </div>
        `,data:{section:"Frontend",isLoading:!1},components:{"nav-bar":h,foot:m},computed:{isAdmin(){return localStorage.getItem("userRole")==="admin"}}});n.beforeEach((t,e,s)=>{l.isLoading=!0,s()});n.afterEach(()=>{setTimeout(()=>{l.isLoading=!1},100)});
