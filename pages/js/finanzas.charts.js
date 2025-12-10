// finanzas.charts.js
(function (global) {
  const FinanzasApp = global.FinanzasApp;
  
  const { state } = FinanzasApp;

  
  function renderCharts(list) {
    const { chartTortaEl, chartBarrasEl, modoGraficoEl } = state.elements;
    if (!chartTortaEl || !chartBarrasEl) return;

    // Reset
    if (state.charts.pie) state.charts.pie.destroy();
    if (state.charts.bar) state.charts.bar.destroy();

    const dataList = list || [];

    // ==========================
    //   MAPA PARA LA TORTA
    // ==========================
    const mapCat = {};
    dataList.forEach((x) => {
      const key = x.category || "Sin categoría";
      mapCat[key] = (mapCat[key] || 0) + Math.abs(Number(x.amount) || 0);
    });

    const pieLabels = Object.keys(mapCat);
    const pieValues = Object.values(mapCat);

    // Colores
    const pieColors = ["#3b82f6", "#ec4899", "#f97316", "#eab308", "#22c55e", "#a855f7"];

    // ==========================
    //   CHART TORTA
    // ==========================
    state.charts.pie = new Chart(chartTortaEl, {
      type: "pie",
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieValues,
            backgroundColor: pieLabels.map((_, i) => pieColors[i % pieColors.length]),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            position: "left",
            labels: {
              color: getComputedStyle(document.body).color,
              generateLabels(chart) {
                const data = chart.data.datasets[0].data;
                const total = data.reduce((a, b) => a + b, 0);

                return chart.data.labels.map((label, i) => {
                  const value = data[i];
                  const pct = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${pct}% — ${label}`,
                    fillStyle: chart.data.datasets[0].backgroundColor[i],
                    strokeStyle: "transparent",
                    lineWidth: 0,
                  };
                });
              },
            },
          },

          tooltip: {
            callbacks: {
              label(context) {
                const label = context.label;
                const value = context.raw;
                const data = context.chart.data.datasets[0].data;
                const total = data.reduce((a, b) => a + b, 0);
                const pct = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${pct}%)`;
              },
            },
          },
        },
      },
    });

    // ==========================
    //   CHART BARRAS
    // ==========================
    const modo = modoGraficoEl.value;
    const mapFecha = {};

    dataList.forEach((x) => {
      let key = x.date;

      if (modo === "semana") {
        const dt = new Date(x.date);
        dt.setDate(dt.getDate() - dt.getDay());
        key = dt.toISOString().slice(0, 10);
      } else if (modo === "mes") {
        key = x.date.slice(0, 7);
      }

      mapFecha[key] = (mapFecha[key] || 0) + (x.type === "ingreso" ? +x.amount : -x.amount);
    });

    const labels = Object.keys(mapFecha).sort();

    state.charts.bar = new Chart(chartBarrasEl, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Balance",
            data: labels.map((f) => mapFecha[f]),
            backgroundColor: "rgba(59,130,246,0.5)",
            borderColor: "rgba(59,130,246,1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: getComputedStyle(document.body).color }},
          y: { ticks: { color: getComputedStyle(document.body).color }},
        },
        plugins: {
          legend: { labels: { color: getComputedStyle(document.body).color }},
        },
      },
    });
  }


  function actualizarModoVista(modo) {
    const { chartContainer, tabTortaEl, tabBarrasEl, tabAmbosEl } = state.elements;

    document.body.classList.remove("fin-view-torta", "fin-view-barras", "fin-view-ambos");
    document.body.classList.add(`fin-view-${modo}`);

    [tabTortaEl, tabBarrasEl, tabAmbosEl].forEach((b) => b?.classList.remove("btn--primary"));
    if (modo === "torta") tabTortaEl.classList.add("btn--primary");
    if (modo === "barras") tabBarrasEl.classList.add("btn--primary");
    if (modo === "ambos") tabAmbosEl.classList.add("btn--primary");

    if (state.charts.pie) state.charts.pie.resize();
    if (state.charts.bar) state.charts.bar.resize();
  }

  FinanzasApp.charts = { renderCharts, actualizarModoVista };
  global.FinanzasApp = FinanzasApp;
})(window);
