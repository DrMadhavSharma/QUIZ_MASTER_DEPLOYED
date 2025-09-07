export default {
  template: `
<div>
  <nav class="navbar navbar-expand-lg navbar-light shadow-lg navbar-full-width" 
       style="background-color: white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); border-bottom: 2px solid #2c2c2c; width: 100vw; margin-left: calc(-50vw + 50%);">
    <div class="container-fluid">
      <!-- Brand with Hover Animation -->
      <a class="navbar-brand fs-2 fw-bold" href="#"
         style="color: #2c2c2c; transition: color 0.3s ease;" 
         @mouseover="$event.target.style.color = '#4a4a4a'" 
         @mouseleave="$event.target.style.color = '#2c2c2c'">QUIZ MASTER</a>

      <!-- Mobile Menu Toggle -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" 
        style="border: 2px solid #2c2c2c; background-color: transparent;">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- SCORES and Summary Buttons -->
      <div id="SCORES" class="text-center mt-4">
        <router-link to="/user-dashboard" class="btn btn-outline-dark mx-2 btn-lg" 
          style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; transition: all 0.3s ease;" 
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Dashboard</router-link>
        <button @click="MOVETOSCORES()" class="btn btn-outline-dark mx-2 btn-lg" 
          style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; transition: all 0.3s ease;" 
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">SCORES</button>
        <button @click="MOVETOSUMMARY()" class="btn btn-outline-dark mx-2 btn-lg" 
          style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; transition: all 0.3s ease;" 
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Summary</button>
      </div>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <router-link id="routerl" class="btn btn-outline-dark me-2" to="/adminSummary" 
          style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; transition: all 0.3s ease;" 
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Admin Summary</router-link>

        <!-- Admin-only Search Bar -->
        <form id="search" class="me-auto" @submit.prevent="performSearch">
          <input class="form-control me-2" type="search" v-model="searchQuery" placeholder="Search ..." aria-label="Search"
            style="border: 2px solid #2c2c2c; color: #2c2c2c; border-radius: 5px; padding: 0.5rem;">
          <select v-model="searchCategory" class="form-select me-2" 
                  style="border: 2px solid #2c2c2c; color: #2c2c2c; border-radius: 5px; padding: 0.5rem;">
            <option value="users">Users</option>
            <option value="subjects">Subjects</option>
            <option value="quizzes">Quizzes</option>
            <option value="chapters">Chapters</option>
            <option value="options">Options</option>
          </select>
          <button class="btn btn-outline-dark" type="submit" 
            style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; border-radius: 5px; padding: 0.5rem; transition: all 0.3s ease;"
            @mouseover="hoverButton($event)" 
            @mouseleave="resetButton($event)">Search</button>
        </form>
        <!-- No Results Modal -->
        <div v-if="searchPerformed && !results.length" class="modal fade show d-block" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">No Results Found</h5>
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
            <router-link class="btn btn-outline-dark me-2" to="/login" 
              style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; transition: all 0.3s ease;"
              @mouseover="hoverButton($event)" 
              @mouseleave="resetButton($event)">Login</router-link>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-dark" @click="logout" 
              style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; transition: all 0.3s ease;"
              @mouseover="hoverButton($event)" 
              @mouseleave="resetButton($event)">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
 `,
  data: function(){
    return {
      loggedIn: localStorage.getItem('auth_token'),
      searchQuery: '',
      searchCategory: 'users',
      results: [],
      error: '',
      searchPerformed: false,
      userId: null,
      authToken: localStorage.getItem('authToken')
    }
  },
  mounted() {
    this.checkSearchVisibility();
    this.CHECKSCORESVISIBILITY();
  },
  watch: {
    $route(to) {
      console.log('URL changed:', to.fullPath);
      this.checkSearchVisibility();
      this.CHECKSCORESVISIBILITY();
    },
    authToken(newToken, oldToken) {
      this.checkSearchVisibility();
      this.CHECKSCORESVISIBILITY();
    }
  },
  props: {
    isAdmin: Boolean,
  },
  methods: {
    logout() {
      fetch('/logout', {
        method: 'GET',
        credentials: 'include'
      })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem('userRole');
          localStorage.removeItem("auth_token")
          alert('Logged out successfully!');
          this.$router.push('/login');
        } else {
          alert('Logout failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
    },
    checkSearchVisibility() {
      const limk = this.$route.path;
      const search = document.getElementById('search');
      const routerl = document.getElementById('routerl');

      if (limk.includes('admin')) {
        search.style.display = 'flex';
        routerl.style.display = 'flex';
        console.log("Admin detected via router");
      } else {
        search.style.display = 'none';
        routerl.style.display = 'none';
        console.log("Not an admin via router");
      }
    },
    async performSearch() {
      if (!this.searchQuery) {
        this.error = 'Please enter a search query';
        return;
      }
      this.error = '';
      this.searchPerformed = true;

      const token = localStorage.getItem("auth_token");
      console.log('Token:', token);

      if (!token) {
        this.error = 'Authentication token not found';
        return;
      }

      try {
        const response = await fetch(`/search/${this.searchCategory}?q=${encodeURIComponent(this.searchQuery)}`, {
          method: 'GET',
          headers: {
            'Authentication-Token': token,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `HTTP Error ${response.status}`);
        }

        this.results = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
        this.results = [];
      }
    },
    MOVETOSCORES(){
      const userId = localStorage.getItem('userId');
      this.$router.push({ path: `/scores/${userId}` });
    },
    MOVETOSUMMARY(){
      const userId = localStorage.getItem('userId');
      this.$router.push({ path: `/summary/${userId}` });
    },
    CHECKSCORESVISIBILITY(){
      const limk = this.$route.path;
      const search = document.getElementById('SCORES');
      const token = localStorage.getItem("auth_token")
      if (!limk.includes('admin') & token != undefined ) {
        search.style.display = 'flex';
        console.log("registered user detected via router");
      } else {
        search.style.display = 'none';
        console.log("Not a user via router");
      }
    },
    hoverButton(event) {
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
  }
};