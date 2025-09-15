let movies = [];

document.addEventListener("DOMContentLoaded", async function() {
  const res = await fetch("https://japceibal.github.io/japflix_api/movies-data.json");
  movies = await res.json();
});

function getStars(vote) {
  let stars = Math.round(vote / 2);
  let html = "";
  for (let i = 1; i <= 5; i++) html += '<span class="fa fa-star' + (i <= stars ? ' checked' : '') + '"></span>';
  return html;
}

function showMovieDetails(movie) {
  const old = document.getElementById("movieDetail");
  if (old) old.remove();

  
  const div = document.createElement("div");
  div.id = "movieDetail";
  div.style.cssText = "position:fixed;top:10%;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:20px;border-radius:10px;max-width:400px;z-index:1000;";
  div.innerHTML = `
    <button id="closeDetail" style="float:right;">Cerrar</button>
    <h3>${movie.title}</h3>
    <p>${movie.overview}</p>
    <p><strong>Géneros:</strong> ${movie.genres.join(", ")}</p>
    <p>Año: ${movie.release_date.split("-")[0]}</p>
    <p>Duración: ${movie.runtime} min</p>
    <p>Presupuesto: $${movie.budget.toLocaleString()}</p>
    <p>Ganancias: $${movie.revenue.toLocaleString()}</p>
  `;
  document.body.appendChild(div);

  
  document.getElementById("closeDetail").addEventListener("click", function() {
    div.remove();
  });
}

document.getElementById("btnBuscar").addEventListener("click", function() {
  const q = document.getElementById("inputBuscar").value.toLowerCase().trim();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  if (!q) return;

  movies.forEach(function(m) {
    const title = m.title.toLowerCase();
    const tagline = (m.tagline || "").toLowerCase();
    const overview = (m.overview || "").toLowerCase();
    const genres = m.genres.join(" ").toLowerCase();

    if (title.indexOf(q) !== -1 || tagline.indexOf(q) !== -1 || overview.indexOf(q) !== -1 || genres.indexOf(q) !== -1) {
      const item = document.createElement("div");
      item.className = "list-group-item bg-dark text-white";
      item.style.cursor = "pointer";
      item.innerHTML = '<h5>' + m.title + '</h5><p><em>' + (m.tagline || "") + '</em></p><div>' + getStars(m.vote_average) + '</div>';
      item.addEventListener("click", function() { showMovieDetails(m); });
      lista.appendChild(item);
    }
  });
});
