// finanzas.charts.js
(function (global) {
  const FinanzasApp = global.FinanzasApp;
  if (!FinanzasApp) {
    console.error('FinanzasApp no está definido en finanzas.charts.js');
    return;
  }

  const { state } = FinanzasApp;
  state.charts = state.charts || { pie: null, bar: null };

  function renderCharts(list) {
    const {
      chartTortaEl,
      chartBarrasEl,
      modoGraficoEl,
    } = state.elements || {};

    if (!chartTortaEl || !chartBarrasEl || !modoGraficoEl) return;

    // --- destruir instancias previas ---
    if (state.charts.pie) {
      state.charts.pie.destroy();
      state.charts.pie = null;
    }
    if (state.charts.bar) {
      state.charts.bar.destroy();
      state.charts.bar = null;
    }

    const dataList = list || [];

    // ====================================================
    //  TORTA POR CATEGORÍA
    // ====================================================
    const mapCat = {};
    dataList.forEach((x) => {
      const key = x.category || 'Sin categoría';
      mapCat[key] = (mapCat[key] || 0) + Math.abs(Number(x.amount) || 0);
    });

    const pieLabels = Object.keys(mapCat);
    const pieValues = Object.values(mapCat);

    // paleta sencilla (se repite si hay más categorías)
    const pieColorsBase = [
      '#3b82f6', // azul
      '#ec4899', // rosa
      '#f97316', // naranja
      '#eab308', // amarillo
      '#22c55e', // verde
      '#a855f7', // violeta
    ];
    const pieColors = pieLabels.map((_, i) => pieColorsBase[i % pieColorsBase.length]);

    state.charts.pie = new Chart(chartTortaEl, {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieValues,
            backgroundColor: pieColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,

        plugins: {
          legend: {
            position: 'left',
            labels: {
              padding: 12,
              usePointStyle: true,
              generateLabels(chart) {
                const data = chart.data.datasets[0].data;
                const labels = chart.data.labels;
                const total = data.reduce((a, b) => a + b, 0) || 1;

                return labels.map((label, i) => {
                  const value = data[i];
                  const pct = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${pct}% – ${label}`,
                    fillStyle: chart.data.datasets[0].backgroundColor[i],
                    strokeStyle: 'transparent',
                    lineWidth: 0,
                  };
                });
              },
            },
          },

          tooltip: {
            callbacks: {
              label(context) {
                const label = context.label || '';
                const value = Number(context.raw || 0);
                const data = context.chart.data.datasets[0].data;
                const total = data.reduce((a, b) => a + b, 0) || 1;
                const pct = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${pct}%)`;
              },
            },
          },
        },

        layout: {
          padding: { left: 20 },
        },
      },
    });

    // ====================================================
    //  BARRAS POR FECHA (DÍA / SEMANA / MES)
    // ====================================================
    const modo = modoGraficoEl.value || 'dia';
    const mapFecha = {};

    dataList.forEach((x) => {
      const d = x.date;
      if (!d) return;

      let clave = d;

      if (modo === 'semana') {
        const dt = new Date(d);
        const first = new Date(dt);
        first.setDate(dt.getDate() - dt.getDay());
        clave = first.toISOString().slice(0, 10);
      } else if (modo === 'mes') {
        clave = d.slice(0, 7);
      }

      if (!mapFecha[clave]) mapFecha[clave] = 0;

      const val = (x.type === 'ingreso' ? +x.amount : -x.amount) || 0;
      mapFecha[clave] += val;
    });

    const barLabels = Object.keys(mapFecha).sort();
    const barValues = barLabels.map((f) => mapFecha[f]);

    state.charts.bar = new Chart(chartBarrasEl, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            label: 'Balance',
            data: barValues,
            backgroundColor: 'rgba(56, 189, 248, 0.7)',
            borderColor: 'rgba(56, 189, 248, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  
  function actualizarModoVista(modo) {
    const {
      chartContainer,
      tabTortaEl,
      tabBarrasEl,
      tabAmbosEl,
    } = state.elements || {};

    if (!chartContainer) return;

    state.modoActual = modo;

    [tabTortaEl, tabBarrasEl, tabAmbosEl].forEach((btn) => {
      if (btn) btn.classList.remove('btn--primary');
    });

    if (modo === 'torta' && tabTortaEl) tabTortaEl.classList.add('btn--primary');
    if (modo === 'barras' && tabBarrasEl) tabBarrasEl.classList.add('btn--primary');
    if (modo === 'ambos' && tabAmbosEl) tabAmbosEl.classList.add('btn--primary');

    document.body.classList.remove('fin-view-torta', 'fin-view-barras', 'fin-view-ambos');
    if (modo === 'torta') document.body.classList.add('fin-view-torta');
    if (modo === 'barras') document.body.classList.add('fin-view-barras');
    if (modo === 'ambos') document.body.classList.add('fin-view-ambos');

    if (state.charts.pie) state.charts.pie.resize();
    if (state.charts.bar) state.charts.bar.resize();
  }

  FinanzasApp.charts = {
    renderCharts,
    actualizarModoVista,
  };

  global.FinanzasApp = FinanzasApp;
})(window);
