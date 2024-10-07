document.addEventListener("DOMContentLoaded", function () {
  // Initial POST request for population data of Finland
  fetchPopulationData("SSS"); // Whole country code is "SSS"

  // Form submit button click handler
  document.getElementById("submit-data").addEventListener("click", function () {
    const areaCode = document.getElementById("input-area").value.toUpperCase();
    fetchPopulationData(areaCode); // Fetch data based on input municipality code
  });

  // Prediction button click handler
  document.getElementById("add-data").addEventListener("click", addPrediction);

  // Navigation button to go to another chart
  document.getElementById("navigation").addEventListener("click", function () {
    window.location.href = "newchart.html"; // Redirect to newchart.html
  });
});

// Function to fetch population data with POST
async function fetchPopulationData(areaCode) {
  const response = await fetch("https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: [
        {
          code: "Vuosi",
          selection: {
            filter: "item",
            values: [
              "2000", "2001", "2002", "2003", "2004", "2005",
              "2006", "2007", "2008", "2009", "2010", "2011",
              "2012", "2013", "2014", "2015", "2016", "2017",
              "2018", "2019", "2020", "2021"
            ],
          },
        },
        {
          code: "Alue",
          selection: {
            filter: "item",
            values: [areaCode],
          },
        },
        {
          code: "Tiedot",
          selection: {
            filter: "item",
            values: ["vaesto"],
          },
        },
      ],
      response: {
        format: "json-stat2",
      },
    }),
  });

  const data = await response.json();
  const populationData = data.value;
  const years = Object.keys(data.dimension.Vuosi.category.label);
  displayChart(populationData, years);
}

// Function to display the chart
function displayChart(data, labels) {
  const chart = new frappe.Chart("#chart", {
    data: {
      labels: labels,
      datasets: [
        {
          name: "Population",
          values: data,
        },
      ],
    },
    title: "Population Growth (2000-2021)",
    type: "line",
    height: 450,
    colors: ["#eb5146"],
  });
}

// Function to add data prediction
function addPrediction() {
  const chartData = document.querySelector(".frappe-chart").chart.data.datasets[0].values;
  const lastValue = chartData[chartData.length - 1];
  const deltas = chartData.slice(1).map((val, idx) => val - chartData[idx]);
  const meanDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const predictedValue = lastValue + meanDelta;

  chartData.push(predictedValue); // Add prediction to the dataset
  document.querySelector(".frappe-chart").update(); // Update the chart
}
