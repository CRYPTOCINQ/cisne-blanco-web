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
    //   MAPA TORTA
    // ==========================
    const mapCat = {};
    dataList.forEach((x) => {
      const key = x.category || "Sin categoría";
      mapCat[key] = (mapCat[key] || 0) + Math.abs(Number(x.amount) || 0);
    });

    const pieLabels = Object.keys(mapCat);
    const pieValues = Object.values(mapCat);
    const totalPie = pieValues.reduce((a, b) => a + b, 0);

    const pieColors = [
      "#3b82f6", "#ec4899", "#f97316",
      "#eab308", "#22c55e", "#a855f7"
    ];

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
            backgroundColor: pieLabels.map((_, i) => pieColors[i % pieColors.length])
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
              usePointStyle: true,
              padding: 12,
              generateLabels(chart) {
                const data = chart.data.datasets[0].data;
                const labels = chart.data.labels;

                return labels.map((label, i) => {
                  const value = data[i];
                  const pct = ((value / totalPie) * 100).toFixed(1);
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
                const pct = ((value / totalPie) * 100).toFixed(1);
                return `${label}: ${value} (${pct}%)`;
              },
            },
          },
        },
        layout: {
          padding: { left: 10 }
        },
      },
    });

    // ==========================
    //   CHART BARRAS
    // ==========================

    const isNavy = document.body.dataset.theme === "navy-ice";
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
          x: {
            ticks: { color: isNavy ? "#E9F2FF" : "#111" }
          },
          y: {
            ticks: { color: isNavy ? "#E9F2FF" : "#111" }
          },
        },
        plugins: {
          legend: {
            labels: { color: isNavy ? "#E9F2FF" : "#111" },
          },
        },
      },
    });
  }

  // ==========================
  //   MODO DE VISTA
  // ==========================
  function actualizarModoVista(modo) {
    const { tabTortaEl, tabBarrasEl, tabAmbosEl } = state.elements;

    document.body.classList.remove(
      "fin-view-torta",
      "fin-view-barras",
      "fin-view-ambos"
    );
    document.body.classList.add(`fin-view-${modo}`);

    [tabTortaEl, tabBarrasEl, tabAmbosEl].forEach((b) =>
      b?.classList.remove("btn--primary")
    );
    if (modo === "torta") tabTortaEl.classList.add("btn--primary");
    if (modo === "barras") tabBarrasEl.classList.add("btn--primary");
    if (modo === "ambos") tabAmbosEl.classList.add("btn--primary");

    if (state.charts.pie) state.charts.pie.resize();
    if (state.charts.bar) state.charts.bar.resize();
  }

  FinanzasApp.charts = { renderCharts, actualizarModoVista };
  global.FinanzasApp = FinanzasApp;

})(window);
