/* v1.5.1 — Cisne Blanco WEB
   Simplificado: solo temas Auto y NavyIce (coherente con CSS [data-theme="navy-ice"])
   Mantiene compatibilidad con localStorage["theme"]
*/

(function () {
  const THEMES = ["auto", "navy-ice"]; // corregido: minúsculas con guion
  const root = document.documentElement;
  const storageKey = "theme";

  // Leer tema guardado o usar auto por defecto
  const current = localStorage.getItem(storageKey) || "auto";
  applyTheme(current);

  // Exponer función global por si se requiere
  window.CBTheme = {
    apply: applyTheme,
    themes: THEMES,
  };

  function applyTheme(value) {
    if (value === "navy-ice") {
      root.setAttribute("data-theme", "navy-ice"); // corregido: coincide con CSS
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem(storageKey, value);
  }
})();
