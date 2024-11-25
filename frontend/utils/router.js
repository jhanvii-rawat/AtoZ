const index = {
    template: `
    <div class="auth-container">
        <!-- Left: Photo -->
        <div class="auth-photo"></div>
    
        <!-- Right: Text and Buttons -->
        <div class="auth-form">
            <div class="auth-card">
                <h1 class="auth-title">Welcome to A to Z<br>House Service</h1>
    
                <!-- Intro Section -->
                <div class="auth-section">
                    <p class="auth-subtitle">
                        A to Z is your trusted house service application designed to 
                        connect you with the best professionals in your area, ready to assist with any task you have.
                        Whether it's cleaning, repairs, or any other service, we've got you covered.
                    </p>
                </div>
    
                <!-- Footer Section -->
                <div class="auth-footer">
                    "Relax! We Got This"
                </div>
    
                <!-- Additional Information -->
                <div class="auth-section">
                    <p class="auth-subtitle">
                        You can rest assured that your tasks are in expert hands, 
                        giving you more time to enjoy life without the hassle.
                    </p>
                </div>
    
                <!-- Footer -->
                <footer class="text-center py-3 bg-light mt-auto">
                    <p class="mb-0">
                        © Photo by 
                        <a href="https://www.pexels.com/photo/crop-woman-and-abstract-illustrations-on-floor-3817676/" target="_blank">
                            Retha Ferguson
                        </a> 
                        on Pexels
                    </p>
                </footer>
            </div>
        </div>
    </div>
    `
}


import Login from "../pages/Login.js";
import Signup from "../pages/Signup.js";
import Register from "../pages/Register.js";
import Userhome from "../pages/Userhome.js";






const routes = [

    {path : '/', component : index},
    {path : '/login', component : Login},
    {path : '/signup', component : Signup},
    {path : '/register', component : Register},
    {path : '/home', component : Userhome},
   
]

const router = new VueRouter({
    routes
})

export default router;
