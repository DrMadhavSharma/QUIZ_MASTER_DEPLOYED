export default {
    template: `
    <div class="row justify-content-center align-items-center" style="height: 100vh; background-color: #ffffff;">
  <div class="col-12 col-md-8 col-lg-4">
    <div class="card shadow-lg border-2 border-dark rounded-4" style="background-color: #ffffff;">
      <div class="card-body p-5">
        <h2 class="text-center mb-4" style="color: #000000;">Welcome Back!</h2>
        
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
            <button class="btn btn-lg" @click="loginUser" style="background-color: #000000; color: #ffffff; border: 2px solid #000000;">Login</button>
          </div>
        </form>
        <p class="text-center mt-3" style="color: #000000;">Don't have an account? <router-link class="btn me-2" to="/register" style="background-color: #000000; color: #ffffff; border: 2px solid #000000;">Register</router-link></p>
      </div> 
    </div>
  </div>
</div>`,
    data: function() {
        return {
            formData:{
                email: "",
                password: ""
            },
            message: ""
        }
    },
    methods:{
        loginUser: function(){
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(this.formData) // the content goes to backend as JSON string
            })
            .then(response => response.json())
            .then(data => { 
                console.log(data)
                if(Object.keys(data).includes("auth-token")){
                    localStorage.setItem("auth_token", data["auth-token"])
                    localStorage.setItem("userId", data.id) // Changed from "id" to "userId" for consistency
                    localStorage.setItem("username", data.username)
                    localStorage.setItem("userRole", data.roles.includes('admin') ? 'admin' : 'user')

                    if(data.roles.includes('admin')){
                        this.$router.push('/admin')
                    }else{
                        this.$router.push('/user-dashboard') // redirect to user dashboard instead of quiz list
                    }   
                }
                else{
                    this.message = data.message
                }
            }
            )   
        }
    }
}// template in general is ude to render the html part of the component .
// IN CASE OF COMPONENTS DATA HAS TO BE RETURNED AS FUNCTION.
// formdata is data property(an  object),which is used to clb email & password,not a required step in here.
// methods is manually  triggered fn
// fetch creates promise ,will be caught by response object ,promise is resolved using .then this cycle continues promises are formed and resolved using then
