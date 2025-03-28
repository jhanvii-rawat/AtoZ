export default {
    template: `
    <div :style="backgroundStyle" class="vh-100 overflow-auto">
        <!-- Navbar -->
        
        <!-- Services Sections -->
        <div class="p-4">
            <div v-for="(services, category) in filteredServices" :key="category" class="mb-5">
                <h2 class="mb-3">{{ category }}</h2>
                <div class="d-flex flex-wrap gap-4">
                    <div
                        v-for="service in services"
                        :key="service.name"
                        class="card p-3 shadow-sm"
                        style="width: 200px; border-radius: 10px; cursor: pointer;"
                    >
                        <img :src="service.image" :alt="service.name" class="card-img-top rounded" style="height: 120px; object-fit: cover;" />
                        <p class="text-center mt-2 font-weight-bold">{{ service.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
           
            backgroundImage: 'https://images.pexels.com/photos/15835554/pexels-photo-15835554/free-photo-of-cars-parked-by-building-wall-with-mural.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
    },

    methods : {

    },
    async mounted(){
        const res = await fetch(location.origin + '/api/home', {
            headers : {
                'Token-Token' : this.$store.state.auth_token
            }
        })

        this.blogs = await res.json()
        console.log(this.blogs)
    },
    
}
