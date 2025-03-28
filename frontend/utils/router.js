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
import AdminDash from "../pages/AdminDashboard.js";
import Service from "../pages/ServiceList.js";

import Categories from "../pages/Categories.js";

import AddService from "../pages/AddService.js";
import CategoryDetails from "../pages/CategoryDetails.js";
import Verification from "../pages/Verification.js";
import VerificationDetails from "../pages/VerificationDetails.js";


import Review from "../pages/Reviews.js";

import Reports from "../pages/Reports.js";




import ProfessionalDashboard from "../pages/ProfessionalDashboard.js";

import Requested from "../pages/Request.js";

import MyDocuments from "../pages/MyDocuments.js";



import store from './store.js';






const routes = [

    {path : '/', component : index},
    {path : '/login', component : Login, meta : {requiresLogin : false}},
    {path : '/signup', component : Signup, meta : {requiresLogin : false}},
    {path : '/register', component : Register, meta : {requiresLogin : false}},


    {path : '/home', component : Userhome, meta : {requiresLogin : true, role : "user"}},
    {path : '/services', component : Service, meta : {requiresLogin : true, role : "user"}},
    
    
    
    {path : '/addservice', component : AddService, meta : {requiresLogin : true, role : "admin"}},
    {path : '/admindashboard', component : AdminDash, meta : {requiresLogin : true, role : "admin"}},
    
    {path: '/verificationdetails', name: 'categories', component: VerificationDetails, meta : {requiresLogin : true, role : "admin"} },
    {path: '/categories', component: Categories, meta : {requiresLogin : true, role : "admin"} },
    {path: '/categories/:categoryId', name: 'viewcategory', component: CategoryDetails, meta : {requiresLogin : true, role : "admin"} },

    {path: '/verification', component: Verification, meta: {requiresLogin: true, role: "admin"}},
    {path: '/verification/:id',name: 'verificationdetails',component: VerificationDetails,meta: {requiresLogin: true, role: "admin"}},

    {path: '/review', component: Review,meta: { requiresLogin: true, role: "admin" } },
    {path: '/reports', component:Reports, meta: { requiresLogin: true, role: "admin" } },




    {path: '/professiona-dashboard', component: ProfessionalDashboard,meta: { requiresLogin: true, role: "professional" } },
    {path: '/requested', component:Requested, meta: { requiresLogin: true, role: "professional" } },
    {path: '/my-documents', component:MyDocuments, meta: { requiresLogin: true, role: "professional" } },
    
  
]

const router = new VueRouter({
    
    routes
})


// navigation guards
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorized')
             next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})


export default router;
