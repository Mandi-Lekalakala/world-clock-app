// ===USER'S LOCAL TIME===//

function tickClock() {
  const userTime = document.getElementById("user-time");
  const userDate = document.getElementById("user-date");
  const now = moment();
  userTime.innerHTML = now.format("HH:mm:ss");
  userDate.innerHTML = now.format("dddd, D MMMM YYYY");

  setInterval(function () {
    tickClock();
  }, 1000);
}

function updateUserCity(cityName) {
  const userCityName = document.getElementById("user-city");

  const abbr = moment.tz(moment.tz.guess()).format("z");

  userCityName.innerHTML = `${cityName} · ${abbr}`;
}

function handleGeolocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const cityName = data.city || data.locality;
      updateUserCity(cityName);
    });
}

navigator.geolocation.getCurrentPosition(handleGeolocation);

//===FEATURED CITY TIME CARDS===//

function addRemoveButton(card) {
  const removeBtn = card.querySelector(".remove-card-btn");
  removeBtn.addEventListener("click", function () {
    card.remove();
  });
}

function updateAllCards() {
  const cityCards = document.querySelectorAll(".city-clock-card");

  cityCards.forEach(function (card) {
    const zone = card.dataset.zone;

    const timeDisplay = card.querySelector(".city-card-time");
    const time = moment().tz(zone).format("HH:mm:ss");
    timeDisplay.innerHTML = time;

    const offsetDisplay = card.querySelector(".city-gmt");
    const offset = moment().tz(zone).format("Z");
    offsetDisplay.innerHTML = `GMT ${offset}`;

    const nameDisplay = card.querySelector(".city-card-name");
    const cityName = zone.split("/")[1].replace("_", " ");
    const abbr = moment().tz(zone).format("z");
    nameDisplay.innerHTML = `${cityName} · ${abbr}`;

    addRemoveButton(card);
  });

  setInterval(function () {
    updateAllCards();
  }, 1000);
}

updateAllCards();
tickClock();

// ===SEARCH CITY FUNCTIONALITY===//
// fetches info from cities.json and puts it into an ARRAY  //
let allCities = [];

function loadCities() {
  fetch("cities.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      allCities = data;
    });
}

function addCityCard(cityName, timezone) {
  const cityGrid = document.querySelector(".city-clock-grid");

  const time = moment().tz(timezone).format("HH:mm:ss");
  const offset = moment().tz(timezone).format("Z");
  const abbr = moment().tz(timezone).format("z");

  const card = document.createElement("article");
  card.classList.add("city-clock-card");
  card.dataset.zone = timezone;

  card.innerHTML = `
  <button class="remove-card-btn">✕</button>
  <h3 class="city-card-name">${cityName} · ${abbr}</h3>
  <div class="city-card-time">${time}</div>
  <p class="city-gmt">GMT ${offset}</p>`;

  addRemoveButton(card);
  cityGrid.appendChild(card);
}

function fetchTimezoneAndAddCard(city) {
  const lat = city.lat;
  const lng = city.lng;
  const apiKey = "FY092UK9VYQX";

  fetch(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`,
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const timezone = data.zoneName;
      const cityName = city.name;
      addCityCard(cityName, timezone);
    });
}

function showResults(matches) {
  if (matches.length > 0) {
    searchResults.style.display = "block";
    matches.forEach(function (city) {
      const li = document.createElement("li");
      li.innerHTML = `${city.name} · <span style="color:#666666; font-size:12px">${city.country}</span>`;

      li.addEventListener("click", function () {
        searchResults.style.display = "none";
        searchInput.value = "";
        fetchTimezoneAndAddCard(city);
      });
      searchResults.appendChild(li);
    });
  } else {
    searchResults.style.display = "none";
  }
}

function filterCities(query) {
  const matches = allCities
    .filter(function (city) {
      return city.name.toLowerCase().includes(query);
    })
    .slice(0, 10);

  showResults(matches);
}

function handleSearchInput() {
  const query = searchInput.value.trim().toLowerCase();

  searchResults.innerHTML = "";

  if (query.length < 2) {
    searchResults.style.display = "none";
    return;
  }

  filterCities(query);
}

const searchInput = document.getElementById("timezone-search");
const searchResults = document.querySelector(".search-results");

searchInput.addEventListener("input", handleSearchInput);

loadCities();
