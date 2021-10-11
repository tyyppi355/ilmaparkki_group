// Tämä on yleisskripti, jonka avulla lisätään toimintoja kaikille sivuille
'use strict';

document.addEventListener("DOMContentLoaded", () => {
  // Lisätään 'header':in kuvalle linkki pääsivulle
  const header = document.querySelector('header');
  header.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  header.addEventListener('mousemove', () => {
    header.style.cursor = 'pointer';
  })

  // Lisätään 'menu':n aktiiville linkille korostusta
  const setActiveMenu = () => {
    const menuLinks = document.querySelectorAll('.main-menu li a');
    const url = document.location.href;
    for (let i = 1; i < menuLinks.length; i++) {
      if (url === menuLinks[i].href) {
        menuLinks[i].className += 'activeMenu';
      }
    }
  }

  setActiveMenu();

  /**
  /* Sää ennuste API
  */
  const getWeatherData = () => {
    //Tehdään muuttujia
    const weatherApiKey = '6571d1d936905542a1429c32c9433d9c';
    const apiUrl = `http://api.weatherstack.com/current?access_key=${weatherApiKey}&units=m&query=`;
    let apiQuery;
    const button = document.getElementById('searchButton');

    //Katsotaan onko hakunappia painettu
    button.addEventListener('click', makeQuery);

    //Kysellään annetut tiedot omalta nettisivulta
    function makeQuery() {

      //Poistaa napin käytöstä, kunnes sivun lataa uudelleen
      document.getElementById("searchButton").disabled = true;

      apiQuery = apiUrl + document.getElementById('search').value;

      search(apiQuery);
    }

    const defaultQuery = apiUrl + 'Espoo';
    search(defaultQuery);

    //Tehdään haku rajapinta nettisivulle
    function search(apiQuery) {
      fetch(apiQuery).then(function (response) {
        return response.json();
      }).then(function (json) {
        processResults(json);
      }).catch(function (error) {
        console.log(error.message);
      });
    }

    //Luetaan etsittyä dataa ja tulostetaan innerHTML komennolla weatherAdjuster elementtiin
    function processResults(jsonData) {
      const weatherElem = document.getElementById('weatherAdjuster');
      let htmlCode = `<p>`;

      htmlCode += `<img src='${jsonData.current.weather_icons}'><img>`;
      htmlCode += `Paikka: ${jsonData.location.name}<br>`;
      htmlCode += `Sään kuvaus: ${jsonData.current.weather_descriptions}<br>`;
      htmlCode += `Lämpötila: ${jsonData.current.temperature}°C<br>`;
      htmlCode += `Tuntuu: ${jsonData.current.feelslike}°C<br>`;
      htmlCode += `Tuulen nopeus: ${jsonData.current.wind_speed}m/s<br>`;
      htmlCode += `Ilmankosteus: ${jsonData.current.humidity}%<br>`;
      htmlCode += `</p>`;

      //Lisätään tiedot innerHTML komennolla weather elementtiin
      weatherElem.innerHTML += htmlCode;
    }
  }

  getWeatherData();


  /**
   * COVID-19 tiedot API
   */
  function getCovidData() {
    //Tehdään muuttujia
    const covidApiUrl = 'https://api.apify.com/v2/key-value-stores/jEFt5tgCTMfjJpLD3/records/LATEST?disableRedirect=true';

    fetch(covidApiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      covidResults(json);
    }).catch(function (error) {
      console.log(error.message);
    });

    //Luetaan etsittyä dataa ja tulostetaan innerHTML komennolla weatherAdjuster elementtiin
    function covidResults(jsonData) {
      const covidElem = document.getElementById('covid');
      let formatter = new Intl.NumberFormat('fi');
      document.getElementById('newDesease').innerHTML = formatter.format(jsonData.infectedDaily);
      document.getElementById('deseaseTotal').innerHTML = formatter.format(jsonData.infected);
      document.getElementById('newDeaths').innerHTML = formatter.format(jsonData.deathsDaily);
      document.getElementById('deathsTotal').innerHTML = formatter.format(jsonData.deaths);
    }
  }

  getCovidData();
});