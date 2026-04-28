const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

const WEATHER_API_KEY = '91a1c99d1625afb197a57c0b9c1744a6';
const NEWS_API_KEY = 'adec34e63acd4530a2b8284fa6adae5b';           


app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        const weatherData = {
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            coordinates: data.coord,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            wind_speed: data.wind.speed,
            country_code: data.sys.country,
            rain_3h: data.rain ? data.rain['3h'] || 0 : 0
        };

        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: "Could not retrieve weather data." });
    }
});

app.get('/news', async (req, res) => {
    const city = req.query.city;
    try {
        const url = `https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}&pageSize=3`;
        const response = await axios.get(url);
        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ error: "Could not retrieve news." });
    }
});

]app.get('/fact', async (req, res) => {
    try {
        const url = 'https://uselessfacts.jsph.pl/random.json?language=en';
        const response = await axios.get(url);
        res.json({ fact: response.data.text });
    } catch (error) {
        res.status(500).json({ error: "Could not retrieve fact." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});