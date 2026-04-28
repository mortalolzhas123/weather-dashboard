let map; 

async function getDashboardData() {
    const city = document.getElementById('cityInput').value;
    if (!city) return alert("Please enter a city name");

    document.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));

    try {
        const res = await fetch(`/weather?city=${city}`);
        const data = await res.json();

        if (data.error) {
            alert("City not found or server error.");
            return;
        }

        document.getElementById('city-name').innerText = `Weather in ${city}`;
        document.getElementById('w-temp').innerText = data.temp;
        document.getElementById('w-desc').innerText = data.description;
        document.getElementById('w-icon').src = data.icon;
        document.getElementById('w-feels').innerText = data.feels_like;
        document.getElementById('w-humidity').innerText = data.humidity;
        document.getElementById('w-wind').innerText = data.wind_speed;
        document.getElementById('w-pressure').innerText = data.pressure;
        document.getElementById('w-rain').innerText = data.rain_3h;
        document.getElementById('w-country').innerText = data.country_code;

        const lat = data.coordinates.lat;
        const lon = data.coordinates.lon;

        if (map) {
            map.setView([lat, lon], 13); 
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
        } else {
            map = L.map('map').setView([lat, lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        }
        L.marker([lat, lon]).addTo(map).bindPopup(city).openPopup();

        fetchNews(city);

        fetchFact();

    } catch (err) {
        console.error(err);
        alert("Failed to fetch data.");
    }
}

async function fetchNews(city) {
    const container = document.getElementById('news-container');
    container.innerHTML = "Loading news...";

    try {
        const res = await fetch(`/news?city=${city}`);
        const articles = await res.json();

        container.innerHTML = "";
        if (articles.length === 0) {
            container.innerHTML = "<p>No news found for this city.</p>";
            return;
        }

        articles.slice(0, 3).forEach(article => {
            const div = document.createElement('div');
            div.className = "news-item";
            div.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = "Error loading news.";
    }
}

async function fetchFact() {
    try {
        const res = await fetch('/fact');
        const data = await res.json();
        document.getElementById('fact-text').innerText = data.fact;
    } catch (err) {
        document.getElementById('fact-text').innerText = "Failed to load fact.";
    }
}