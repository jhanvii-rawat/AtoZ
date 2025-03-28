export default {
    template: `
      <div class="container mt-5">
        <h3>Service Requests</h3>
  
        <!-- Request Table -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Service Name</th>
              <th>Customer Name</th>
              <th>Requested Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.id">
              <td>{{ request.id }}</td>
              <td>{{ request.serviceName }}</td>
              <td>{{ request.customerName }}</td>
              <td>{{ request.requestedDate }}</td>
              <td>{{ request.status }}</td>
              <td>
                <button 
                  class="btn btn-success btn-sm" 
                  @click="acceptRequest(request.id)" 
                  :disabled="request.status !== 'Pending'">
                  Accept
                </button>
                <button 
                  class="btn btn-danger btn-sm" 
                  @click="declineRequest(request.id)" 
                  :disabled="request.status !== 'Pending'">
                  Decline
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  
    data() {
      return {
        requests: [], // List of service requests
      };
    },
  
    methods: {
      fetchRequests() {
        fetch('/local-api/requests')
          .then(res => res.json())
          .then(data => {
            this.requests = data;
          })
          .catch(error => console.error('Error fetching requests:', error));
      },
  
      acceptRequest(requestId) {
        fetch(`/local-api/requests/${requestId}/accept`, { method: 'POST' })
          .then(() => {
            this.updateRequestStatus(requestId, 'Accepted');
            alert('Request accepted successfully');
          })
          .catch(error => console.error('Error accepting request:', error));
      },
  
      declineRequest(requestId) {
        fetch(`/local-api/requests/${requestId}/decline`, { method: 'POST' })
          .then(() => {
            this.updateRequestStatus(requestId, 'Declined');
            alert('Request declined successfully');
          })
          .catch(error => console.error('Error declining request:', error));
      },
  
      updateRequestStatus(requestId, status) {
        const request = this.requests.find(req => req.id === requestId);
        if (request) {
          request.status = status;
        }
      },
    },
  
    mounted() {
      this.fetchRequests();
    },
  };
  