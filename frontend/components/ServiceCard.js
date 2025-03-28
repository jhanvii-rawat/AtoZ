export default {
    props: ['name', 'description', 'base_price', 'image_url'],
    template: `
      <div class="service-card">
        <img :src="image_url" alt="Service Image" class="service-image" />
        <h2 @click="$router.push('/service/' + service_id)>{{ name }}</h2>
        <p>{{ description }}</p>
        <p><strong>Price: </strong>\${{ base_price.toFixed(2) }}</p>
      </div>
    `,
    computed: {
      // Any additional computed properties can be added here if needed
    }
  };
  