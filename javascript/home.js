// ===USER'S LOCAL TIME===//

function updateUserCity(cityName) {
  let userCityName = document.getElementById("user-city");
  let userTime = document.getElementById("user-time");
  let userDate = document.getElementById("user-date");
  let now = moment();
  let abbr = moment.tz(moment.tz.guess()).format("z");

  userCityName.innerHTML = `${cityName} · ${abbr}`;
  userTime.innerHTML = now.format("HH:mm:ss");
  userDate.innerHTML = now.format("dddd, D MMMM YYYY");

  setInterval(function () {
    updateUserCity(cityName);
  }, 1000);
}

function handleGeolocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let cityName = data.city || data.locality;
      updateUserCity(cityName);
    });
}

navigator.geolocation.getCurrentPosition(handleGeolocation);

//===FEATURED CITY TIMES===//

function updateAllCards() {
  cityCards.forEach(function (card) {
    const zone = card.dataset.zone;

    const timeDisplay = card.querySelector("#city-card-time");
    const time = moment().tz(zone).format("HH:mm:ss");
    timeDisplay.innerHTML = time;

    const offsetDisplay = card.querySelector("#city-gmt");
    const offset = moment().tz(zone).format("Z");
    offsetDisplay.innerHTML = `GMT ${offset}`;

    const nameDisplay = card.querySelector("#city-card-name");
    const cityName = zone.split("/")[1].replace("_", " ");
    const abbr = moment().tz(zone).format("z");
    nameDisplay.innerHTML = `${cityName} · ${abbr}`;
  });
}

const cityCards = document.querySelectorAll(".city-clock-card");

updateAllCards();
setInterval(updateAllCards, 1000);
