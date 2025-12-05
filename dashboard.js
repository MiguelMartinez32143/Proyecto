/********************************************
 * DASHBOARD PRIVADO – AIRFITNESS
 ********************************************/

document.addEventListener("DOMContentLoaded", () => {

  const SESSION_KEY = "af_session";
  const USERS_KEY = "af_users";

  const session = JSON.parse(localStorage.getItem(SESSION_KEY));

  // 1) Proteger acceso al dashboard
  if (!session || !session.logged) {
    window.location.href = "index.html";
    return;
  }

  // 2) Pintar datos del usuario
  document.getElementById("dashboard-username").textContent = session.nombre;
  document.getElementById("dashboard-name").textContent = session.nombre;
  document.getElementById("dashboard-email").textContent = session.correo;

  // 3) Botón cerrar sesión
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });

  // 4) Botón eliminar cuenta
  const deleteBtn = document.getElementById("delete-account-btn");
  deleteBtn.addEventListener("click", () => {

    const confirmDelete = confirm(
      "¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );

    if (!confirmDelete) return;

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const filtered = users.filter(u => u.correo !== session.correo);

    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    localStorage.removeItem(SESSION_KEY);

    alert("Tu cuenta ha sido eliminada.");
    window.location.href = "index.html";
  });

});
