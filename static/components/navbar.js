export default {
  template: `
<div>
  <nav style="background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 15px 0; border-bottom: 2px solid #2c2c2c; width: 100vw; margin-left: calc(-50vw + 50%);">
    <div class="container-fluid" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      
      <!-- Brand -->
      <a href="#" 
         style="font-size: 28px; font-weight: bold; color: #2c2c2c; text-decoration: none; transition: color 0.3s;" 
         @mouseover="$event.target.style.color = '#4a4a4a'" 
         @mouseleave="$event.target.style.color = '#2c2c2c'">
         QUIZ MASTER
      </a>

      <!-- User Navigation Buttons -->
      <div id="userNav" style="display: flex; align-items: center; gap: 10px;">
        <router-link to="/user-dashboard" 
          style="padding: 8px 16px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; text-decoration: none; border-radius: 4px; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Dashboard</router-link>
        <button @click="MOVETOSCORES()" 
          style="padding: 8px 16px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; cursor: pointer; border-radius: 4px; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">SCORES</button>
        <button @click="MOVETOSUMMARY()" 
          style="padding: 8px 16px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; cursor: pointer; border-radius: 4px; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Summary</button>
      </div>

      <!-- Admin Navigation Buttons -->
      <div id="adminNav" style="display: none; align-items: center; gap: 10px;">
        <router-link to="/adminSummary" 
          style="padding: 8px 16px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; text-decoration: none; border-radius: 4px; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Admin Summary</router-link>
      </div>

      <!-- Search Section (Admin Only) -->
      <div id="searchSection" style="display: none; align-items: center; gap: 10px;">
        <form @submit.prevent="performSearch" style="display: flex; align-items: center; gap: 8px;">
          <input type="search" v-model="searchQuery" placeholder="Search..." 
            style="border: 2px solid #2c2c2c; border-radius: 4px; padding: 8px; color: #2c2c2c; background-color: white; width: 200px;">
          <select v-model="searchCategory" 
            style="border: 2px solid #2c2c2c; border-radius: 4px; padding: 8px; color: #2c2c2c; background-color: white;">
            <option value="users">Users</option>
            <option value="subjects">Subjects</option>
            <option value="quizzes">Quizzes</option>
            <option value="chapters">Chapters</option>
            <option value="options">Options</option>
          </select>
          <button type="submit" 
            style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; padding: 8px 16px; cursor: pointer; border-radius: 4px; transition: all 0.3s;"
            @mouseover="hoverButton($event)" 
            @mouseleave="resetButton($event)">Search</button>
        </form>
      </div>

      <!-- Authentication Buttons -->
      <div style="display: flex; align-items: center; gap: 10px;">
        <router-link to="/login" 
          style="padding: 8px 16px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; text-decoration: none; border-radius: 4px; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Login</router-link>
        <button @click="logout" 
          style="padding: 8px 16px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; cursor: pointer; border-radius: 4px; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Logout</button>
      </div>
    </div>
  </nav>
</div>
  `,
  
  data() {
    return {
      searchQuery: '',
      searchCategory: 'users',
      results: [],
      error: '',
      searchPerformed: false
    }
  },
  
  props: {
    isAdmin: Boolean
  },
  
  mounted() {
    this.updateVisibility();
  },
  
  watch: {
    $route() {
      this.updateVisibility();
    },
    isAdmin() {
      this.updateVisibility();
    }
  },
  
  methods: {
    updateVisibility() {
      const userRole = localStorage.getItem('userRole');
      const token = localStorage.getItem('auth_token');
      const currentPath = this.$route.path;
      
      const isAdmin = userRole === 'admin' || currentPath.includes('admin');
      const isLoggedIn = token && token !== 'null' && token !== 'undefined';
      
      // Show/hide user navigation
      const userNav = document.getElementById('userNav');
      if (userNav) {
        userNav.style.display = isLoggedIn ? 'flex' : 'none';
      }
      
      // Show/hide admin navigation
      const adminNav = document.getElementById('adminNav');
      if (adminNav) {
        adminNav.style.display = isAdmin ? 'flex' : 'none';
      }
      
      // Show/hide search section
      const searchSection = document.getElementById('searchSection');
      if (searchSection) {
        searchSection.style.display = isAdmin ? 'flex' : 'none';
      }
    },
    
    async performSearch() {
      if (!this.searchQuery.trim()) {
        this.error = 'Please enter a search query';
        return;
      }
      
      this.error = '';
      this.searchPerformed = true;
      
      const token = localStorage.getItem('auth_token');
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
          throw new Error(`HTTP Error ${response.status}`);
        }
        
        this.results = await response.json();
      } catch (error) {
        this.error = error.message;
        this.results = [];
      }
    },
    
    MOVETOSCORES() {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.$router.push({ path: `/scores/${userId}` });
      }
    },
    
    MOVETOSUMMARY() {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.$router.push({ path: `/summary/${userId}` });
      }
    },
    
    logout() {
      fetch('/logout', {
        method: 'GET',
        credentials: 'include'
      })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem('userRole');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('userId');
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
    
    hoverButton(event) {
      event.target.style.backgroundColor = '#2c2c2c';
      event.target.style.color = '#ffffff';
      event.target.style.transform = 'scale(1.05)';
    },
    
    resetButton(event) {
      event.target.style.backgroundColor = '#ffffff';
      event.target.style.color = '#2c2c2c';
      event.target.style.transform = 'scale(1)';
    }
  }
};