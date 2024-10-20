const ctx = document.getElementById("myBarChart").getContext("2d");
const myBarChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 13, 15, 7, 3, 24, 8, 10, 27, 19, 30],
        backgroundColor: "#8576FF",
        borderColor: "rgba(133, 118, 255, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Disable y-axis grid lines
        },
      },
      x: {
        grid: {
          display: false, // Disable x-axis grid lines
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(133, 118, 255, 1)", // Set legend text color if needed
        },
      },
    },
  },
});
