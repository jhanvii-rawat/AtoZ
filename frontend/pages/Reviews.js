export default {
    template: `
      <div class="container mt-5">
        <h3>Service Reviews</h3>
  
        <!-- Filter by Review Rating -->
        <div class="mb-3">
          <label for="reviewFilter" class="form-label">Filter by Rating:</label>
          <select id="reviewFilter" class="form-select" v-model="selectedRating" @change="fetchReviews">
            <option value="">All Ratings</option>
            <option v-for="star in [1, 2, 3, 4, 5]" :key="star" :value="star">
              {{ star }} Star
            </option>
          </select>
        </div>
  
        <!-- Review Table -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Service ID</th>
              <th>Review</th>
              <th>Rating</th>
              <th>Username</th>
              <th>Actions</th>
              <th>Professional Name</th>
              <th>Professional Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in filteredReviews" :key="review.id">
              <td>{{ review.serviceName }}</td>
              <td>{{ review.serviceId }}</td>
              <td>{{ review.comments }}</td>
              <td>{{ review.rating }} Stars</td>
              <td>{{ review.username }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="blockUser(review.userId)">Block User</button>
              </td>
              <td>{{ review.professionalName }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="blockProfessional(review.professionalId)">Block Professional</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  
    data() {
      return {
        reviews: [], // All reviews
        selectedRating: '', // Filter value
      };
    },
  
    computed: {
      filteredReviews() {
        if (!this.selectedRating) return this.reviews;
        return this.reviews.filter(review => review.rating === parseInt(this.selectedRating));
      },
    },
  
    methods: {
      fetchReviews() {
        const endpoint = this.selectedRating 
          ? `/local-api/reviews?rating=${this.selectedRating}` 
          : '/local-api/reviews';
  
        fetch(endpoint)
          .then(res => res.json())
          .then(data => {
            this.reviews = data;
          })
          .catch(error => console.error('Error fetching reviews:', error));
      },
  
      blockUser(userId) {
        fetch(`/local-api/block-user/${userId}`, { method: 'POST' })
          .then(() => alert('User blocked successfully'))
          .catch(error => console.error('Error blocking user:', error));
      },
  
      blockProfessional(professionalId) {
        fetch(`/local-api/block-professional/${professionalId}`, { method: 'POST' })
          .then(() => alert('Professional blocked successfully'))
          .catch(error => console.error('Error blocking professional:', error));
      },
    },
  
    mounted() {
      this.fetchReviews();
    },
  };
  