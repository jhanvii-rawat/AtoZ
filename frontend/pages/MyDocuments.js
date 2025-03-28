export default {
    template: `
      <div class="container mt-5">
        <h3>My Documents</h3>
  
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Professional Profile Details</h5>
            <p><strong>Service Name:</strong> {{ profile.serviceName }}</p>
            <p><strong>Experience:</strong> {{ profile.experienceYears }} years</p>
            <p><strong>Description:</strong> {{ profile.description }}</p>
            
            <div>
              <h5>Status:</h5>
              <span 
                :class="statusClass"
                class="badge p-2"
                style="font-size: 1.2em;">
                {{ profile.status }}
              </span>
            </div>
  
            <div v-if="profile.status === 'Rejected'">
              <h5 class="mt-3 text-danger">Admin Remark:</h5>
              <p>{{ profile.remark }}</p>
              
              <button class="btn btn-warning mt-3" @click="showUploadModal">
                Upload Document Again
              </button>
            </div>
          </div>
        </div>
  
        <!-- Modal for Uploading Document -->
        <div class="modal fade" id="uploadModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Upload Document</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <input type="file" @change="handleFileUpload" />
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="submitDocument">Submit</button>
                <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  
    data() {
      return {
        profile: {}, // Professional profile details
        documentFile: null, // File for re-upload
      };
    },
  
    computed: {
      statusClass() {
        switch (this.profile.status) {
          case 'Verified':
            return 'bg-success text-white';
          case 'Pending':
            return 'bg-warning text-dark';
          case 'Rejected':
            return 'bg-danger text-white';
          default:
            return '';
        }
      },
    },
  
    methods: {
      fetchProfile() {
        fetch('/local-api/professional-profile')
          .then((res) => res.json())
          .then((data) => {
            this.profile = data;
          })
          .catch((error) => console.error('Error fetching profile:', error));
      },
  
      showUploadModal() {
        const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
        modal.show();
      },
  
      handleFileUpload(event) {
        this.documentFile = event.target.files[0];
      },
  
      submitDocument() {
        if (!this.documentFile) {
          alert('Please select a document to upload.');
          return;
        }
  
        const formData = new FormData();
        formData.append('document', this.documentFile);
  
        fetch('/local-api/upload-document', {
          method: 'POST',
          body: formData,
        })
          .then((res) => {
            if (res.ok) {
              alert('Document uploaded successfully');
              this.fetchProfile(); // Refresh profile
            } else {
              alert('Error uploading document');
            }
          })
          .catch((error) => console.error('Error uploading document:', error));
      },
    },
  
    mounted() {
      this.fetchProfile(); // Fetch profile data on mount
    },
  };
  