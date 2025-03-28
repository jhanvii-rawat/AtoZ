export default {
  template: `
    <div class="container mt-5">
      <h3>Admin Reports</h3>

      <!-- Report Selection -->
      <div class="mb-3">
        <label for="reportType" class="form-label">Select Report Type:</label>
        <select id="reportType" class="form-select" v-model="selectedReport" @change="fetchReportData">
          <option value="servicesInCategory">Services in a Category</option>
          <option value="reviewOfServices">Review of Services</option>
        </select>
      </div>

      <!-- Chart Display -->
      <canvas id="reportChart" width="400" height="200"></canvas>

      <!-- Download CSV Button -->
      <button class="btn btn-primary mt-3" @click="downloadCSV">Download CSV</button>
    </div>
  `,

  data() {
    return {
      selectedReport: 'servicesInCategory', // Default report type
      chart: null, // Chart.js instance
      reportData: [], // Data for the report
    };
  },

  methods: {
    fetchReportData() {
      let endpoint;
      switch (this.selectedReport) {
        case 'servicesInCategory':
          endpoint = '/local-api/services-in-category'; 
          break;
        case 'reviewOfServices':
          endpoint = '/local-api/review-of-services'; 
          break;
        default:
          console.error('Invalid report type selected');
          return;
      }

      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          this.reportData = data;
          this.updateChart();
        })
        .catch((error) => console.error('Error fetching report data:', error));
    },

    updateChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const labels = this.reportData.map((item) => item.label);
      const data = this.reportData.map((item) => item.value);

      const ctx = document.getElementById('reportChart').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: `Report: ${this.selectedReport}`,
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          indexAxis: this.selectedReport === 'servicesInCategory' ? 'y' : 'x', // Horizontal for services in category
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, // Gap of 4 for review scores
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    downloadCSV() {
      const headers = ['Label', 'Value'];
      const rows = this.reportData.map((item) => [item.label, item.value]);
      const csvContent =
        [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${this.selectedReport}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },

  mounted() {
    this.fetchReportData();
  },
};
