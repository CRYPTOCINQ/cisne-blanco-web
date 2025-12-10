// finanzas.ui.js
(function (global) {
  const FinanzasApp = global.FinanzasApp;
  const { state, utils } = FinanzasApp;

  function renderTotales(list) {
    const { saldoTotalEl, totalIngEl, totalEgrEl } = state.elements;

    const ingresos = list
      .filter((x) => x.type === 'ingreso')
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    const egresos = list
      .filter((x) => x.type === 'egreso')
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    const saldo = ingresos - egresos;

    if (totalIngEl) totalIngEl.textContent = utils.formato(ingresos);
    if (totalEgrEl) totalEgrEl.textContent = utils.formato(egresos);
    if (saldoTotalEl) saldoTotalEl.textContent = utils.formato(saldo);
  }

  function renderLista(list) {
    const { listaEl } = state.elements;
    if (!listaEl) return;

    if (!list.length) {
      listaEl.innerHTML = '<div class="muted">No hay movimientos registrados.</div>';
      return;
    }

    listaEl.innerHTML = '';

    list.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'card p-3 flex items-start justify-between';

      row.innerHTML = `
        <div>
          <div class="text-sm font-semibold">
            ${item.type === 'ingreso' ? '🟢 Ingreso' : '🔴 Egreso'} — ${utils.formato(item.amount)}
          </div>
          <div class="text-xs muted">
            ${item.date}${item.category ? ` • ${item.category}` : ''}
          </div>
          ${
            item.note
              ? `<div class="mt-1 text-xs muted">${utils.escapeHtml(item.note)}</div>`
              : ''
          }
        </div>

        <div class="action-row flex gap-2">
          <button class="btn btn-sm" data-action="edit">Editar</button>
          <button class="btn btn-sm" data-action="delete">Borrar</button>
        </div>
      `;

      const btnEdit = row.querySelector('[data-action="edit"]');
      const btnDelete = row.querySelector('[data-action="delete"]');

      if (btnEdit) {
        btnEdit.onclick = () => FinanzasApp.modals.abrirModalEdicion(item.id);
      }
      if (btnDelete) {
        btnDelete.onclick = () => FinanzasApp.modals.eliminar(item.id);
      }

      listaEl.appendChild(row);
    });
  }

  FinanzasApp.ui = {
    renderTotales,
    renderLista,
  };

  global.FinanzasApp = FinanzasApp;
})(window);
