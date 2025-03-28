export default {
    props: {
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    template: `
      <div class="card my-2">
        <div class="card-body">
          <h5 class="card-title">{{ username }}</h5>
          <p class="card-text">Email: {{ email }}</p>
          <p class="card-text">Status: <span :class="statusClass">{{ status }}</span></p>
        </div>
      </div>
    `,
    computed: {
      statusClass() {
        return this.status === 'Active' ? 'text-success' : 'text-danger';
      },
    },
  };
  