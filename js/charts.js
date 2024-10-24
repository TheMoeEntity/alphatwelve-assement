let eventData = [];
let registrationsByMonth = [];
async function fetchAndPopulate() {
  try {
    const response = await fetch("/data/events.json");
    eventData = await response.json();
  } catch (error) {
    console.error("Error fetching the event data:", error);
    eventData = [];
  }
}
await fetchAndPopulate();
const getMonthIndex = (dateString) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = dateString.split(" ")[0]; // e.g., "January 10, 2024"
  return months.indexOf(monthName);
};
const getRegisterationByMonth = () => {
  const newRegistrationsByMonth = new Array(12).fill(0);

  // Loop through eventData and sum registrations for each month
  eventData.forEach((event) => {
    const monthIndex = getMonthIndex(event.date);
    newRegistrationsByMonth[monthIndex] += event.registrations;
  });

  console.log(newRegistrationsByMonth);
  return newRegistrationsByMonth;
};
registrationsByMonth = getRegisterationByMonth()
console.log(registrationsByMonth)
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
        label: "Event Registerations",
        data: registrationsByMonth,
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
