export default {
  template: `
    <div class="category-details-container" style="padding: 20px;">
      <h1>Category: {{ category.name }}</h1>
      <p>{{ category.description }}</p>
      <img :src="category.image_url" alt="Category Image" style="max-width: 18rem; height: auto; border-radius: 10px; margin: 20px 0;">
      
      <h2>Services under this Category</h2>
      <table class="table table-striped" style="width: 100%; margin-top: 20px;">
        <thead>
          <tr>
            <th>Service ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.id">
            <td>{{ service.id }}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.description || 'No description available' }}</td>
            <td>{{ service.base_price }}</td> <!-- Corrected field name -->
            <td>{{ service.time_required }}</td> <!-- Corrected field name -->
          </tr>
          <tr v-if="services.length === 0">
            <td colspan="5" class="text-center">No services available</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  
  data() {
    return {
      category: {},
      services: []
    };
  },
  
  methods: {
    async fetchCategoryDetails() {
      const categoryId = this.$route.params.categoryId;
      try {
        const categoryRes = await fetch(`${location.origin}/api/categories/${categoryId}`);
        this.category = await categoryRes.json();
      } catch (error) {
        console.error('Failed to fetch category details:', error);
      }
    },
    
    async fetchServices() {
      const categoryId = this.$route.params.categoryId;
      try {
        const servicesRes = await fetch(`${location.origin}/api/categories/${categoryId}/services`);
        this.services = await servicesRes.json();
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    }
  },
  
  async mounted() {
    await this.fetchCategoryDetails();
    await this.fetchServices();
  }
};