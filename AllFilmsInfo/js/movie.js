document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const API_KEY = '94cdc79bc9522b0bc848d2e567d38ca9';
    const BASE_URL = "https://api.themoviedb.org/3";
    let sessionId = localStorage.getItem("tmdb_session_id");
    let accountId = localStorage.getItem("tmdb_account_id");
    let currentMovie = null;
    function showNotification(title) {
        const notification = document.createElement("div");
        notification.classList.add("notification", "hidden");
        notification.innerHTML = `
              <div class="notiglow"></div>
              <div class="notiborderglow"></div>
              <div class="notititle"><b>${title}</b></div>
              <i class="notibody">Cliquez sur la notification pour la cacher</i>
            `;
        notificationsContainer.prepend(notification);

        setTimeout(() => {
            // Force un reflow ici avant d'ajouter la classe
            void notification.offsetWidth;
            notification.classList.remove("hidden");
            notification.classList.add("show");
            updateNotificationPositions();
        }, 100);

        setTimeout(() => {
            notification.classList.remove("show");
            notification.classList.add("hidden");
            setTimeout(() => {
                notification.remove();
                updateNotificationPositions();
            }, 200);
        }, 5000);

        if (notificationsContainer.children.length > 3) {
            const lastNotification = notificationsContainer.children[3];
            lastNotification.classList.remove("show");
            lastNotification.classList.add("hidden");
            setTimeout(() => {
                lastNotification.remove();
                updateNotificationPositions();
            }, 300);
        }
        notification.addEventListener("click", (e) => {
            notification.classList.remove("show");
            notification.classList.add("hidden");
            setTimeout(() => {
                notification.remove();
                updateNotificationPositions();
            }, 100);
        });
    }
    async function loadMovie() {
        try {
            // Récupérer les données
            const [movie, credits, similar] = await Promise.all([
                fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`),
                fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`),
                fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=fr-FR`)
            ]).then(responses => Promise.all(responses.map(r => r.json())));

            currentMovie = movie; // ✅ Maintenant c'est correct

            // Injecter le HTML
            document.getElementById('movie-container').innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" id="MoviePoster" alt="${movie.title}">
                <div class="movie-header">
                    <div class="movie-info">
                        <div class="FilmStats">
                            <div id="ReleaseDate"><span>${movie.release_date.slice(0, 4)}</span></div>
                            <div id="Rating"><span><span class="material-symbols-outlined">star</span> ${movie.vote_average.toFixed(1)}/10</span></div>
                            <div id="MovieDuration"><span><span class="material-symbols-outlined">timer</span>${movie.runtime} min</span></div>
                        </div>
                        <div id="MovieSummary"><p>${movie.overview || 'Aucun résumé disponible.'}</p></div>
                        <div class="movie-actions">
                            <button id="add-favorite" class="action-btn"><span class="material-symbols-outlined">favorite</span> Ajouter aux favoris</button>
                            <button id="rate-movie" class="action-btn"><span class="material-symbols-outlined">star</span> Noter ce film</button>
                        </div>
                        <div id="rating-form" class="hidden">
                            <label for="rating-input">Votre note (0 à 10) :</label>
                            <input type="number" id="rating-input" min="0" max="10" step="0.5" />
                            <button id="submit-rating" class="action-btn">Valider</button>
                        </div>
                        <h3>Acteurs principaux</h3>
                        <div class="actors-grid">
                            ${credits.cast.slice(0, 6).map(actor => `
                                <div class="actor-card">
                                    <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path : '../icons/no_poster.png'}" alt="${actor.name}">
                                    <p>${actor.name}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <h2>Films similaires</h2>
                    <div class="similar-movies">
                        ${similar.results.slice(0, 4).map(movie => `
                            <a href="./movieindex.html?id=${movie.id}" class="similar-card">
                                <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
                                <p>${movie.title}</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;

            document.getElementById('MovieTitle').innerHTML = `<h1>${movie.title}</h1>`;

            // ✅ Ajouter les listeners après injection
            const favBtn = document.querySelector('#add-favorite');
            const rateBtn = document.querySelector("#rate-movie");
            const ratingForm = document.querySelector("#rating-form");
            const submitRating = document.querySelector("#submit-rating");
            const ratingInput = document.querySelector("#rating-input");

            favBtn.addEventListener("click", addToFavorites);
            rateBtn.addEventListener("click", () => ratingForm.classList.toggle("hidden"));
            submitRating.addEventListener("click", submitRatingHandler);
            // Après avoir inséré le HTML et sélectionné favBtn :
            const isFav = await checkIfFavorite();
            updateFavButton(isFav);

        } catch (error) {
            console.error(error);
            document.getElementById('movie-container').innerHTML = `
                <div class="error">
                    <p>⚠️ Impossible de charger le film. <a href="../index.html">Retour à l'accueil</a></p>
                </div>
            `;
        }
    }

    async function addToFavorites() {
        if (!sessionId) {
            showNotification("Veuillez vous connecter à TMDb pour gérer les favoris.");
            return;
        }

        const isFav = document.querySelector('#add-favorite').classList.contains('favorite-active');
        const newStatus = !isFav;

        await fetch(`${BASE_URL}/account/${accountId}/favorite?api_key=${API_KEY}&session_id=${sessionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                media_type: "movie",
                media_id: currentMovie.id,
                favorite: newStatus
            })
        });

        updateFavButton(newStatus);
        showNotification(newStatus ? "Film ajouté aux favoris !" : "Film retiré des favoris !", );
    }


    async function submitRatingHandler() {
        if (!sessionId) {
            showNotification("Connectez-vous pour évaluer le film");
            return;
        }

        const value = parseFloat(document.querySelector("#rating-input").value);
        if (isNaN(value) || value < 0 || value > 10) {
            showNotification("Veuillez entrer une note entre 0 et 10.");
            return;
        }

        await fetch(`${BASE_URL}/movie/${currentMovie.id}/rating?api_key=${API_KEY}&session_id=${sessionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value })
        });

        showNotification(`Votre note (${value}/10) a été enregistrée.`);
        document.querySelector("#rating-form").classList.add("hidden");
    }

    async function checkIfFavorite() {
        if (!sessionId || !accountId) return false;

        const res = await fetch(`${BASE_URL}/account/${accountId}/favorite/movies?api_key=${API_KEY}&session_id=${sessionId}`);
        const data = await res.json();

        return data.results.some(fav => fav.id === currentMovie.id);
    }
    function updateFavButton(isFav) {
        const favBtn = document.querySelector('#add-favorite');
        if (isFav) {
            favBtn.innerHTML = `<span class="material-symbols-outlined">favorite</span> Retirer des favoris`;
            favBtn.classList.add('favorite-active');
        } else {
            favBtn.innerHTML = `<span class="material-symbols-outlined">favorite_border</span> Ajouter aux favoris`;
            favBtn.classList.remove('favorite-active');
        }
    }


    loadMovie();
});
