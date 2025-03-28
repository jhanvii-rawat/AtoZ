export default {
    template: `
    <div :style="backgroundStyle" class="d-flex align-items-center justify-content-center vh-100">
        <div class="p-4 bg-white rounded shadow" align="center">
            <p>Register as a Professional for A to Z!</p>

            <div class="row mb-2">
                <div class="col-md-6">
                    <label>Email</label>
                    <input v-model="email" class="form-control" type="email" />
                </div>
                <div class="col-md-6">
                    <label>Username</label>
                    <input v-model="username" class="form-control" type="text" />
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-md-6">
                    <label>Password</label>
                    <input v-model="password" class="form-control" type="password" />
                </div>
                <div class="col-md-6">
                    <label>Area Pincode</label>
                    <input v-model="pincode" class="form-control" type="text" />
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-md-6">
                    <label>Select Service</label>
                    <select v-model="selectedService" class="form-control">
                        <option disabled value="">Select Service</option>
                        <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label>Years of Experience</label>
                    <input v-model="experienceYears" class="form-control" type="number" min="0" />
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-md-6">
                    <label>Select Document Type</label>
                    <select v-model="documentType" class="form-control">
                        <option disabled value="">Select Document Type</option>
                        <option>Pan Card</option>
                        <option>Aadhaar Card</option>
                        <option>Driving License</option>
                        <option>Electricity Bill</option>
                        <option>Passport</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label>Upload Document</label>
                    <input type="file" @change="handleFileUpload" class="form-control" />
                </div>
            </div>

            <button class='btn btn-outline-warning w-100 mt-3' @click="submitRegistration">Register</button>
        </div>
    </div>
    `,

    data() {
        return {
            email: null,
            username: null,
            password: null,
            pincode: null,
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
                if (res.ok) {
                    this.services = await res.json();
                } else {
                    console.error('Failed to fetch services');
                }
            } catch (error) {
                console.error('Error fetching services:', error);
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
            formData.append("pincode", this.pincode);
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
                    this.$router.push('/login')
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
