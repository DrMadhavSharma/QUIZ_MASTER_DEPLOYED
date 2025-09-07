export default {
  template: `
<div>
  <nav style="background-color: white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); padding: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      
      <!-- Brand with Hover Animation -->
      <a href="#" 
         style="font-size: 24px; font-weight: bold; color: #242424; text-decoration: none; transition: color 0.3s;" 
         @mouseover="changeColor('#333')" 
         @mouseleave="changeColor('#242424')">
         QUIZ MASTER
      </a>

      <!-- SCORES and Summary Buttons -->
      <div style="margin-top: 10px; text-align: center;">
        <router-link to="/user-dashboard" 
          style="margin: 5px; padding: 8px 12px; border: 1px solid #333; background-color: white; color: #242424; text-decoration: none; transition: background 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Dashboard</router-link>
        <button @click="MOVETOSCORES()" 
          style="margin: 5px; padding: 8px 12px; border: 1px solid #333; background-color: white; color: #242424; cursor: pointer; transition: background 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">SCORES</button>
        <button @click="MOVETOSUMMARY()" 
          style="margin: 5px; padding: 8px 12px; border: 1px solid #333; background-color: white; color: #242424; cursor: pointer; transition: background 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Summary</button>
      </div>

      <!-- Search Section -->
      <form @submit.prevent="performSearch" style="display: flex; align-items: center; margin-top: 10px;">
        <input type="search" v-model="searchQuery" placeholder="Search quizzes" 
          style="border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin-right: 5px;">
        <select v-model="searchCategory" 
          style="border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin-right: 5px;">
          <option value="users">Users</option>
          <option value="subjects">Subjects</option>
          <option value="quizzes">Quizzes</option>
          <option value="chapters">Chapters</option>
          <option value="options">Options</option>
        </select>
        <button type="submit" 
          style="border: 1px solid #333; background-color: white; color: #242424; padding: 5px 10px; cursor: pointer;">
          Search
        </button>
      </form>

      <!-- User Authentication Links -->
      <div style="margin-top: 10px;">
        <router-link to="/login" 
          style="margin-right: 5px; border: 1px solid #333; background-color: white; color: #242424; padding: 5px 10px; text-decoration: none; transition: background 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Login</router-link>
        <button @click="logout" 
          style="border: 1px solid #333; background-color: white; color: #242424; padding: 5px 10px; cursor: pointer; transition: background 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Logout</button>
      </div>
    </div>
  </nav>
</div>
`
}
    data: function(){
        return {loggedIn: localStorage.getItem('auth_token'),
                searchQuery: '',
                searchCategory: 'users',
                results: [],
                error: '',
                searchPerformed: false,
                userId:null,
                authToken: localStorage.getItem('authToken'),
                navbarColor: '#ffcc00', // Default color for navbar
              
            
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
        },authToken(newToken, oldToken) {
          this.checkSearchVisibility();
          this.CHECKSCORESVISIBILITY();
          
        }
      
        
      },
    props: {
        isAdmin: Boolean, // Receive isAdmin prop from parent
      },
      methods: {
        logout() {
          // Call the backend to clear the session
          fetch('/logout', {
            method: 'GET',
            credentials: 'include' // Ensure cookies are included
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
          
            const token = localStorage.getItem("auth_token"); // Assuming token is stored in localStorage
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
        
      }
            ,MOVETOSCORES(){
                  const userId = localStorage.getItem('userId'); // Updated to use 'userId' key
                  this.$router.push({ path: `/scores/${userId}` });
                },MOVETOSUMMARY(){
                  const userId = localStorage.getItem('userId'); // Updated to use 'userId' key
                  this.$router.push({ path: `/summary/${userId}` });}
                  ,CHECKSCORESVISIBILITY(){
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

            },changeColor(color) {
              this.navbarColor = color; // Update the navbar color on mouseover and mouseleave
            },
            hoverButton(event) {
              event.target.style.transform = 'scale(1.1)';
              event.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
            },
            resetButton(event) {
              event.target.style.transform = 'scale(1)';
              event.target.style.boxShadow = 'none';
            }
  

// // In the Vue.js component, you can use the 'this.loggedIn' variable to check if the user is logged in or not.
// // we have given link in btn "to" which points to the specified route
// // IN navbar we have 12 columns=10 to fast logistics and another 2 to btns.
// export default {
//     template: `
//   <div>
//     <div>
//       <form @submit.prevent="performSearch" class="me-auto">
//         <input
//           class="form-control me-2"
//           type="search"
//           v-model="searchQuery"
//           placeholder="Search..."
//           aria-label="Search"
//         />
//         <select v-model="searchCategory" class="form-select">
//           <option value="users">Users</option>
//           <option value="subjects">Subjects</option>
//           <option value="quizzes">Quizzes</option>
//           <option value="chapters">Chapters</option>
//           <option value="options">Options</option>
//         </select>
//         <button class="btn btn-outline-success" type="submit">Search</button>
//       </form>
  
//       <div v-if="error" class="text-danger">{{ error }}</div>
//       <ul v-if="results.length">
//         <li v-for="result in results" :key="result.id">
//           {{ result.name || result.title || result.username || result.text || result.email }}
//         </li>
//       </ul>
//       <p v-else-if="searchPerformed">No results found</p>
//     </div>
//   </div>`
  
    // data() {
    //   return {
    //     searchQuery: '',
    //     searchCategory: 'users',
    //     results: [],
    //     error: '',
    //     searchPerformed: false
    //   };
    // },
    // methods: {
    //   async performSearch() {
    //     if (!this.searchQuery) {
    //       this.error = 'Please enter a search query';
    //       return;
    //     }
    //     this.error = '';
    //     this.searchPerformed = true;
      
    //     const token = localStorage.getItem('"auth_token"'); // Assuming token is stored in localStorage
    //     console.log('Token:', token);

      
    //     if (!token) {
    //       this.error = 'Authentication token not found';
    //       return;
    //     }
      
    //     try {
    //       const response = await fetch(`/search/${this.searchCategory}?q=${encodeURIComponent(this.searchQuery)}`, {
    //         method: 'GET',
    //         headers: {
    //           'Authorization': `Bearer ${token}`,
    //           'Accept': 'application/json'
    //         }
    //       });
      
    //       if (!response.ok) {
    //         const errorData = await response.json().catch(() => null);
    //         throw new Error(errorData?.error || `HTTP Error ${response.status}`);
    //       }
      
    //       this.results = await response.json();
    //     } catch (error) {
    //       this.error = error.message;
    //       console.error('Error:', error);
    //       this.results = [];
    //     }
            
    // }}};
  
}}
