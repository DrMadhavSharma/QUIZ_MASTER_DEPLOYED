export default {
  data() {
    return {
      userId: this.$route.params.userId,
      graphUrl: '',
      subjectChartUrl: ''
    };
  },
  async created() {
    await this.fetchGraph();
    await this.fetchTotalSubjectChart();

  },
  methods: {
    async fetchGraph() {
      try {
        const response = await fetch(`/user/${this.userId}/graph`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const blob = await response.blob();
        this.graphUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching graph:', error);
      }
    },
    async fetchTotalSubjectChart() {
      try {
        const response = await fetch(`/user/${this.userId}/total_subject_chart`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const blob = await response.blob();
        this.subjectChartUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching subject chart:', error);
      }
    }
  },
  template: `
  <div class="container py-5">
        <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border" role="status" style="color: #000000;">
                  <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2" style="color: #333333;">Loading your graphs...</p>
          </div>
    <div v-else>
        <div class="row g-4">
          <!-- User Score Summary Section -->
          <div class="col-lg-6">
            <div class="card shadow-lg border-2 border-dark">
              <div class="card-header text-center" style="background-color: #000000; color: #ffffff;">
                <h3 class="mb-0">📊 User Score Summary</h3>
              </div>
              <div class="card-body">
                <h4 class="card-title text-center" style="color: #333333;">Quiz Score Overview</h4>
                <div class="d-flex justify-content-center">
                  <img :src="graphUrl" alt="Graph" class="img-fluid rounded-3 shadow" v-if="graphUrl" />
                  <p v-else style="color: #333333;">⏳ Loading graph...</p>
                </div>
              </div>
            </div>
          </div>
      

          <!-- Quiz Distribution Summary Section -->
          <div class="col-lg-6">
            <div class="card shadow-lg border-2 border-dark">
              <div class="card-header text-center" style="background-color: #333333; color: #ffffff;">
                <h3 class="mb-0">📚 Quiz Distribution Summary</h3>
              </div>
              <div class="card-body">
                <h4 class="text-center" style="color: #333333;">Total Quizzes by Subject (User ID: {{ userId }})</h4>
                <div class="d-flex justify-content-center">
                  <img :src="subjectChartUrl" alt="Subject Chart" class="img-fluid rounded-3 shadow" v-if="subjectChartUrl" />
                  <p v-else style="color: #333333;">⏳ Loading subject chart...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- Back to Dashboard Button -->
        <div class="text-center mt-5">
          <router-link to="/dashboard" class="btn btn-lg" style="background-color: #000000; color: #ffffff; border: 2px solid #000000;">
            🔙 Back to Quizzes
          </router-link>
        </div>
   </div>
</div>

`
};
