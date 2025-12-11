// finanzas.main.js — versión estable corregida
(function (global) {
  const FinanzasApp = global.FinanzasApp;
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

      // Botones de vista (quedan, pero sin lógica de gráficos)
      tabTortaEl: $('tabTorta'),
      tabBarrasEl: $('tabBarras'),
      tabAmbosEl: $('tabAmbos'),

      // Gráficos
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

    // Solo renderCharts (versión estable)
    FinanzasApp.charts.renderCharts(list);
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

    // Alta de movimiento
    if (btnAdd) {
      btnAdd.onclick = FinanzasApp.modals.abrirModalAlta;
    }

    // Exportar
    if (btnExport) {
      btnExport.onclick = FinanzasApp.exportar.exportar;
    }

    // Filtros
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
        filtroCatEl.value = '';
        filtroDesdeEl.value = '';
        filtroHastaEl.value = '';
        refresh();
      };
    }

    // --- Vista de gráficos (desactivada porque tu charts.js estable no la usa) ---

    if (tabTortaEl) {
      tabTortaEl.onclick = () => {
        // función eliminada en la versión estable
        refresh();
      };
    }

    if (tabBarrasEl) {
      tabBarrasEl.onclick = () => {
        // función eliminada en la versión estable
        refresh();
      };
    }

    if (tabAmbosEl) {
      tabAmbosEl.onclick = () => {
        // función eliminada en la versión estable
        refresh();
      };
    }

    if (modoGraficoEl) {
      modoGraficoEl.onchange = () => {
        refresh();
      };
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos (si querés ignorar localStorage mañana lo ajustamos)
    state.data = utils.load() || [];

    // Bind de elementos
    bindElements();

    // Inicializar modales
    FinanzasApp.modals.initModals();

    // Exponer refresh para los modales
    FinanzasApp.refresh = refresh;

    // Bind eventos UI
    bindEventos();

    // Primera renderización
    refresh();
  });

})(window);
