export default {
    template: `
    <div class="container mt-5">
        <h3>Verify Professional</h3>
        <div v-if="professional">
            <h4>{{ professional.user.name }}</h4>
            <p>{{ professional.service.name }}</p>
            <img :src="professional.document.document_url" alt="Document Image" class="img-fluid" style="width: 18rem;"/>
            <textarea v-model="remark" placeholder="Reason for rejection (if any)"></textarea>
            <button @click="approve">Approve</button>
            <button @click="reject">Reject</button>
        </div>
    </div>
    `,

    data() {
        return {
            professional: null,
            remark: '',
        };
    },

    methods: {
        async fetchProfessionalData(id) {
            try {
                const res = await fetch(location.origin + `/admin/professional/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.professional = data.professional;
                } else {
                    console.error('Failed to fetch professional data:', res.status, res.statusText);
                }
            } catch (error) {
                console.error('Error fetching professional data:', error);
            }
        },

        async approve() {
            try {
                const res = await fetch(location.origin + `/admin/verify_professional/${this.professional.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                    body: JSON.stringify({
                        is_verified: true,
                       
                    }),

                    
                });

                if (res.ok) {
                    this.$router.push('/verification');
                } else {
                    console.error('Failed to approve professional');
                }
            } catch (error) {
                console.error('Error approving professional:', error);
            }
        },

        async reject() {
            try {
                const res = await fetch(location.origin + `/admin/reject_professional/${this.professional.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                    body: JSON.stringify({
                        is_verified: false,
                        remark: this.remark,
                    }),
                });

                if (res.ok) {
                    this.$router.push('/verification');
                } else {
                    console.error('Failed to reject professional');
                }
            } catch (error) {
                console.error('Error rejecting professional:', error);
            }
        },
    },

    mounted() {
        const professionalId = this.$route.params.id;
        this.fetchProfessionalData(professionalId);
    },
};
