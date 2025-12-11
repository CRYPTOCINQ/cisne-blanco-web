// finanzas.charts.js — versión estable
(function (global) {
  const FinanzasApp = global.FinanzasApp;
  const { state } = FinanzasApp;

  function renderCharts(list) {
    const { chartTortaEl, chartBarrasEl, modoGraficoEl } = state.elements;
    if (!chartTortaEl || !chartBarrasEl) return;

    // Reset de gráficos previos
    if (state.charts.pie) state.charts.pie.destroy();
    if (state.charts.bar) state.charts.bar.destroy();

    const dataList = list || [];

    // ==========================================
    //   AGRUPAR POR CATEGORÍA (TORTA)
    // ==========================================
    const mapCat = {};
    dataList.forEach((x) => {
      const key = x.category || "Sin categoría";
      const amt = Math.abs(Number(x.amount) || 0);
      mapCat[key] = (mapCat[key] || 0) + amt;
    });

    const pieLabels = Object.keys(mapCat);
    const pieValues = Object.values(mapCat);
    

    // Colores estándar
    const pieColors = [
      "#3b82f6", "#ec4899", "#f97316",
      "#eab308", "#22c55e", "#a855f7"
    ];

    // ==========================================
    //   CHART TORTA (ESTABLE)
    // ==========================================
    state.charts.pie = new Chart(chartTortaEl, {
      type: "pie",
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieValues,
            backgroundColor: pieLabels.map((_, i) => pieColors[i % pieColors.length]),
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "left",
            labels: {
              padding: 12,
              usePointStyle: true,

            },
          },
        },
        layout: {
          padding: { left: 10 },
        },
      },
    });

    // ==========================================
    //   AGRUPAR POR FECHA (BARRAS)
    // ==========================================
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

      const amt = x.type === "ingreso" ? Number(x.amount) : -Number(x.amount);
      mapFecha[key] = (mapFecha[key] || 0) + amt;
    });

    const labels = Object.keys(mapFecha).sort();

    const isNavy = document.body.dataset.theme === "navy-ice";

    // ==========================================
    //   CHART BARRAS (ESTABLE)
    // ==========================================
    state.charts.bar = new Chart(chartBarrasEl, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Balance",
            data: labels.map((f) => mapFecha[f]),
            backgroundColor: "rgba(59,130,246,0.45)",
            borderColor: "rgba(59,130,246,1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: isNavy ? "#E9F2FF" : "#111" } },
          y: { ticks: { color: isNavy ? "#E9F2FF" : "#111" } },
        },
        plugins: {
          legend: {
            labels: {
              color: isNavy ? "#E9F2FF" : "#111",
            },
          },
        },
      },
    });
  }

  FinanzasApp.charts = { renderCharts };
  global.FinanzasApp = FinanzasApp;

})(window);
