
(function(){const t=["navy-ice","onyx-gold","ruby-silver"],e=document.documentElement,o=document.querySelector("#themeSelect"),r=localStorage.getItem("cb_theme")||t[0];e.setAttribute("data-theme",r),o&&(o.value=r);function n(t){e.setAttribute("data-theme",t),localStorage.setItem("cb_theme",t)}o&&o.addEventListener("change",(t=>n(t.target.value))),window.CBTheme={apply:n,themes:t}})();
