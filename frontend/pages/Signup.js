export default {
    template: `
    <div :style="backgroundStyle" class="d-flex align-items-center justify-content-center vh-100">
            <!-- Login form -->
            <div class="p-4 bg-white rounded shadow" align="center">
                <p>Sign up for A to Z!</p>
                <input placeholder="email" v-model="email" class="form-control mb-2"/>  
                <input placeholder="username" v-model="username" class="form-control mb-2" type="username"/>  
                <input placeholder="password" v-model="password" class="form-control mb-2" type="password"/>  
                <button class='btn btn-outline-warning w-100' @click="submitLogin">Sign Up</button>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            email: null,
            password: null,
            username: null,
            backgroundImage: 'https://images.pexels.com/photos/6857353/pexels-photo-6857353.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        } 
    },
    computed: {
        backgroundStyle() {
            return {
                backgroundImage: `url(${this.backgroundImage})`,
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                height: '100vh', 
                width: '100%', 
            };
        },
    },
    methods: {
        async submitLogin() {
            const res = await fetch(location.origin + '/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'email': this.email,
                    'password': this.password,
                    'username': this.username
                })
            });
            if (res.ok) {
                console.log('Sign Up successful');
                this.$router.push('/login')
            } else {
                console.error('Sign Up failed', await res.json());
            }
        }
    }
}
