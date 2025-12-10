// finanzas.modals.js
(function (global) {
  const FinanzasApp = global.FinanzasApp;
  const { state, utils } = FinanzasApp;

  let editingId = null;
  let modalFin = null;

  function crearModalMovimientos() {
    modalFin = document.createElement('dialog');
    modalFin.id = 'modalFin';
    modalFin.className = 'card';
    modalFin.style.padding = '0';
    modalFin.innerHTML = `
      <form method="dialog" style="padding:1rem 1rem 0 1rem;">
        <h3 id="modalTitle">Nuevo movimiento</h3>
        <div class="modal-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;">
          <div><label class="muted">Fecha</label><input id="inpDate" type="date" class="input"></div>
          <div><label class="muted">Tipo</label>
            <select id="inpType" class="input">
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </div>
          <div><label class="muted">Monto</label><input id="inpAmount" type="number" step="0.01" class="input"></div>
          <div>
            <label class="muted">Categoría</label>
            <select id="inpCategory" class="input">
              <option value="">Sin categoría</option>
              <option>Forex</option>
              <option>Acciones</option>
              <option>Índices</option>
              <option>Futuros</option>
              <option>Crypto</option>
              <option>Otros</option>
            </select>
          </div>
          <div style="grid-column:1/-1;">
            <label class="muted">Nota</label>
            <textarea id="inpNote" class="input"></textarea>
          </div>
        </div>
        <div class="modal-actions" style="display:flex;gap:.5rem;justify-content:flex-end;padding:1rem 0;">
          <button id="btnSave" class="btn btn-primary">Guardar</button>
          <button value="cancel" class="btn">Cerrar</button>
        </div>
      </form>
    `;
    document.body.appendChild(modalFin);

    const btnSave = utils.$('btnSave');
    if (btnSave) {
      btnSave.onclick = guardarMovimiento;
    }
  }

  function abrirModalAlta() {
    editingId = null;
    const modalTitle = utils.$('modalTitle');
    const inpDate = utils.$('inpDate');
    const inpType = utils.$('inpType');
    const inpAmount = utils.$('inpAmount');
    const inpCategory = utils.$('inpCategory');
    const inpNote = utils.$('inpNote');

    if (modalTitle) modalTitle.textContent = 'Nuevo movimiento';
    if (inpDate) inpDate.value = utils.toISO(new Date());
    if (inpType) inpType.value = 'ingreso';
    if (inpAmount) inpAmount.value = '';
    if (inpCategory) inpCategory.value = '';
    if (inpNote) inpNote.value = '';

    modalFin.showModal();
  }

  function abrirModalEdicion(id) {
    const it = (state.data || []).find((x) => x.id === id);
    if (!it) return;

    editingId = id;

    const modalTitle = utils.$('modalTitle');
    const inpDate = utils.$('inpDate');
    const inpType = utils.$('inpType');
    const inpAmount = utils.$('inpAmount');
    const inpCategory = utils.$('inpCategory');
    const inpNote = utils.$('inpNote');

    if (modalTitle) modalTitle.textContent = 'Editar movimiento';
    if (inpDate) inpDate.value = it.date;
    if (inpType) inpType.value = it.type;
    if (inpAmount) inpAmount.value = it.amount;
    if (inpCategory) inpCategory.value = it.category || '';
    if (inpNote) inpNote.value = it.note || '';

    modalFin.showModal();
  }

  function guardarMovimiento(ev) {
    ev.preventDefault();

    const date = utils.$('inpDate').value;
    const type = utils.$('inpType').value;
    const amount = parseFloat(utils.$('inpAmount').value);
    const category = utils.$('inpCategory').value;
    const note = utils.$('inpNote').value.trim();

    if (!date || !type || !isFinite(amount)) {
      alert('Completá fecha, tipo y monto válido.');
      return;
    }

    if (editingId) {
      const idx = state.data.findIndex((x) => x.id === editingId);
      if (idx > -1) {
        state.data[idx] = { ...state.data[idx], date, type, amount, category, note };
      }
    } else {
      state.data.push({
        id: crypto.randomUUID(),
        date,
        type,
        amount,
        category,
        note,
      });
    }

    utils.save(state.data);
    modalFin.close();
    FinanzasApp.refresh();
  }

  function eliminar(id) {
    if (!confirm('¿Borrar este movimiento?')) return;
    state.data = (state.data || []).filter((x) => x.id !== id);
    utils.save(state.data);
    FinanzasApp.refresh();
  }

  function initTradingModal() {
    const modalTrade = utils.$('modalTrade');
    const btnAddTrade = utils.$('btnAddTrade');
    const btnSaveTrade = utils.$('btnSaveTrade');

    if (!modalTrade || !btnAddTrade || !btnSaveTrade) return;

    btnAddTrade.onclick = () => {
      utils.$('tradeDate').value = utils.toISO(new Date());
      utils.$('tradeTicker').value = '';
      utils.$('tradeTime').value = '';
      utils.$('tradeType').value = 'buy';
      utils.$('tradeTicket').value = '';
      utils.$('tradeEntry').value = '';
      utils.$('tradeSL').value = '';
      utils.$('tradeTP').value = '';
      utils.$('tradeProfit').value = '';
      modalTrade.showModal();
    };

    btnSaveTrade.onclick = (ev) => {
      ev.preventDefault();

      const date = utils.$('tradeDate').value;
      const profit = parseFloat(utils.$('tradeProfit').value);

      if (!date || !isFinite(profit)) {
        alert('Completá fecha y profit válido.');
        return;
      }

      state.data.push({
        id: crypto.randomUUID(),
        date,
        type: profit >= 0 ? 'ingreso' : 'egreso',
        amount: Math.abs(profit),
        category: 'Trades',
        note: `Trade ${utils.$('tradeTicker').value} (${utils
          .$(
            'tradeType',
          )
          .value.toUpperCase()}) — Ticket ${utils.$('tradeTicket').value} — Entry ${
          utils.$('tradeEntry').value
        } — SL ${utils.$('tradeSL').value} — TP ${utils.$('tradeTP').value}`,
      });

      utils.save(state.data);
      modalTrade.close();
      FinanzasApp.refresh();
    };
  }

  function initModals() {
    crearModalMovimientos();
    initTradingModal();
  }

  FinanzasApp.modals = {
    initModals,
    abrirModalAlta,
    abrirModalEdicion,
    eliminar,
  };

  global.FinanzasApp = FinanzasApp;
})(window);
