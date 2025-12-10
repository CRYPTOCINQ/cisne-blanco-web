// finanzas.charts.js
(function (global) {
  const FinanzasApp = global.FinanzasApp;
  const { state } = FinanzasApp;

  function renderCharts(list) {
    const { chartTortaEl, chartBarrasEl, modoGraficoEl } = state.elements;

    if (!chartTortaEl || !chartBarrasEl || !modoGraficoEl) return;

    // Destruir instancias anteriores
    if (state.charts.pie) {
      state.charts.pie.destroy();
      state.charts.pie = null;
    }
    if (state.charts.bar) {
      state.charts.bar.destroy();
      state.charts.bar = null;
    }

    // ============================
    //   GRÁFICO DE TORTA
    // ============================
    const mapCat = {};
    (list || []).forEach((x) => {
      const key = x.category || "Sin categoría";
      mapCat[key] = (mapCat[key] || 0) + Math.abs(Number(x.amount) || 0);
    });

    state.charts.pie = new Chart(chartTortaEl, {
      type: "pie",
      data: {
        labels: Object.keys(mapCat),
        datasets: [
          {
            data: Object.values(mapCat),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "left",
            align: "center",
            labels: {
              padding: 10,
              usePointStyle: true,
            },
          },
        },
        layout: {
          padding: { left: 10 },
        },
      },
    });

    // ============================
    //   GRÁFICO DE BARRAS
    // ============================
    const modo = modoGraficoEl.value || "dia";
    const isNavy =
      document.documentElement.getAttribute("data-theme") === "navy-ice";

    const mapFecha = {};

    (list || []).forEach((x) => {
      const d = x.date;
      let clave = d;

      if (modo === "semana") {
        const dt = new Date(d);
        const first = new Date(dt.setDate(dt.getDate() - dt.getDay()));
        clave = first.toISOString().slice(0, 10);
      } else if (modo === "mes") {
        clave = d.slice(0, 7);
      }

      if (!mapFecha[clave]) mapFecha[clave] = 0;

      const val = (x.type === "ingreso" ? +x.amount : -x.amount) || 0;
      mapFecha[clave] += val;
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
            backgroundColor: isNavy
              ? "rgba(88,166,255,0.55)"
              : "rgba(0,123,255,0.55)",
            borderColor: isNavy
              ? "rgba(88,166,255,1)"
              : "rgba(0,123,255,1)",
            borderWidth: 1.2,
          },
        ],
      },
      options: {
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

  // ===============================================================
  //    CAMBIO DE MODO (TORTA / BARRAS / AMBOS) — CLASES CSS
  // ===============================================================
  function actualizarModoVista(modo) {
    const {
      chartContainer,
      tabTortaEl,
      tabBarrasEl,
      tabAmbosEl,
    } = state.elements;

    if (!chartContainer) return;

    state.modoActual = modo;

    [tabTortaEl, tabBarrasEl, tabAmbosEl].forEach((btn) =>
      btn?.classList.remove("btn--primary")
    );

    if (modo === "torta") tabTortaEl?.classList.add("btn--primary");
    if (modo === "barras") tabBarrasEl?.classList.add("btn--primary");
    if (modo === "ambos") tabAmbosEl?.classList.add("btn--primary");

    // NUEVO — control visual por clases globales
    document.body.classList.remove(
      "fin-view-torta",
      "fin-view-barras",
      "fin-view-ambos"
    );
    document.body.classList.add(`fin-view-${modo}`);

    if (state.charts.pie) state.charts.pie.resize();
    if (state.charts.bar) state.charts.bar.resize();
  }

  FinanzasApp.charts = {
    renderCharts,
    actualizarModoVista,
  };

  global.FinanzasApp = FinanzasApp;
})(window);
