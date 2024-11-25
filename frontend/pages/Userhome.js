export default {
    template: `
    <div :style="backgroundStyle" class="vh-100 overflow-auto">
        <!-- Navbar -->
        <div class="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
            <h1 class="text-danger">A to Z</h1>
            <input placeholder="Search services..." v-model="searchQuery" class="form-control w-50" />
        </div>

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
            searchQuery: '',
            services: {
                "Home and Cleaning": [
                    { name: "Cleaning", image: "https://via.placeholder.com/200x120?text=Cleaning" },
                    { name: "Window Cleaning", image: "https://via.placeholder.com/200x120?text=Window+Cleaning" },
                    { name: "Pest Control", image: "https://via.placeholder.com/200x120?text=Pest+Control" },
                    { name: "Wall Paint", image: "https://via.placeholder.com/200x120?text=Wall+Paint" }
                ],
                "Repair": [
                    { name: "AC Repair", image: "https://via.placeholder.com/200x120?text=AC+Repair" },
                    { name: "Plumbing", image: "https://via.placeholder.com/200x120?text=Plumbing" }
                ]
            },
            backgroundImage: 'https://images.pexels.com/photos/15835554/pexels-photo-15835554/free-photo-of-cars-parked-by-building-wall-with-mural.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
    },
    computed: {
        filteredServices() {
            if (!this.searchQuery.trim()) return this.services;
            const query = this.searchQuery.toLowerCase();
            const filtered = {};

            for (const [category, services] of Object.entries(this.services)) {
                const matchingServices = services.filter(service =>
                    service.name.toLowerCase().includes(query)
                );
                if (matchingServices.length > 0) {
                    filtered[category] = matchingServices;
                }
            }

            return filtered;
        }
    }
}
