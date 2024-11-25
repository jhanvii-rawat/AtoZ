export default {
    template: `
    <div :style="backgroundStyle" class="d-flex align-items-center justify-content-center vh-100">
        <div class="p-4 bg-white rounded shadow" align="center">
            <p>Register as a Professional for A to Z!</p>
            <input placeholder="Email" v-model="email" class="form-control mb-2" type="email" />
            <input placeholder="Username" v-model="username" class="form-control mb-2" type="text" />
            <input placeholder="Password" v-model="password" class="form-control mb-2" type="password" />

            <!-- Service Dropdown -->
            <select v-model="selectedService" class="form-control mb-2">
                <option disabled value="">Select Service</option>
                <option v-for="service in services" :key="service.id" :value="service.name">{{ service.name }}</option>
            </select>

            <!-- Experience Years -->
            <input 
                placeholder="Years of Experience" 
                v-model="experienceYears" 
                class="form-control mb-2" 
                type="number" 
                min="0"
            />

            <!-- Document Type Dropdown -->
            <select v-model="documentType" class="form-control mb-2">
                <option disabled value="">Select Document Type</option>
                <option>Pan Card</option>
                <option>Aadhaar Card</option>
                <option>Driving License</option>
                <option>Electricity Bill</option>
                <option>Passport</option>
            </select>

            <!-- Document Upload -->
            <input type="file" @change="handleFileUpload" class="form-control mb-2" />
            
            <button class='btn btn-outline-warning w-100' @click="submitRegistration">Register</button>
        </div>
    </div>
    `,
    data() {
        return {
            email: null,
            username: null,
            password: null,
            selectedService: "",
            experienceYears: 0,
            documentType: "",
            documentFile: null,
            services: [],
            backgroundImage: 'https://images.pexels.com/photos/6439539/pexels-photo-6439539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        };
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
        async fetchServices() {
            try {
                const res = await fetch(location.origin + '/services');
                if (!res.ok) {
                    console.error('Failed to fetch services:', res.status, res.statusText);
                    return;
                }

                const data = await res.json();
                this.services = data;
            } catch (error) {
                console.error('Error fetching services:', error.message);
            }
        },
        handleFileUpload(event) {
            this.documentFile = event.target.files[0];
        },
        async submitRegistration() {
            const formData = new FormData();
            formData.append("email", this.email);
            formData.append("username", this.username);
            formData.append("password", this.password);
            formData.append("service", this.selectedService);
            formData.append("experience_years", this.experienceYears);
            formData.append("document_type", this.documentType);
            formData.append("document_file", this.documentFile);

            try {
                const res = await fetch(location.origin + "/register", {
                    method: "POST",
                    body: formData,
                });

                const result = await res.json();

                if (res.ok) {
                    console.log(result.message);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error("Error during registration:", error.message);
            }
        },
    },
    mounted() {
        this.fetchServices();
    },
};
