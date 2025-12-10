// finanzas.core.js
(function (global) {
  const FinanzasApp = global.FinanzasApp || {};

  const DB_KEY = 'cb_finanzas_v1'; // mantenemos misma key para no romper tus datos

  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');

  function toISO(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    } catch (e) {
      console.error('Error leyendo DB Finanzas', e);
      return [];
    }
  }

  function save(arr) {
    localStorage.setItem(DB_KEY, JSON.stringify(arr || []));
  }

  function formato(n) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(n || 0);
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[m]));
  }

  function aplicarFiltros(data, filtros) {
    return (data || []).filter((x) => {
      if (filtros.categoria && x.category !== filtros.categoria) return false;
      if (filtros.desde && x.date < filtros.desde) return false;
      if (filtros.hasta && x.date > filtros.hasta) return false;
      return true;
    });
  }

  FinanzasApp.DB_KEY = DB_KEY;
  FinanzasApp.utils = {
    $,
    pad,
    toISO,
    load,
    save,
    formato,
    escapeHtml,
    aplicarFiltros,
  };

  FinanzasApp.state = {
    data: [],
    filtros: { categoria: '', desde: '', hasta: '' },
    charts: { pie: null, bar: null },
    modoActual: 'torta',
    elements: {},
  };

  global.FinanzasApp = FinanzasApp;
})(window);
