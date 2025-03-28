export default {
  template: `
    <div class="p-4">
      <h1>Manage Services</h1>

      <button @click="showForm = !showForm" class="btn btn-primary" style="position: absolute; top: 70px; right: 20px;">
        {{ showForm ? 'Cancel' : 'Add New Service' }}
      </button>

      <div class="row mt-4">
        <div v-for="service in services" :key="service.id" class="col-md-4 mb-3">
          <div class="card" style="width: 18rem;">
            <img :src="service.image_url" class="card-img-top" alt="Service Image" />
            <div class="card-body">
              <h5 class="card-title">{{ service.name }}</h5>
              <p class="card-text">{{ service.description || 'No description available' }}</p>
              <p><strong>Price:</strong> {{ service.base_price }} | <strong>Time:</strong> {{ service.time_required }} mins</p>
              <button @click="editService(service)" class="btn btn-warning btn-sm">Update</button>
              <button @click="deleteService(service.id)" class="btn btn-danger btn-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="services.length === 0"> No services found </div>

      <!-- Form for Adding or Updating Service -->
      <div v-if="showForm" class="mt-4">
        <form @submit.prevent="isEditing ? updateService() : addService()">
          <label for="name">Service Name:</label>
          <input type="text" v-model="formData.name" class="form-control" required />

          <label for="description">Description:</label>
          <textarea v-model="formData.description" class="form-control" required></textarea>

          <label for="base_price">Base Price:</label>
          <input type="number" v-model="formData.base_price" step="0.01" class="form-control" required />

          <label for="time_required">Time Required (in minutes):</label>
          <input type="number" v-model="formData.time_required" class="form-control" required />

          <label for="image_url">Image URL:</label>
          <input type="url" v-model="formData.image_url" class="form-control" />

          <label for="category_id">Category:</label>
          <select v-model="formData.category_id" class="form-control" required>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>

          <button type="submit" class="btn btn-success mt-3">{{ isEditing ? 'Update Service' : 'Add Service' }}</button>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      services: [],
      categories: [],
      formData: {
        id: null, // Add id here for editing
        name: '',
        description: '',
        base_price: 0,
        time_required: 0,
        image_url: '',
        category_id: null,
      },
      showForm: false,
      isEditing: false, // Track if we are editing
    };
  },
  methods: {
    async fetchServices() {
      const res = await fetch('/services');
      this.services = await res.json();
    },
    async fetchCategories() {
      const res = await fetch('/service_categories');
      this.categories = await res.json();
    },
    async addService() {
      try {
        const res = await fetch('/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        });
        if (res.ok) {
          this.fetchServices(); // Refresh the list after adding
          this.resetForm();
        } else {
          console.error('Failed to add service:', res.statusText);
        }
      } catch (error) {
        console.error('Error in addService:', error);
      }
    },
    
    async editService(service) {
      // Populate form with existing data for editing
      this.formData = { ...service }; // Spread operator to copy properties
      this.showForm = true;
      this.isEditing = true; // Set editing flag
    },
    
    async updateService() {
      try {
        const res = await fetch(`/services/${this.formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        });
        if (res.ok) {
          this.fetchServices(); // Refresh the list after update
          this.resetForm();
        } else {
          console.error('Failed to update service:', res.statusText);
        }
      } catch (error) {
        console.error('Error in updateService:', error);
      }
    },
    
    async deleteService(serviceId) {
      try {
        const res = await fetch(`/services/${serviceId}`, { // Ensure correct endpoint
          method: 'DELETE',
        });
        if (res.ok) {
          this.fetchServices(); // Refresh the list after deletion
        } else {
          console.error('Failed to delete service:', res.statusText);
        }
      } catch (error) {
        console.error('Error in deleteService:', error);
      }
    },
    
    resetForm() {
      this.formData = { // Reset all fields including id
        id: null,
        name: '',
        description: '',
        base_price: 0,
        time_required: 0,
        image_url: '',
        category_id: null,
      };
      this.showForm = false;
      this.isEditing = false; // Reset editing flag
    },
  },
  async mounted() {
    await this.fetchServices();
    await this.fetchCategories();
  },
};