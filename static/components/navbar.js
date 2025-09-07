export default {
  template: `
<div>
  <nav style="background-color: white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); padding: 10px; border-bottom: 2px solid #2c2c2c; width: 100vw; margin-left: calc(-50vw + 50%);">
    <div class="container-fluid" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      
      <!-- Brand with Hover Animation -->
      <a href="#" 
         style="font-size: 24px; font-weight: bold; color: #2c2c2c; text-decoration: none; transition: color 0.3s;" 
         @mouseover="changeColor('#4a4a4a')" 
         @mouseleave="changeColor('#2c2c2c')">
         QUIZ MASTER
      </a>

      <!-- SCORES and Summary Buttons -->
      <div id="SCORES" style="margin-top: 10px; text-align: center;">
        <router-link to="/user-dashboard" 
          style="margin: 5px; padding: 8px 12px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; text-decoration: none; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Dashboard</router-link>
        <button @click="MOVETOSCORES()" 
          style="margin: 5px; padding: 8px 12px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; cursor: pointer; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">SCORES</button>
        <button @click="MOVETOSUMMARY()" 
          style="margin: 5px; padding: 8px 12px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; cursor: pointer; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Summary</button>
      </div>

      <!-- Admin Summary Button (Admin Only) -->
      <div id="adminSummary" style="display: none; margin-top: 10px; text-align: center;">
        <router-link to="/adminSummary" 
          style="margin: 5px; padding: 8px 12px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; text-decoration: none; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Admin Summary</router-link>
      </div>

      <!-- Search Section (Admin Only) -->
      <div id="search" style="display: none; align-items: center; margin-top: 10px;">
        <form @submit.prevent="performSearch" style="display: flex; align-items: center;">
          <input type="search" v-model="searchQuery" placeholder="Search quizzes" 
            style="border: 2px solid #2c2c2c; border-radius: 5px; padding: 5px; margin-right: 5px; color: #2c2c2c; background-color: white;">
          <select v-model="searchCategory" 
            style="border: 2px solid #2c2c2c; border-radius: 5px; padding: 5px; margin-right: 5px; color: #2c2c2c; background-color: white;">
            <option value="users">Users</option>
            <option value="subjects">Subjects</option>
            <option value="quizzes">Quizzes</option>
            <option value="chapters">Chapters</option>
            <option value="options">Options</option>
          </select>
          <button type="submit" 
            style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; padding: 5px 10px; cursor: pointer; transition: all 0.3s;">
            Search
          </button>
        </form>
      </div>

      <!-- User Authentication Links -->
      <div style="margin-top: 10px;">
        <router-link to="/login" 
          style="margin-right: 5px; border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; padding: 5px 10px; text-decoration: none; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Login</router-link>
        <button @click="logout" 
          style="border: 2px solid #2c2c2c; background-color: white; color: #2c2c2c; padding: 5px 10px; cursor: pointer; transition: all 0.3s;"
          @mouseover="hoverButton($event)" 
          @mouseleave="resetButton($event)">Logout</button>
      </div>
    </div>
  </nav>
</div>
 `,
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
        $route() {
          this.checkSearchVisibility();
          this.CHECKSCORESVISIBILITY();
        },
        isAdmin() {
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
            const currentPath = this.$route.path;
            const search = document.getElementById('search');
            const adminSummary = document.getElementById('adminSummary');
            const userRole = localStorage.getItem('userRole');
            
            // Simple check: show admin features if user is admin OR on admin page
            const isAdmin = userRole === 'admin' || currentPath.includes('admin');
            
            if (search) {
                search.style.display = isAdmin ? 'flex' : 'none';
            }
            if (adminSummary) {
                adminSummary.style.display = isAdmin ? 'flex' : 'none';
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
                      const currentPath = this.$route.path;
                      const scoresSection = document.getElementById('SCORES');
                      const token = localStorage.getItem("auth_token");
                      
                      // Show scores section for logged-in users who are NOT on admin page
                      const isLoggedIn = token != null && token != undefined;
                      const isNotAdminPage = !currentPath.includes('admin');
                      
                      if (isLoggedIn && isNotAdminPage) {
                        if (scoresSection) {
                          scoresSection.style.display = 'flex';
                          console.log("Logged-in user detected - showing scores section");
                        }
                      } else {
                        if (scoresSection) {
                          scoresSection.style.display = 'none';
                          console.log("Not a logged-in user or on admin page - hiding scores section");
                        }
                      }

            },changeColor(color) {
              this.navbarColor = color; // Update the navbar color on mouseover and mouseleave
            },
            hoverButton(event) {
              event.target.style.transform = 'scale(1.05)';
              event.target.style.backgroundColor = '#2c2c2c';
              event.target.style.color = '#ffffff';
              event.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
            },
            resetButton(event) {
              event.target.style.transform = 'scale(1)';
              event.target.style.backgroundColor = '#ffffff';
              event.target.style.color = '#2c2c2c';
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
