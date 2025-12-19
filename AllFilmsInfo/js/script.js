document.addEventListener('DOMContentLoaded', function() {
    const selectFilmCategoryButton = document.getElementById('SelectFilmCategory');
    const filmCategoryList = document.getElementById('FilmCategoryModal');
    const header = document.querySelector('header');
    const searchContainer = document.querySelector('.search-container');
    const originalHeaderHeight = header.offsetHeight;

    document.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            searchContainer.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            searchContainer.classList.remove('scrolled');
        }
    });

    selectFilmCategoryButton.addEventListener('click', () => {
        filmCategoryList.classList.toggle('show');
    });
    filmCategoryList.addEventListener('click', () => {
        filmCategoryList.classList.toggle('show');
    });



    async function checkSiteVersion() {
        console.log("Checking site version...");
        try {
            const res = await fetch('../version.json', { cache: 'no-cache' });
            const { version: latest } = await res.json();
            const current = localStorage.getItem('siteVersion');
            console.log("Checking version.json...");
            if (current && current !== latest) {
                console.log("Check code: Pass");
                showUpdateNotification();
            }
            localStorage.setItem('siteVersion', latest);
        } catch { console.log("Error checking version.json..."); }
    }

    function showUpdateNotification() {
        const notif = document.createElement('div');
        notif.className = 'update-notification';
        notif.innerHTML = `
        <p>Une nouvelle version du site est en ligne, cliquez sur le bouton pour recharger la page et la mettre à jour</p>
        <button onclick="location.reload()">Recharger la page</button>
    `;
        document.body.appendChild(notif);
    }
    window.addEventListener('DOMContentLoaded', checkSiteVersion);

    async function loadUserProfile() {
        if (!sessionId) return;

        const res = await fetch(`${BASE_URL}/account?api_key=${API_KEY}&session_id=${sessionId}`);
        const user = await res.json();

        accountId = user.id;
        localStorage.setItem("tmdb_account_id", accountId);

        document.getElementById("profile-username").textContent = user.username;
        document.getElementById("profile-avatar").src = user.avatar.tmdb ? avatar_path ? `https://image.tmdb.org/t/p/w45${user.avatar.tmdb.avatar_path}` : "icons/default-avatar.png" : "icons/default-avatar.png";

        document.getElementById("login-tmdb").classList.add("hidden");
        document.getElementById("logout-tmdb").classList.remove("hidden");
        document.getElementById("view-favorites").classList.remove("hidden");
    }
    loadUserProfile();

});

const API_KEY = '94cdc79bc9522b0bc848d2e567d38ca9'; // Mets ta clé TMDb ici
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

async function getMovieDetails(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`);
    return res.json();
}

async function getMovieCredits(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=fr-FR`);
    return res.json();
}

async function getMovieReviews(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}&language=fr-FR`);
    return res.json();
}

async function getSimilarMovies(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=fr-FR`);
    return res.json();
}
const COMPANIES = {
    marvel: 420,
    pixar: 3,
    disney: 2,
    netflix: 213,
    lucasfilm: 1,
    warnerbros: 174,
    universal: 33,
    paramount: 4,
    sony: 34,
    twentiethcentury: 25,
    dreamworks: 521,
    lionsgate: 1632
};
const GENRES = {
    enfants: 10751,
    animation: 16,
    horreur: 27,
    comedie: 35,
    western: 37,
    romance: 10749,
    action: 28,
    aventure: 12,
    sciencefiction: 878,
    drame: 18
};



const moviesContainer = document.getElementById('movies-container');
const categoryButtons = document.querySelectorAll('#FilmCategoryList li');
const modal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeModalBtn = document.querySelector('.close');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
// Charger les films selon la catégorie
async function fetchMovies(category = 'marvel') {
    const companyId = COMPANIES[category];
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=${companyId}&language=fr-FR&sort_by=release_date.desc`);
    const data = await res.json();

    // On cache le placeholder et on affiche les films dans la grille principale
    displayMovies(data.results, moviesContainer, true);
}

async function fetchMoviesByGenre(genreId, append = false) {
    if (!append) currentPage = 1;

    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&sort_by=popularity.desc&page=${currentPage}`);
    const data = await res.json();

    displayMovies(data.results, moviesContainer, true, append);

    // Afficher ou cacher le bouton "Voir plus"
    const loadMoreBtn = document.getElementById('load-more');
    if (currentPage < data.total_pages) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}


// Rechercher un film par titre
async function searchMovies(query) {
    if (!query.trim()) return;
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    // Idem : résultats remplacent le placeholder et s’affichent dans la grille
    displayMovies(data.results, moviesContainer, true);
}

// Par défaut, on affiche seulement le placeholder (pas de films tant qu’on n’a pas choisi ou recherché)
const moviesPlaceholder = document.getElementById('movies-placeholder');
moviesContainer.classList.add('hidden');

// Chargement des sections de l’accueil
async function loadHomepage() {
    const trendingRes = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`);
    const trending = await trendingRes.json();
    displayMovies(trending.results.slice(0, 6), document.getElementById('homepage-trending'));

    const newRes = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1`);
    const newMovies = await newRes.json();
    displayMovies(newMovies.results.slice(0, 6), document.getElementById('homepage-new'));

    const popularRes = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
    const popular = await popularRes.json();
    displayMovies(popular.results.slice(0, 6), document.getElementById('homepage-recommended'));
}

// Fonction unique d’affichage (utilisée pour toutes les sections)
// Nouvelle version (juste le clic qui redirige)
function displayMovies(movies, container = moviesContainer, hidePlaceholder = false, append = false) {
    if (hidePlaceholder) {
        moviesPlaceholder.style.display = 'none';
        moviesContainer.classList.remove('hidden');
    }

    if (!append) container.innerHTML = ''; // ✅ Si on charge une nouvelle catégorie, on vide

    if (!movies.length && !append) {
        container.innerHTML = '<p>Aucun film trouvé.</p>';
        return;
    }

    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <a href="./movies/movieindex.html?id=${movie.id}">
                <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'icons/no_poster.png'}" alt="${movie.title}">
                <div class="movie-title">${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : ''})</div>
            </a>
        `;
        container.appendChild(card);
    });
}


// Clic sur une catégorie
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        moviesContainer.innerHTML = Array(6).fill('<div class="movie-card skeleton"></div>').join('');
        fetchMovies(category);
    });
});

// Clic sur le bouton recherche
// Recherche
searchBtn.addEventListener('click', () => searchMovies(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies(searchInput.value);
});

// Catégories
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filmCategoryList = document.getElementById('FilmCategoryList');
        const header = document.querySelector('header');
        filmCategoryList.classList.remove('show');
        header.classList.add('scrolled');
        fetchMovies(btn.getAttribute('data-category'));
    });
});

const menubtn = document.getElementById('menu');
const loginbtn = document.getElementById('login-tmdb');
const profilebtn = document.getElementById('profile-btn');
const backbtn = document.getElementById('back-btn');
const themebtn = document.querySelector('.theme-toggle-btn');

loginbtn.classList.remove('shown');
profilebtn.classList.remove('shown');
backbtn.classList.remove('shown');
themebtn.classList.remove('shown');
menubtn.addEventListener('click', () => {
    loginbtn.classList.toggle('shown');
    profilebtn.classList.toggle('shown');
    backbtn.classList.toggle('shown');
    themebtn.classList.toggle('shown');
});

const profileBtn = document.getElementById("profile-btn");
const profileMenu = document.getElementById("profile-menu");

profileBtn.addEventListener("click", () => {
    profileMenu.classList.toggle("hidden");
});
profileMenu.addEventListener("click", () => {
    profileMenu.classList.toggle("hidden");
});


let sessionId = localStorage.getItem('tmdb_session_id');
let accountId = localStorage.getItem("tmdb_account_id");

document.getElementById("login-tmdb").addEventListener("click", async() => {
    const res = await fetch(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`);
    const data = await res.json();
    const requestToken = data.request_token;

    window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${window.location.origin}/AllFilmsInfo/auth.html?request_token=${requestToken}`;
});

async function getAccountDetails() {
    if (!sessionId) return;

    const res = await fetch(`${BASE_URL}/account?api_key=${API_KEY}&session_id=${sessionId}`);
    const account = await res.json();
    console.log("Utilisateur connecté :", account);
}
getAccountDetails();
async function addToFavorites(movieId) {
    const account = await fetch(`${BASE_URL}/account?api_key=${API_KEY}&session_id=${sessionId}`).then(r => r.json());

    await fetch(`${BASE_URL}/account/${account.id}/favorite?api_key=${API_KEY}&session_id=${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            media_type: "movie",
            media_id: movieId,
            favorite: true
        })
    });

    alert("Ajouté aux favoris !");
}
async function rateMovie(movieId, rating) {
    await fetch(`${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&session_id=${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: rating })
    });
    alert("Note ajoutée !");
}

document.getElementById("logout-tmdb").addEventListener("click", () => {
    localStorage.removeItem("tmdb_session_id");
    localStorage.removeItem("tmdb_account_id");
    sessionId = null;
    accountId = null;
    window.location.reload();
});
document.getElementById("view-favorites").addEventListener("click", async() => {
    if (!sessionId || !accountId) {
        alert("Veuillez vous connecter pour voir vos favoris.");
        return;
    }

    const res = await fetch(`${BASE_URL}/account/${accountId}/favorite/movies?api_key=${API_KEY}&session_id=${sessionId}`);
    const data = await res.json();

    displayFavorites(data.results);
});

function displayFavorites(movies) {
    const container = document.getElementById('movies-container');
    const placeholder = document.getElementById('movies-placeholder');
    placeholder.style.display = 'none';
    container.classList.remove('hidden');

    container.innerHTML = `
        <section id="favorites-section">
            <h2>Mes Favoris</h2>
            <div class="favorites-grid"></div>
        </section>
    `;

    const grid = document.querySelector('.favorites-grid');

    if (!movies.length) {
        grid.innerHTML = `<p>Aucun film dans vos favoris.</p>`;
    } else {
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('movie-card');
            card.innerHTML = `
                <a href="./movies/movieindex.html?id=${movie.id}">
                    <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'icons/no_poster.png'}" alt="${movie.title}">
                    <div class="movie-title">${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : ''})</div>
                </a>
            `;
            grid.appendChild(card);
        });
    }

    // Ajouter le bouton retour
    const backButton = document.createElement('button');
    backButton.id = 'back-home';
    backButton.classList.add('action-btn');
    backButton.innerHTML = '<span class="material-symbols-rounded"> arrow_back_ios </span> Retour';
    container.appendChild(backButton);

    backButton.addEventListener('click', () => {
        location.href = 'index.html';
    });
}
let currentPage = 1;
let currentCategory = null; // On la met à null par défaut
let currentGenre = null;


async function fetchMovies(category = 'marvel', append = false) {
    if (category !== currentCategory && !append) {
        currentPage = 1;
        currentCategory = category;
    }

    const companyId = COMPANIES[category];
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=${companyId}&language=fr-FR&sort_by=release_date.desc&page=${currentPage}`);
    const data = await res.json();

    displayMovies(data.results, moviesContainer, true, append);

    const loadMoreBtn = document.getElementById('load-more');
    if (currentPage < data.total_pages) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}


// Bouton "Voir plus"
document.getElementById('load-more').addEventListener('click', (e) => {
    e.preventDefault();
    currentPage++;

    if (currentCategory) {
        fetchMovies(currentCategory, true);
    } else if (currentGenre) {
        fetchMoviesByGenre(currentGenre, true);
    }
});


// Quand tu cliques sur une catégorie

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        currentCategory = category;
        currentGenre = null;
        currentPage = 1;

        // Cache la liste, applique le style header
        document.getElementById('FilmCategoryList').classList.remove('show');
        document.querySelector('header').classList.add('scrolled');

        // Skeleton loader avant chargement
        moviesContainer.innerHTML = Array(6).fill('<div class="movie-card skeleton"></div>').join('');

        fetchMovies(category); // ✅ Utilise la bonne fonction
    });
});