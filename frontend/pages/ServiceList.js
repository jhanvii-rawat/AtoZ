import ServiceCard from "../components/ServiceCard.js";

export default {
  template: `
    <div class="p-4">
      <h1>Available Services</h1>
      <div v-if="services.length">
        <ServiceCard 
          v-for="service in services" 
          :key="service.id" 
          :name="service.name" 
          :description="service.description" 
          :base_price="service.base_price" 
          :image_url="service.image_url" 
        />
      </div>
      <div v-else>No services found</div>
    </div>
  `,
  data() {
    return {
      services: []
    };
  },
  async mounted() {
    try {
      const res = await fetch(location.origin + '/api/service', {
        headers: {
          'Authentication-Token': this.$store.state.auth_token
        }
      });

      if (res.ok) {
        this.services = await res.json();
        console.log(this.services);
      } else {
        console.error("Failed to fetch services.");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  },
  components: {
    ServiceCard
  }
};
