(function () {
  const overlay = document.getElementById("auth-overlay");
  if (!overlay) return;
  const loginPanel = document.getElementById("auth-login");
  const registerPanel = document.getElementById("auth-register");

  function openAuth(type = "login") {
    overlay.classList.remove("hidden");

    if (type === "register") {
      if (loginPanel) loginPanel.classList.add("hidden");
      if (registerPanel) registerPanel.classList.remove("hidden");
    } else {
      if (registerPanel) registerPanel.classList.add("hidden");
      if (loginPanel) loginPanel.classList.remove("hidden");
    }

    document.body.style.overflow = "hidden";
  }

  function closeAuth() {
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open-auth]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-open-auth") || "login";
      openAuth(type);
    });
  });

  document.querySelectorAll("[data-switch-auth]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-switch-auth");
      openAuth(type);
    });
  });

  document.querySelectorAll("[data-close-auth]").forEach((btn) => {
    btn.addEventListener("click", closeAuth);
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeAuth();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeAuth();
    }
  });
})();