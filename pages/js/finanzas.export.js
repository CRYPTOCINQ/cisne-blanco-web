// finanzas.export.js
(function (global) {
  // Nos aseguramos de no romper nada aunque aún no exista FinanzasApp
  const root = global;

  function exportar() {
    const FinanzasApp = root.FinanzasApp;

    if (!FinanzasApp || !FinanzasApp.state || !FinanzasApp.utils) {
      console.error('FinanzasApp no está inicializado al ejecutar exportar()');
      alert('Error: la app de Finanzas no está inicializada.');
      return;
    }

    const { state, utils } = FinanzasApp;
    const data = state.data || [];

    if (!data.length) {
      alert('No hay movimientos.');
      return;
    }

    const rows = [['Fecha', 'Tipo', 'Monto', 'Categoría', 'Nota']];

    utils.aplicarFiltros(data, state.filtros).forEach((x) => {
      rows.push([
        x.date,
        x.type,
        String(x.amount),
        x.category || '-',
        x.note || '-',
      ]);
    });

    const formato = prompt('xlsx o pdf?', 'xlsx');
    if (!formato) return;

    if (formato === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Finanzas');
      XLSX.writeFile(wb, 'CisneBlanco_Finanzas.xlsx');
    } else if (formato === 'pdf') {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      let y = 20;
      rows.forEach((r) => {
        doc.text(r.join(' | '), 10, y);
        y += 7;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save('CisneBlanco_Finanzas.pdf');
    }
  }

  // Registramos el módulo sin pisar nada existente
  root.FinanzasApp = root.FinanzasApp || {};
  root.FinanzasApp.exportar = { exportar };

})(window);
