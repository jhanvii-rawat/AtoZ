export default {
    template: `
      <div class="categories-container" style="padding: 20px;">
        <h1>Categories of Services</h1>
        <button 
          class="btn-outline" 
          @click="toggleForm"
          style="background-color: #4CAF50; color: white; border-radius: 5px; padding: 10px 20px; font-size: 16px;">
          + Add Category
        </button>
  
        <!-- Form container with margins and centered alignment -->
        <div v-if="showForm" class="category-form-container" 
          style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <div class="category-form">
            <h2 style="margin-bottom: 20px; font-size: 24px; color: #333;">Add New Category</h2>
            <form @submit.prevent="addCategory">
              <div class="mb-3">
                <label for="name" class="form-label" style="font-size: 16px; font-weight: bold;">Category Name:</label>
                <input 
                  type="text" 
                  v-model="newCategory.name" 
                  id="name" 
                  class="form-control" 
                  required 
                  style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ccc;">
        </div>
  
              <div class="mb-3">
                <label for="description" class="form-label" style="font-size: 16px; font-weight: bold;">Description:</label>
                <textarea 
                  v-model="newCategory.description" 
                  id="description" 
                  class="form-control" 
                  style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ccc;">
                </textarea>
              </div>
  
              <div class="mb-3">
                <label for="image_url" class="form-label" style="font-size: 16px; font-weight: bold;">Image URL:</label>
                <input 
                  type="text" 
                  v-model="newCategory.image_url" 
                  id="image_url" 
                  class="form-control" 
                  required 
                  style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ccc;">
              </div>
  
              <button 
                type="submit" 
                class="btn btn-success" 
                style="width: 100%; background-color: #28a745; color: white; padding: 10px; border-radius: 5px; font-size: 16px;">
                Save Category
              </button>
            </form>
          </div>
        </div>
  
        <!-- Categories Display Section with Flexbox for equal gaps -->
        <div class="categories-list" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
          <div 
            class="category-card" 
            v-for="category in categories" 
            :key="category.id"
            style="width: 18rem; box-sizing: border-box;">
            <div class="card" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
              <img :src="category.image_url" class="card-img-top" alt="Category Image" style="border-radius: 8px; height: 180px; object-fit: cover;">
              <div class="card-body" style="padding: 10px;">
                <h5 class="card-title" style="font-size: 18px; font-weight: bold;">{{ category.name }}</h5>
                <p class="card-text" style="font-size: 14px; color: #666;">
                  {{ category.description || 'No description available' }}
                </p>
                <router-link 
                  :to="{ name: 'viewcategory', params: { categoryId: category.id } }" 
                  class="btn btn-primary" 
                  style="background-color: #007bff; color: white; padding: 8px 15px; border-radius: 5px;">
                  Open
                </router-link>


              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        categories: [],
        showForm: false,
        newCategory: {
          name: '',
          description: '',
          image_url: ''
        }
      };
    },
    methods: {
      async fetchCategories() {
        const res = await fetch(location.origin + '/categories');
        this.categories = await res.json();
      },
      async addCategory() {
        const res = await fetch(location.origin + '/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token' : this.$store.state.auth_token
          },
          body: JSON.stringify(this.newCategory)
        });
  
        if (res.ok) {
          this.fetchCategories(); // Refresh categories list
          this.resetForm();
        } else {
          alert('Failed to add category.');
        }
      },
      toggleForm() {
        this.showForm = !this.showForm;
      },
      resetForm() {
        this.newCategory = { name: '', description: '', image_url: '' };
        this.showForm = false;
      }
    },
    async mounted() {
      this.fetchCategories();
    }
  };
  