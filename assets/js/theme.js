/* v1.5 edit — Cisne Blanco WEB
   Simplificado: solo temas Auto y NavyIce
   Mantiene compatibilidad con localStorage["theme"]
*/

(function () {
  const THEMES = ["auto", "NavyIce"];
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
    if (value === "NavyIce") {
      root.setAttribute("data-theme", "NavyIce");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem(storageKey, value);
  }
})();
