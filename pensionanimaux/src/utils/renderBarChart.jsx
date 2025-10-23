import { Chart } from 'chart.js/auto';

export function renderBarChart(canvasRef, dataThisYear, dataLastYear) {
  if (!canvasRef.current) return;

  const ctx = canvasRef.current.getContext('2d');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "This Year",
          data: dataThisYear,
          backgroundColor: "#F2865E",
          borderColor: "#F2865E",
          borderWidth: 0.8,
          borderRadius: 20,
          barThickness: 8
        },
        {
          label: "Last Year",
          data: dataLastYear,
          backgroundColor: "#F2C1AE",
          borderColor: "#F2C1AE",
          borderWidth: 0.8,
          borderRadius: 20,
          barThickness: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  return () => chart.destroy(); // for cleanup
}
