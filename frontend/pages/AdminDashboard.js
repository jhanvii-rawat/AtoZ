export default {
    template: `
    <div class="container mt-5">
        <div class="text-center mb-4">
            <h3>Welcome, Admin</h3>
        </div>
        <div>
            <h4>Registered Users</h4>
            <div class="row">
                <div class="col-md-4">
                    <div class="card border-0 shadow mb-3 text-center">
                        <div class="card-body">
                            <h5 class="card-title">Users</h5>
                            <p class="display-6">{{ totalUsers }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow mb-3 text-center">
                        <div class="card-body">
                            <h5 class="card-title">Professionals</h5>
                            <p class="display-6">{{ totalProfessionals }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h4>Professional Verification</h4>
            <div class="row">
                <div class="col-md-4">
                    <div class="card border-0 shadow mb-3 text-center">
                        <div class="card-body">
                            <h5 class="card-title">Verified Professionals</h5>
                            <p class="display-6">{{ verifiedProfessionals }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow mb-3 text-center">
                        <div class="card-body">
                            <h5 class="card-title" >Verifications Pending</h5>
                            <p class="display-6">{{ pendingProfessionals }}</p>
                            <router-link to ="/verification"><button class=btn-btn> Go</button> </router-link>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow mb-3 text-center">
                        <div class="card-body">
                            <h5 class="card-title">Verifications Rejected</h5>
                            <p class="display-6">{{ rejectedProfessionals }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            totalUsers: 0,
            totalProfessionals: 0,
            verifiedProfessionals: 0,
            pendingProfessionals: 0,
            rejectedProfessionals: 0,
        };
    },

    methods: {
        async fetchOverviewData() {
            try {
                const res = await fetch(location.origin + '/admindashboard', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.totalUsers = data.total_users;
                    this.totalProfessionals = data.total_professionals;
                    this.verifiedProfessionals = data.verified_professionals;
                    this.pendingProfessionals = data.pending_professionals;
                    this.rejectedProfessionals = data.rejected_professionals;
                } else {
                    console.error('Failed to fetch admin overview data:', res.status, res.statusText);
                }
            } catch (error) {
                console.error('Error fetching admin overview:', error);
            }
        },
    },

    mounted() {
        this.fetchOverviewData();
    },
};
