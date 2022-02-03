"use strict";

const worldStat = document.querySelector(".world__statBox");
const countryStat = document.querySelector(".country__stat");
//inputs
const btnSearch = document.querySelector(".btnSearch");
const inputSearch = document.querySelector(".inputSearch");

// const countryBox = countryStat.querySelector('.country')
// const countryRow = countryStat.querySelector('.row')

// GET WORLD DATA

const getWorldCovidData = function (data) {
  const html = `
  <div class="row">
    <div class="world__box">
      <h4 class="cases__title">Active cases</h4>
      <h3 class="cases__total">${data.active.toLocaleString("en-US")}</h3>
      <p class="cases__today">+ ${data.todayCases.toLocaleString("en-US")}</p>
    </div>
    <div class="world__box">
      <h4 class="cases__title">Deaths</h4>
      <h3 class="cases__total">${data.deaths.toLocaleString("en-US")}</h3>
      <p class="cases__today">+ ${data.todayDeaths.toLocaleString("en-US")}</p>
    </div>      
    <div class="world__box">
      <h4 class="cases__title">Cases</h4>
      <h3 class="cases__total">${data.recovered.toLocaleString("en-US")}</h3>
      <p class="cases__today">+ ${data.todayRecovered.toLocaleString(
        "en-US"
      )}</p>
    </div>
  </div>`;
  worldStat.insertAdjacentHTML("beforeend", html);
};

const getWorldData = function () {
  const worldRequest = fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => getWorldCovidData(data));
};
getWorldData();

//GET COUNTRY DATA

const renderError = function (msg) {
  removePrevCountry();
  countryStat.insertAdjacentText("beforeend", msg);
};

const getCountryCovidData = function (data) {
  const today = new Date();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let date = today.getDate();
  let present = `${month}/${date}/${year}`;

  const html = `<div class="country">
              <img class="country__img" src="${data.countryInfo.flag}" />
              <div class="country__data">
                <h3 class="country__name">${data.country}</h3>
                <h5 class="country__region">${data.continent}</h5>
              </div>
            </div>
            <div class="row">
              <div class="world__box">
                <h4 class="cases__title">Active cases</h4>
                <h3 class="cases__total">${data.active.toLocaleString(
                  "en-US"
                )}</h3>
                <p class="cases__today">${
                  data.todayCases == 0
                    ? `No updates for ${present}`
                    : `+${data.todayCases.toLocaleString("en-US")}`
                }</p>
              </div>
              <div class="world__box">
                <h4 class="cases__title">Deaths</h4>
                <h3 class="cases__total">${data.deaths.toLocaleString(
                  "en-US"
                )}</h3>
                <p class="cases__today">${
                  data.todayDeaths == 0
                    ? `No updates for ${present}`
                    : `+${data.todayDeaths.toLocaleString("en-US")}`
                }</p>
              </div>
              <div class="world__box">
                <h4 class="cases__title">Recovered</h4>
                <h3 class="cases__total">${data.recovered.toLocaleString(
                  "en-US"
                )}</h3>
                <p class="cases__today">${
                  data.todayRecovered == 0
                    ? `No updates for ${present}`
                    : `+${data.todayRecovered.toLocaleString("en-US")}`
                }</p>
              </div>
            </div>
            </div>`;
  countryStat.insertAdjacentHTML("beforeend", html);
};

const getCountryData = async function (country) {
  try {
    let input = inputSearch.value;
    country = input;
    //ajax call
    const place = await fetch(
      `https://disease.sh/v3/covid-19/countries/${country}`
    );
    // err hand
    if (!place.ok) throw new Error("Cannot find country");
    const rend = await place.json();
    removePrevCountry();
    getCountryCovidData(rend);
  } catch (err) {
    renderError(`Something went wrong. ${err.message}`);
  }
};

const removePrevCountry = function () {
  countryStat.innerHTML = "";
  countryStat.classList.add("country__showIn");
};

// USER LOCATION
(async function () {
  try {
    const getIp = await fetch(`https://api.ipify.org?format=json`);
    const res = await getIp.json();
    const find = await fetch(
      `https://ipinfo.io/${res.ip}?token=9456a2576bce19`
    );
    if (!find.ok) throw new Error("Problem getting IP address");
    const res1 = await find.json();
    const getCountry = await fetch(
      `https://disease.sh/v3/covid-19/countries/${res1.country}`
    );
    if (!getCountry.ok) throw new Error("Problem getting location data");
    const res2 = await getCountry.json();
    getCountryCovidData(res2);
  } catch (err) {
    renderError(`Something went wrong ${err.message}`);
  }
})();

// EVENTS
btnSearch.addEventListener("click", function () {
  //guard
  if (!inputSearch.value) return;

  getCountryData();
  inputSearch.value = "";
});
document.addEventListener("keydown", function (e) {
  if (e.key == "Enter" && !inputSearch.value == "") {
    getCountryData();
    inputSearch.value = "";
  }
});
