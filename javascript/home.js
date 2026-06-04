//===FEATURED CITY TIMES===//

function updateAllCards() {
  cityCards.forEach(function (card) {
    const zone = card.dataset.zone;

    const timeDisplay = card.querySelector(".city-card-time");
    const time = moment().tz(zone).format("HH:mm:ss");
    timeDisplay.innerHTML = time;

    const offsetDisplay = card.querySelector("p");
    const offset = moment().tz(zone).format("Z");
    offsetDisplay.innerHTML = "GMT " + offset;
  });
}

const cityCards = document.querySelectorAll(".city-clock-card");

updateAllCards();
setInterval(updateAllCards, 1000);
