// finanzas.charts.js
(function (global) {
  const FinanzasApp = global.FinanzasApp;
  const { state } = FinanzasApp;

  function renderCharts(list) {
    const {
      chartTortaEl,
      chartBarrasEl,
      modoGraficoEl,
    } = state.elements;

    if (!chartTortaEl || !chartBarrasEl || !modoGraficoEl) return;

    // Destruir si ya existen
    if (state.charts.pie) {
      state.charts.pie.destroy();
      state.charts.pie = null;
    }
    if (state.charts.bar) {
      state.charts.bar.destroy();
      state.charts.bar = null;
    }

    // ---- TORTA ----
    const mapCat = {};
    (list || []).forEach((x) => {
      const key = x.category || 'Sin categoría';
      mapCat[key] = (mapCat[key] || 0) + Math.abs(Number(x.amount) || 0);
    });

    state.charts.pie = new Chart(chartTortaEl, {
      type: 'pie',
      data: {
        labels: Object.keys(mapCat),
        datasets: [
          {
            data: Object.values(mapCat),
          },
        ],
      },
      options: {
        plugins: { legend: { position: 'right' } },
      },
    });

    // ---- BARRAS ----
    const modo = modoGraficoEl.value || 'dia';
    const mapFecha = {};

    (list || []).forEach((x) => {
      const d = x.date;
      let clave = d;

      if (modo === 'semana') {
        const dt = new Date(d);
        const first = new Date(dt.setDate(dt.getDate() - dt.getDay()));
        clave = first.toISOString().slice(0, 10);
      } else if (modo === 'mes') {
        clave = d.slice(0, 7);
      }

      if (!mapFecha[clave]) mapFecha[clave] = 0;

      const val = (x.type === 'ingreso' ? +x.amount : -x.amount) || 0;
      mapFecha[clave] += val;
    });

    const labels = Object.keys(mapFecha).sort();

    state.charts.bar = new Chart(chartBarrasEl, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Balance',
            data: labels.map((f) => mapFecha[f]),
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  function actualizarModoVista(modo) {
  const {
    chartContainer,
    tabTortaEl,
    tabBarrasEl,
    tabAmbosEl,
  } = state.elements;

  if (!chartContainer) return;

  // Guardamos modo
  state.modoActual = modo;

  // Reseteo de botones
  [tabTortaEl, tabBarrasEl, tabAmbosEl].forEach((btn) => {
    if (btn) btn.classList.remove('btn--primary');
  });

  if (modo === 'torta' && tabTortaEl) tabTortaEl.classList.add('btn--primary');
  if (modo === 'barras' && tabBarrasEl) tabBarrasEl.classList.add('btn--primary');
  if (modo === 'ambos' && tabAmbosEl) tabAmbosEl.classList.add('btn--primary');

  // 🔥 NUEVO SISTEMA: manejado por CSS mediante clases globales
  document.body.classList.remove('fin-view-torta', 'fin-view-barras', 'fin-view-ambos');

  if (modo === 'torta') document.body.classList.add('fin-view-torta');
  if (modo === 'barras') document.body.classList.add('fin-view-barras');
  if (modo === 'ambos') document.body.classList.add('fin-view-ambos');

  // Resize gráficos
  if (state.charts.pie) state.charts.pie.resize();
  if (state.charts.bar) state.charts.bar.resize();
}

FinanzasApp.charts = {
    renderCharts,
    actualizarModoVista,
  };

  global.FinanzasApp = FinanzasApp;
})(window);
