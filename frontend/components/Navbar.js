export default {
    template: `
      <nav class="navbar navbar-light bg-light"  style="background-color: #D4BEB0;">
      <h3 align='left' style="color: #704241;"><b>A to Z</b></h3>  
      <nav class="justify-content-end">
      <form class="form-inline">
        
          
          <router-link v-if="!$store.state.loggedIn" to="/login" class="mr-3 ml-1"> <button class="btn btn-sm btn-outline-dark" type="button">Already a User? Login</button></router-link>  
          
          
          <router-link v-if="!$store.state.loggedIn" to="/signup" class="mr-3 ml-1"> <button class="btn btn-sm btn-outline-dark" type="button">New to A to Z? Sign Up</button></router-link>
          
          
          <router-link v-if="!$store.state.loggedIn" to="/register" class="ml-1"> <button class="btn btn-sm btn-outline-dark" type="button">Join as a Professional? Register</button></router-link>
        
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'user'" to="/home" class="ml-1" > <button class="btn btn" type="button">Home</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'user'" to="/servicelist" class="ml-1" > <button class="btn" type="button">Service</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'user'" to="/myrequests" class="ml-1" > <button class="btn " type="button">My Requests</button></router-link>
          
          
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to="/admindashboard" class="ml-1" > <button class="btn btn" type="button">Dashboard</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to="/categories" class="ml-1" > <button class="btn btn" type="button">Categories</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to="/addservice" class="ml-1" > <button class="btn btn" type="button">Add New Service</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to="/Reviews" class="ml-1" > <button class="btn btn" type="button">Reviews</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to="/reports" class="ml-1" > <button class="btn btn" type="button">Reports</button></router-link>


          <router-link v-if="$store.state.loggedIn && $store.state.role == 'professional'" to="/professional-dashboard" class="ml-1" > <button class="btn btn" type="button">Professional Dashboard</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'professional'" to="/requested" class="ml-1" > <button class="btn btn" type="button">Requests</button></router-link>
          <router-link v-if="$store.state.loggedIn && $store.state.role == 'professional'" to="/my-documents" class="ml-1" > <button class="btn btn" type="button">My Document</button></router-link>
          

           <router-link to= "/login"><button class="btn btn-" v-if="$store.state.loggedIn"   @click="$store.commit('logout')">Logout</button>
           </div></router-link>
        
        
          </form>
          </nav>
      </nav>
    `
  }




  