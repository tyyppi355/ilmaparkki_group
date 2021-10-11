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

/* Sää ennuste API */
  //Tehdään muuttujia
  const apiUrl = 'http://api.weatherstack.com/current?access_key=6571d1d936905542a1429c32c9433d9c&units=m&query=';
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
      console.log(json.error);
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
    htmlCode += `Paikka: ${jsonData.location.name}<br><br>`;
    htmlCode += `Sään kuvaus: ${jsonData.current.weather_descriptions}<br><br>`;
    htmlCode += `Lämpötila: ${jsonData.current.temperature}°C<br><br>`;
    htmlCode += `Tuntuu: ${jsonData.current.feelslike}°C<br><br>`;
    htmlCode += `Tuulen nopeus: ${jsonData.current.wind_speed}m/s<br><br>`;
    htmlCode += `Ilmankosteus: ${jsonData.current.humidity}%<br><br>`;
    htmlCode += `</p>`;

    //Lisätään tiedot innerHTML komennolla weather elementtiin
    weatherElem.innerHTML += htmlCode;
  }
});