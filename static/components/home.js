export default {
    template: `
<div>
  <div class="container-fluid">
    <!-- Hero Section -->
    <div class="row vh-100 bg-dark text-white d-flex align-items-center justify-content-center text-center" 
      style="background: linear-gradient(135deg, #000000 0%, #000000 100%);">
      <div class="col">
        <h1 class="display-4 fw-bold" 
          style="animation: bounceIn 1.5s both; color: #ffffff;">
          WELCOME TO QUIZ MASTER
        </h1>
        <p class="lead mb-4" 
          style="animation: fadeIn 1.5s; color: #ffffff;">
          Test your knowledge and become the ultimate quiz champion!
        </p>
        <router-link class="btn btn-lg btn-light" 
          style="animation: pulse 1.5s infinite; color: #000000; border: 2px solid #000000;" to="/login">Start Quiz</router-link>
      </div>
    </div>

    <!-- Features Section -->
    <div class="row py-5 bg-light text-dark">
      <div class="col text-center">
        <h2 class="fw-bold mb-4" style="color: #000000;">Why Choose Quiz Master?</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card border-2 border-dark shadow-lg bg-white rounded">
              <div class="card-body">
                <h3 class="card-title" style="color: #000000;">Interactive Quizzes</h3>
                <p class="card-text" style="color: #000000;">Enjoy interactive quizzes with multiple difficulty levels.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-2 border-dark shadow-lg bg-white rounded">
              <div class="card-body">
                <h3 class="card-title" style="color: #000000;">Real-time Scores</h3>
                <p class="card-text" style="color: #000000;">Track your performance and compete with others in real-time!</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-2 border-dark shadow-lg bg-white rounded">
              <div class="card-body">
                <h3 class="card-title" style="color: #000000;">Detailed Analytics</h3>
                <p class="card-text" style="color: #000000;">Gain insights into your strengths and areas to improve.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Section -->
    <div class="row bg-dark text-white py-5">
      <div class="col text-center">
        <h2 class="fw-bold mb-4" style="color: #ffffff;">Ready to Challenge Yourself?</h2>
        <p class="lead mb-4" style="color: #ffffff;">Join thousands of others in the ultimate quiz showdown!</p>
        <router-link class="btn btn-lg btn-light" 
          style="animation: heartBeat 1.5s infinite; color: #000000; border: 2px solid #000000;" to="/login">Get Started</router-link>
      </div>
    </div>

    <!-- Footer Section -->
    
  </div>
</div`}