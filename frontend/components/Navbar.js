export default {
    template: `
      <nav class="navbar navbar-light bg-light justify-content-end" style="background-color: #D4BEB0;">
        <form class="form-inline">
          Already a User?
          <router-link to="/login" class="mr-3 ml-1"> <button class="btn btn-sm btn-outline-dark" type="button">Login</button></router-link>  
          
          New to A to Z?
          <router-link to="/signup" class="mr-3 ml-1"> <button class="btn btn-sm btn-outline-dark" type="button">Sign Up</button></router-link>
          
          Join as a Professional?
          <router-link to="/register" class="ml-1"> <button class="btn btn-sm btn-outline-dark" type="button">Register</button></router-link>
        </form>
      </nav>
    `
  }
  