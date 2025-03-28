export default {
    template: `
    <div class="container mt-5">
        <h3>Pending Verification</h3>
        <div v-if="pendingProfessionals.length === 0">No professionals pending verification.</div>
        <div v-else>
            <div v-for="professional in pendingProfessionals" :key="professional.id" class="card mb-3">
                <div class="card-body">
                    Username : <h5>{{ professional.user.name }}</h5>
                    Service : <p>{{ professional.service.name }}</p>
                    <button @click="viewDocument(professional)">View Document</button>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            pendingProfessionals: [],
        };
    },

    methods: {
        async fetchPendingProfessionals() {
            try {
                const res = await fetch(location.origin + '/admindashboard/pending_verifications', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.pendingProfessionals = data.professionals;
                } else {
                    console.error('Failed to fetch pending professionals:', res.status, res.statusText);
                }
            } catch (error) {
                console.error('Error fetching pending professionals:', error);
            }
        },

        viewDocument(professional) {
            this.$router.push(`/verification/${professional.id}`);  // Navigate to the verification detail page
        },
    },

    mounted() {
        this.fetchPendingProfessionals();
    },
};
