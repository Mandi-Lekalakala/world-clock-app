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

//===FEATURED CITY TIMES===//

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
  });

  setInterval(function () {
    updateAllCards();
  }, 1000);
}

updateAllCards();
tickClock();
