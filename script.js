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
      loginPanel?.classList.add("hidden");
      registerPanel?.classList.add("hidden");
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
    button.addEventListener("click", (e) => {
      e.preventDefault();
      filtrarSucursales();
    });
  })();



  /************************************
   *  6. FORMULARIO CONTACTO – VALIDACIÓN + MODAL ÉXITO
   ************************************/
  (function contactFormValidation() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const asuntoSelect = form.querySelector(".contact-select");
    const perfilRadios = form.querySelectorAll('input[name="perfil"]');

    const successModal = document.getElementById("contact-success-modal");
    const successClose = document.getElementById("contact-success-close-btn");

    form.addEventListener("submit", (e) => {
      let valid = true;

      if (!asuntoSelect.value.trim()) {
        asuntoSelect.classList.add("input-error");
        valid = false;
      } else {
        asuntoSelect.classList.remove("input-error");
      }

      const perfilSeleccionado = Array.from(perfilRadios).some(
        (radio) => radio.checked
      );
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

      e.preventDefault();

      if (successModal && successClose) {
        successModal.classList.remove("hidden");
        successClose.addEventListener(
          "click",
          () => {
            successModal.classList.add("hidden");
          },
          { once: true }
        );
      } else {
        alert("Mensaje enviado. Pronto nos pondremos en contacto contigo.");
      }

      form.reset();
    });
  })();



  /************************************
   *  7. AUTENTICACIÓN – USUARIOS + SESIÓN (localStorage)
   ************************************/
  (function userAuthStorage() {
    const USERS_KEY = "af_users";
    const SESSION_KEY = "af_session";

    const registerForm = document.querySelector("#auth-register .auth-form");
    const loginForm = document.querySelector("#auth-login .auth-form");

    // Modal de éxito REGISTRO (debes tenerlo en tu HTML)
    const registerSuccessModal = document.getElementById("register-success-modal");
    const registerSuccessClose = document.getElementById("register-success-close-btn");

    // Modal de éxito LOGIN (añádelo si aún no lo tienes)
    const loginSuccessModal = document.getElementById("login-success-modal");
    const loginSuccessClose = document.getElementById("login-success-close-btn");

    function loadUsers() {
      try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error("Error leyendo usuarios de localStorage", err);
        return [];
      }
    }

    function saveUsers(users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function createSession(user) {
      const session = {
        logged: true,
        nombre: user.nombre,
        correo: user.correo,
        createdAt: Date.now(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function goToDashboard() {
      window.location.href = "dashboard.html";
    }

    // ---------- REGISTRO ----------
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombreInput = registerForm.querySelector('input[type="text"]');
        const correoInput = registerForm.querySelector('input[type="email"]');
        const passwordInputs = registerForm.querySelectorAll('input[type="password"]');

        const nombre = nombreInput?.value.trim();
        const correo = correoInput?.value.trim();
        const password = passwordInputs[0]?.value.trim();
        const confirmPassword = passwordInputs[1]?.value.trim();

        if (!nombre || !correo || !password || !confirmPassword) {
          alert("Por favor completa todos los campos del registro.");
          return;
        }

        if (password.length < 8) {
          alert("La contraseña debe tener al menos 8 caracteres.");
          return;
        }

        if (password !== confirmPassword) {
          alert("Las contraseñas no coinciden.");
          return;
        }

        const users = loadUsers();
        const emailExists = users.some((u) => u.correo === correo);

        if (emailExists) {
          alert("Ya existe un usuario registrado con ese correo.");
          return;
        }

        const newUser = {
          id: Date.now(),
          nombre,
          correo,
          password,
        };

        users.push(newUser);
        saveUsers(users);

        // Crear sesión inmediatamente
        createSession(newUser);

        // Mostrar modal de éxito y redirigir al dashboard al hacer clic
        if (registerSuccessModal && registerSuccessClose) {
          registerSuccessModal.classList.remove("hidden");
          registerSuccessClose.addEventListener(
            "click",
            () => {
              registerSuccessModal.classList.add("hidden");
              goToDashboard();
            },
            { once: true }
          );
        } else {
          // Fallback: sin modal, redirige directo
          goToDashboard();
        }

        registerForm.reset();
      });
    }

    // ---------- LOGIN ----------
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const correoInput = loginForm.querySelector('input[type="email"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');

        const correo = correoInput?.value.trim();
        const password = passwordInput?.value.trim();

        if (!correo || !password) {
          alert("Por favor ingresa tu correo y contraseña.");
          return;
        }

        const users = loadUsers();
        const user = users.find(
          (u) => u.correo === correo && u.password === password
        );

        if (!user) {
          alert("Correo o contraseña incorrectos.");
          return;
        }

        createSession(user);

        // Mostrar modal de éxito de login y redirigir al dashboard al hacer clic
        if (loginSuccessModal && loginSuccessClose) {
          loginSuccessModal.classList.remove("hidden");
          loginSuccessClose.addEventListener(
            "click",
            () => {
              loginSuccessModal.classList.add("hidden");
              goToDashboard();
            },
            { once: true }
          );
        } else {
          // Fallback: sin modal, redirige directo
          goToDashboard();
        }
      });
    }
  })();

});
