// finanzas.main.js
(function (global) {

  document.addEventListener('DOMContentLoaded', () => {
    const FinanzasApp = global.FinanzasApp;

    if (!FinanzasApp) {
      console.error('FinanzasApp no está definido al iniciar finanzas.main.js');
      return;
    }

    const { state, utils } = FinanzasApp;

    function bindElements() {
      const $ = utils.$;

      state.elements = {
        saldoTotalEl: $('saldoTotal'),
        totalIngEl: $('totalIngresos'),
        totalEgrEl: $('totalEgresos'),
        listaEl: $('listaMovimientos'),

        filtroCatEl: $('filtroCategoria'),
        filtroDesdeEl: $('filtroDesde'),
        filtroHastaEl: $('filtroHasta'),
        btnLimpiarFiltros: $('btnLimpiarFiltros'),

        btnAdd: $('btnAdd'),
        btnExport: $('btnExport'),

        tabTortaEl: $('tabTorta'),
        tabBarrasEl: $('tabBarras'),
        tabAmbosEl: $('tabAmbos'),
        chartContainer: $('chartContainer'),
        chartTortaEl: $('chartTorta'),
        chartBarrasEl: $('chartBarras'),
        modoGraficoEl: $('modoGrafico'),
      };
    }

    function refresh() {
      const list = utils.aplicarFiltros(state.data, state.filtros);
      FinanzasApp.ui.renderTotales(list);
      FinanzasApp.ui.renderLista(list);
      FinanzasApp.charts.renderCharts(list);
      FinanzasApp.charts.actualizarModoVista(state.modoActual || 'torta');
    }

    function bindEventos() {
      const {
        filtroCatEl,
        filtroDesdeEl,
        filtroHastaEl,
        btnLimpiarFiltros,
        btnAdd,
        btnExport,
        tabTortaEl,
        tabBarrasEl,
        tabAmbosEl,
        modoGraficoEl,
      } = state.elements;

      if (btnAdd) {
        btnAdd.onclick = FinanzasApp.modals.abrirModalAlta;
      }

      if (btnExport) {
        btnExport.onclick = FinanzasApp.exportar.exportar;
      }

      if (filtroCatEl) {
        filtroCatEl.onchange = () => {
          state.filtros.categoria = filtroCatEl.value;
          refresh();
        };
      }

      if (filtroDesdeEl) {
        filtroDesdeEl.onchange = () => {
          state.filtros.desde = filtroDesdeEl.value;
          refresh();
        };
      }

      if (filtroHastaEl) {
        filtroHastaEl.onchange = () => {
          state.filtros.hasta = filtroHastaEl.value;
          refresh();
        };
      }

      if (btnLimpiarFiltros) {
        btnLimpiarFiltros.onclick = () => {
          state.filtros = { categoria: '', desde: '', hasta: '' };
          if (filtroCatEl) filtroCatEl.value = '';
          if (filtroDesdeEl) filtroDesdeEl.value = '';
          if (filtroHastaEl) filtroHastaEl.value = '';
          refresh();
        };
      }

      if (tabTortaEl) {
        tabTortaEl.onclick = () => {
          state.modoActual = 'torta';
          FinanzasApp.charts.actualizarModoVista('torta');
        };
      }

      if (tabBarrasEl) {
        tabBarrasEl.onclick = () => {
          state.modoActual = 'barras';
          FinanzasApp.charts.actualizarModoVista('barras');
        };
      }

      if (tabAmbosEl) {
        tabAmbosEl.onclick = () => {
          state.modoActual = 'ambos';
          FinanzasApp.charts.actualizarModoVista('ambos');
        };
      }

      if (modoGraficoEl) {
        modoGraficoEl.onchange = () => {
          refresh();
        };
      }
    }

    // -------- Inicialización --------
    state.data = utils.load() || [];

    bindElements();
    FinanzasApp.modals.initModals();

    // Exponer refresh para que lo usen otros módulos (modals)
    FinanzasApp.refresh = refresh;

    bindEventos();
    refresh();
  });

})(window);
