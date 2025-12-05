/********************************************
 *  SISTEMA GLOBAL DE UI – AIRFITNESS
 ********************************************/

document.addEventListener("DOMContentLoaded", () => {

  /************************************
   *  1. SISTEMA DE MODALES AUTH
   ************************************/
  (function authSystem() {
    const overlay = document.getElementById("auth-overlay");
    if (!overlay) return;

    const loginPanel = document.getElementById("auth-login");
    const registerPanel = document.getElementById("auth-register");

    const openAuth = (type = "login") => {
      overlay.classList.remove("hidden");

      if (type === "register") {
        loginPanel?.classList.add("hidden");
        registerPanel?.classList.remove("hidden");
      } else {
        registerPanel?.classList.add("hidden");
        loginPanel?.classList.remove("hidden");
      }

      document.body.style.overflow = "hidden";
    };

    const closeAuth = () => {
      overlay.classList.add("hidden");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-open-auth]").forEach((btn) => {
      btn.addEventListener("click", () =>
        openAuth(btn.dataset.openAuth || "login")
      );
    });

    document.querySelectorAll("[data-switch-auth]").forEach((btn) => {
      btn.addEventListener("click", () => openAuth(btn.dataset.switchAuth));
    });

    document.querySelectorAll("[data-close-auth]").forEach((btn) => {
      btn.addEventListener("click", closeAuth);
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAuth();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        closeAuth();
      }
    });
  })();



  /************************************
   *  2. SECUENCIA – RUTINAS
   ************************************/
  (function sequenceTags() {
    const tags = document.querySelectorAll(".sequence-tag");
    if (tags.length === 0) return;

    tags.forEach((tag) => {
      tag.addEventListener("click", () => {
        tags.forEach((t) => t.classList.remove("active"));
        tag.classList.add("active");
      });
    });
  })();



  /************************************
   *  3. ANIMACIONES – RUTINAS
   ************************************/
  (function routineAnimations() {
    const hero = document.querySelector(".rutina-hero");
    const cards = document.querySelectorAll(".exercise-card");
    if (!hero && cards.length === 0) return;

    document.body.classList.add("enable-animations");

    const elements = [hero, ...cards].filter(Boolean);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      elements.forEach((el) => observer.observe(el));
    } else {
      elements.forEach((el) => el.classList.add("is-visible"));
    }
  })();



  /************************************
   *  4. MENÚ “MÁS” DEL HEADER
   ************************************/
  (function headerMoreMenu() {
    const moreBtn = document.querySelector(".nav-more-btn");
    const moreMenu = document.querySelector(".nav-more-menu");

    if (!moreBtn || !moreMenu) return;

    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      moreMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!moreMenu.contains(e.target) && !moreBtn.contains(e.target)) {
        moreMenu.classList.remove("show");
      }
    });
  })();



  /************************************
   *  5. BUSCADOR – SUCURSALES
   ************************************/
  (function branchSearch() {
    const input = document.querySelector(".branch-search-input");
    const select = document.querySelector(".branch-search-select");
    const button = document.querySelector(".branch-search-form button");
    const cards = document.querySelectorAll(".sucursal-card");

    if (!input || !select || !button || cards.length === 0) return;

    function filtrarSucursales() {
      const texto = input.value.toLowerCase().trim();
      const tipo = select.value.trim();

      cards.forEach((card) => {
        const contenido = card.innerText.toLowerCase();
        const tipoCard = card.dataset.tipo || "";

        const coincideTexto = contenido.includes(texto);
        const coincideTipo = tipo === "" || tipo === tipoCard;

        card.style.display = coincideTexto && coincideTipo ? "" : "none";
      });
    }

    input.addEventListener("input", filtrarSucursales);
    select.addEventListener("change", filtrarSucursales);
    button.addEventListener("click", filtrarSucursales);
  })();



  /************************************
   *  6. FORMULARIO CONTACTO – VALIDACIÓN + MODAL DE ÉXITO
   ************************************/
  (function contactFormValidation() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const asuntoSelect = form.querySelector(".contact-select");
    const perfilRadios = form.querySelectorAll('input[name="perfil"]');
    const modal = document.getElementById("contact-success-modal");
    const modalClose = document.getElementById("success-close-btn");

    form.addEventListener("submit", (e) => {
      let valid = true;

      if (!asuntoSelect.value.trim()) {
        asuntoSelect.classList.add("input-error");
        valid = false;
      } else {
        asuntoSelect.classList.remove("input-error");
      }

      const perfilSeleccionado = Array.from(perfilRadios).some(r => r.checked);
      const perfilFieldset = form.querySelector(".contact-fieldset");

      if (!perfilSeleccionado) {
        perfilFieldset?.classList.add("input-error");
        valid = false;
      } else {
        perfilFieldset?.classList.remove("input-error");
      }

      if (!valid) {
        e.preventDefault();
        alert("Por favor completa 'Asunto de consulta' y '¿Cuál es tu perfil?'");
        return;
      }

      /************************************
       *  SHOW SUCCESS MODAL
       ************************************/
      e.preventDefault();  // Evita recarga para mostrar modal
      modal.classList.remove("hidden");

      modalClose.addEventListener("click", () => {
        modal.classList.add("hidden");
        form.reset();
      });
    });
  })();

});
