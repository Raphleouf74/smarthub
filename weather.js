// weather.js

// --- API Keys ---
const OPEN_WEATHER_KEY = '4245db2faa3c24f7686a7c7b85bedcc0';
const NEWS_KEY = '5a0f04aafa0c4627af2e1b92c69436b4';

// --- Elements ---
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const placeEl = document.getElementById('place');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const precipEl = document.getElementById('precip');
const forecastEl = document.getElementById('forecast');
const visual = document.getElementById('visual');
const newsList = document.getElementById('newsList');

const cityInput = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const locateBtn = document.getElementById('locateBtn');

let currentCity = 'Paris,FR';

// --- Horloge ---
function startClock() {
    const container = document.getElementById('localTime');
    let previousTime = "";

    function updateClock() {
        const now = new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        [...now].forEach((char, index) => {
            let span;
            if (container.children[index]) {
                span = container.children[index];
                if (span.textContent !== char) {
                    // Met à jour uniquement si le caractère a changé
                    span.textContent = char;
                    span.classList.remove('animate');
                    void span.offsetWidth; // reset animation
                    span.classList.add('animate');
                }
            } else {
                // Si le span n'existe pas encore, on le crée
                span = document.createElement('span');
                span.textContent = char;
                container.appendChild(span);
            }
        });

        previousTime = now;
    }

    updateClock();
    setInterval(updateClock, 1000);
}
startClock();



// --- Animation visuelle météo ---
function applyVisual(weatherMain) {
    visual.innerHTML = '';
    const m = weatherMain.toLowerCase();

    if (m.includes('clear') || m.includes('sun')) {
        visual.className = 'visual sunny';
        visual.innerHTML = '<div class="sun"></div>';
    } else if (m.includes('cloud')) {
        visual.className = 'visual cloudy';
        visual.innerHTML = '<div class="cloud c1"></div><div class="cloud c2"></div>';
    } else if (m.includes('rain') || m.includes('drizzle')) {
        visual.className = 'visual rainy';
        visual.innerHTML = '<div class="cloud c1"></div>';
        for (let i = 0; i < 12; i++) {
            const r = document.createElement('div');
            r.className = 'raindrop';
            r.style.left = (5 + i * 7) + '%';
            r.style.animationDelay = (Math.random() * 0.6) + 's';
            visual.appendChild(r);
        }
    } else if (m.includes('thunder') || m.includes('storm')) {
        visual.className = 'visual storm';
        visual.innerHTML = '<div class="flash"></div><div class="cloud c1"></div>';
    } else {
        visual.className = 'visual sunny';
        visual.innerHTML = '<div class="sun"></div>';
    }
}

// --- Prévisions ---
function renderForecast(daily) {
    forecastEl.innerHTML = '';
    daily.slice(1, 6).forEach(d => {
        const dt = new Date(d.dt * 1000);
        const day = dt.toLocaleDateString('fr-FR', { weekday: 'short' });
        forecastEl.innerHTML += `
            <div class="dayCard">
                <div>${day}</div>
                <div>${Math.round(d.temp.day)}°C</div>
                <div style="font-size:12px;color:#bfeaff">${d.weather[0].main}</div>
            </div>
        `;
    });
}

// --- Récupération météo ---
async function fetchWeather(lat, lon, nameHint) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&exclude=minutely,hourly,alerts&appid=${OPEN_WEATHER_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Météo non disponible');

        const data = await res.json();
        const cur = data.current;

        tempEl.textContent = `${Math.round(cur.temp)}°C`;
        descEl.textContent = cur.weather[0].description;
        placeEl.textContent = nameHint || `${data.lat.toFixed(2)},${data.lon.toFixed(2)}`;
        humidityEl.textContent = cur.humidity;
        windEl.textContent = (cur.wind_speed * 3.6).toFixed(1);
        precipEl.textContent = cur.rain?.['1h'] || cur.snow?.['1h'] || 0;

        renderForecast(data.daily || []);
        applyVisual(cur.weather[0].main);
        fetchNews(cur.weather[0].main);

    } catch (err) {
        console.error(err);
        useDummy();
    }
}

// --- Récupération coordonnées ville ---
async function fetchCityAndWeather(city) {
    try {
        const geo = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPEN_WEATHER_KEY}`;
        const gres = await fetch(geo);
        if (!gres.ok) throw new Error('Ville non trouvée');

        const j = await gres.json();
        if (!j[0]) throw new Error('Ville introuvable');

        const loc = j[0];
        currentCity = `${loc.name}, ${loc.country}`;
        fetchWeather(loc.lat, loc.lon, currentCity);

    } catch (e) {
        console.warn(e);
        alert('Recherche échouée : ' + (e.message || e));
        useDummy();
    }
}

// --- Géolocalisation ---
function tryGeolocate() {
    if (!navigator.geolocation) {
        alert('Géolocalisation non supportée');
        fetchCityAndWeather(currentCity);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        p => fetchWeather(p.coords.latitude, p.coords.longitude, 'Ma position'),
        () => fetchCityAndWeather(currentCity)
    );
}

// --- Actus ---
async function fetchNews(topic) {
    newsList.innerHTML = '<li>Chargement des actualités…</li>';
    try {
        const q = encodeURIComponent(topic || 'actualité');
        const url = `https://newsapi.org/v2/top-headlines?language=fr&pageSize=6&q=${q}&apiKey=${NEWS_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erreur news');

        const j = await res.json();
        newsList.innerHTML = '';
        (j.articles || []).forEach(a => {
            newsList.innerHTML += `<li><strong>${a.source.name}</strong> — <a href="${a.url}" target="_blank" rel="noopener">${a.title}</a></li>`;
        });
        if ((j.articles || []).length === 0) {
            newsList.innerHTML = '<li>Aucune actualité pertinente.</li>';
        }
    } catch (e) {
        console.warn(e);
        newsList.innerHTML = `<li>Impossible de récupérer les actus (${e.message})</li>`;
    }
}

// --- Dummy ---
function useDummy() {
    tempEl.textContent = '-°C';
    descEl.textContent = '-';
    placeEl.textContent = currentCity;
    humidityEl.textContent = '-';
    windEl.textContent = '-';
    precipEl.textContent = '-';
    forecastEl.innerHTML = '';
    ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].forEach(d => {
        forecastEl.innerHTML += `
            <div class="dayCard">
                <div>${d}</div>
                <div>-°C</div>
                <div style="font-size:12px;color:#bfeaff">-</div>
            </div>
        `;
    });
    applyVisual('Clear');
}

// --- Events ---
searchBtn.addEventListener('click', () => fetchCityAndWeather(cityInput.value || currentCity));
cityInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchCityAndWeather(cityInput.value || currentCity); });
locateBtn.addEventListener('click', tryGeolocate);

// --- Initialisation ---
tryGeolocate();
