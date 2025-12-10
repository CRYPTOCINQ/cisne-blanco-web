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
      chartTortaEl,
      chartBarrasEl,
      tabTortaEl,
      tabBarrasEl,
      tabAmbosEl,
    } = state.elements;

    if (!chartContainer || !chartTortaEl || !chartBarrasEl) return;

    state.modoActual = modo;

    [tabTortaEl, tabBarrasEl, tabAmbosEl].forEach((btn) => {
      if (btn) btn.classList.remove('btn--primary');
    });

    chartTortaEl.style.width = '100%';
    chartBarrasEl.style.width = '100%';

    if (modo === 'torta') {
      if (tabTortaEl) tabTortaEl.classList.add('btn--primary');
      chartContainer.style.display = 'flex';
      chartContainer.style.gridTemplateColumns = '';
      chartTortaEl.style.display = 'block';
      chartBarrasEl.style.display = 'none';
    } else if (modo === 'barras') {
      if (tabBarrasEl) tabBarrasEl.classList.add('btn--primary');
      chartContainer.style.display = 'flex';
      chartContainer.style.gridTemplateColumns = '';
      chartTortaEl.style.display = 'none';
      chartBarrasEl.style.display = 'block';
    } else if (modo === 'ambos') {
      if (tabAmbosEl) tabAmbosEl.classList.add('btn--primary');
      chartContainer.style.display = 'grid';
      chartContainer.style.gridTemplateColumns = '1fr 1fr';
      chartTortaEl.style.display = 'block';
      chartBarrasEl.style.display = 'block';
    }

    if (state.charts.pie) state.charts.pie.resize();
    if (state.charts.bar) state.charts.bar.resize();
  }

  FinanzasApp.charts = {
    renderCharts,
    actualizarModoVista,
  };

  global.FinanzasApp = FinanzasApp;
})(window);
