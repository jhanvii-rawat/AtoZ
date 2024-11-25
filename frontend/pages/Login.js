export default {
    template: `
    <div :style="backgroundStyle" class="d-flex align-items-center justify-content-center vh-100">
            <!-- Login form -->
            <div class="p-4 bg-white rounded shadow" align="center">
                <p>Welcome back to A to Z!</p>
                <input placeholder="email" v-model="email" class="form-control mb-2"/>  
                <input placeholder="password" v-model="password" class="form-control mb-2" type="password"/>  
                <button class='btn btn-outline-danger w-100' @click="submitLogin">Login</button>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            email: null,
            password: null,
            backgroundImage: 'https://images.pexels.com/photos/15835554/pexels-photo-15835554/free-photo-of-cars-parked-by-building-wall-with-mural.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
        }
    },
    computed: {
        backgroundStyle() {
            return {
                backgroundImage: `url(${this.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh', // Full viewport height
                width: '100vw', // Full viewport width
            }
        }
    },
    methods: {
        async submitLogin() {
            const res = await fetch(location.origin + '/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'email': this.email, 'password': this.password })
                })
            if (res.ok) {
                console.log('Login successful')
                const data = await res.json()

                localStorage.setItem('user', JSON.stringify(data))

                this.$store.commit('setUser')
                this.$router.push('/feed')
            }
        }
    }
}
