export default {
    template: `
    <div class="container py-5">
  <!-- Header Section -->
  <div class="text-center mb-4">
    <h1 class="fw-bold" style="color: #000000;">🧑‍🏫 QUIZ_DASHBOARD </h1>
    <h2 style="color: #333333;">All Available Quizzes</h2>
    <div>
      <router-link  class="btn mx-2 btn-lg" to="/payment" 
        style="transition: all 0.3s ease-in-out; background-color: #000000; color: #ffffff; border: 2px solid #000000;" 
        >PAYMENT</router-link>
  </div>
  </div>
  
    
  <!-- Spinner Section -->
<div v-if="loading" class="text-center my-5">
  <div class="spinner-border" role="status" style="color: #000000;">
    <span class="visually-hidden">Loading...</span>
  </div>
  <p class="mt-2" style="color: #333333;">Loading quizzes...</p>
</div>

<!-- Quizzes Table Section -->
<div v-else-if="quizzes.length">
  <div class="table-responsive">
    <table class="table table-hover table-striped table-bordered shadow">
      <thead style="background-color: #000000; color: #ffffff;">
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
          <td>
            <button class="btn btn-sm" @click="startQuiz(quiz)" style="background-color: #000000; color: #ffffff; border: 2px solid #000000;">
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
  <p class="text-danger fw-bold">
    ⚠️ No quizzes available at the moment. Please check back later!
  </p>
</div>


  <!-- Back to Dashboard Button -->
  <div class="text-center mt-4">
    <router-link to="/user-dashboard" class="btn btn-outline-secondary">
      🔙 Back to Dashboard
    </router-link>
  </div>
</div>

    `,
    data() {
      return {
        quizzes: [],
        loading: true,// start as true to show spinner
        userId: null,
      };
    },
    methods: {
      fetchQuizzes() {
        console.log("Fetching quizzes...");
        this.loading = true; // show spinner while fetching

        fetch(`/api/getquiz`, {
          method: "GET",
          headers: {
            "Authentication-Token": localStorage.getItem("auth_token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.json())
        .then((data) => {
          this.quizzes = Array.isArray(data) ? data : [];
          setTimeout(() => this.loading = false, 300); // minimum 300ms spinner // hide spinner after data arrives
        })
        .catch((error) => {
         console.error("Error fetching quizzes:", error);
         this.quizzes = [];
         this.loading = false; // hide spinner on error
         });
          
      },
      startQuiz(quiz) {
        if (!quiz || !quiz.id || !quiz.duration) {
          console.error('Quiz ID or duration is missing!');
          return;
        }
        console.log(`Starting quiz with ID: ${quiz.id}, Duration: ${quiz.duration}`);
        
        // Pass quizId and duration using query params
        this.$router.push({ 
          path: `/quiz/${quiz.id}`, 
          query: { duration: quiz.duration }
        });
      }
    },
    mounted() {
      this.fetchQuizzes();
    }
  };
  
