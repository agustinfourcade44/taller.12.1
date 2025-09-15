let movies = [];

// Cargar las películas cuando la página inicia (pero no mostrarlas aún)
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("https://japceibal.github.io/japflix_api/movies-data.json");
  movies = await response.json();
});

// Función para mostrar estrellas según vote_average (sobre 10 → 5 estrellas)
function getStars(vote) {
  const stars = Math.round(vote / 2); // escala 0-10 → 0-5
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="fa fa-star ${i <= stars ? "checked" : ""}"></span>`;
  }
  return html;
}

// Evento buscar
document.getElementById("btnBuscar").addEventListener("click", () => {
  const query = document.getElementById("inputBuscar").value.toLowerCase().trim();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  if (query === "") return;

  const resultados = movies.filter(m =>
    m.title.toLowerCase().includes(query) ||
    m.tagline?.toLowerCase().includes(query) ||
    m.overview?.toLowerCase().includes(query) ||
    m.genres.join(" ").toLowerCase().includes(query)
  );

  resultados.forEach(movie => {
    const li = document.createElement("li");
    li.className = "list-group-item bg-dark text-white";
    li.style.cursor = "pointer";
    li.innerHTML = `
      <h5>${movie.title}</h5>
      <p><em>${movie.tagline || ""}</em></p>
      <div>${getStars(movie.vote_average)}</div>
    `;
    li.addEventListener("click", () => showMovieDetails(movie));
    lista.appendChild(li);
  });
});


function showMovieDetails(movie) {
 
  let offcanvas = document.getElementById("offcanvasMovie");
  if (!offcanvas) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="offcanvas offcanvas-top text-bg-dark" tabindex="-1" id="offcanvasMovie">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasTitle"></h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <p id="offcanvasOverview"></p>
          <p><strong>Géneros:</strong> <span id="offcanvasGenres"></span></p>
          <div class="dropdown mt-3 text-end">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
    Más información
  </button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><span class="dropdown-item">Año: <span id="infoYear"></span></span></li>
    <li><span class="dropdown-item">Duración: <span id="infoRuntime"></span> min</span></li>
    <li><span class="dropdown-item">Presupuesto: $<span id="infoBudget"></span></span></li>
    <li><span class="dropdown-item">Ganancias: $<span id="infoRevenue"></span></span></li>
  </ul>
</div>
        </div>
      </div>
    `);
    offcanvas = document.getElementById("offcanvasMovie");
  }

  
  document.getElementById("offcanvasTitle").textContent = movie.title;
  document.getElementById("offcanvasOverview").textContent = movie.overview;
  document.getElementById("offcanvasGenres").textContent = movie.genres.join(", ");
  document.getElementById("infoYear").textContent = movie.release_date.split("-")[0];
  document.getElementById("infoRuntime").textContent = movie.runtime;
  document.getElementById("infoBudget").textContent = movie.budget.toLocaleString();
  document.getElementById("infoRevenue").textContent = movie.revenue.toLocaleString();

  
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
  bsOffcanvas.show();
}
