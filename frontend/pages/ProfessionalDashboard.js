export default {
    template: `
      <div class="container mt-5">
        <h3>Professional Dashboard</h3>
        
        <div class="row">
          <!-- Card for New Requests -->
          <div class="col-md-4">
            <div class="card text-white bg-primary mb-3">
              <div class="card-body">
                <h5 class="card-title">New Requests</h5>
                <p class="card-text display-4">{{ newRequests }}</p>
              </div>
            </div>
          </div>
  
          <!-- Card for Completed Requests -->
          <div class="col-md-4">
            <div class="card text-white bg-success mb-3">
              <div class="card-body">
                <h5 class="card-title">Completed Requests</h5>
                <p class="card-text display-4">{{ completedRequests }}</p>
              </div>
            </div>
          </div>
  
          <!-- Card for Current Requests -->
          <div class="col-md-4">
            <div class="card text-white bg-warning mb-3">
              <div class="card-body">
                <h5 class="card-title">Current Requests</h5>
                <p class="card-text display-4">{{ currentRequests.length }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Current and Upcoming Requests -->
        <div class="mt-5">
          <h4>Current Requests (Today & Tomorrow)</h4>
          <ul class="list-group">
            <li v-for="request in currentRequests" :key="request.id" class="list-group-item">
              <strong>Service:</strong> {{ request.serviceName }} <br>
              <strong>Date:</strong> {{ request.requestDate }} <br>
              <strong>Customer:</strong> {{ request.customerName }}
            </li>
          </ul>
        </div>
      </div>
    `,
  
    data() {
      return {
        newRequests: 0,
        completedRequests: 0,
        currentRequests: [], // Requests for today and tomorrow
      };
    },
  
    methods: {
      fetchDashboardData() {
        fetch('/local-api/dashboard-data')
          .then((res) => res.json())
          .then((data) => {
            this.newRequests = data.newRequests;
            this.completedRequests = data.completedRequests;
            this.currentRequests = data.currentRequests;
          })
          .catch((error) => console.error('Error fetching dashboard data:', error));
      },
    },
  
    mounted() {
      this.fetchDashboardData(); // Fetch dashboard data on mount
    },
  };
  