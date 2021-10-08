// Tämä on kartan rajapinnan skripti
'use strict';

var map, infoWindow;

// Rajapinnan yleisfunktio
function initMap() {
  // Peruskarttaasetukset
  var opt = {
    center: {
      lat: 60.223907,
      lng: 24.758295,
    },
    zoom: 11,
    scrollwheel: false,

  }

  // Karttaa luominen Google-rajapinnan kautta
  map = new google.maps.Map(document.getElementById('map'), opt)
  // Ponnahdusilmoitusta luominen (olion)
  infoWindow = new google.maps.InfoWindow();

  // Lisätään kartalle nykysijainti-nappia
  const setCurrentLocationButton = () => {

    // Luodaan napin
    const locationButton = document.createElement("div");

    locationButton.classList.add("custom-map-control-button");
    locationButton.id = "currentLocation";

    // Lisätään luovaa nappia kartalle
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    // Napin toiminto
    locationButton.addEventListener("click", () => {
      // Kun sijaintihaku onnistuu (laitteen GPS on päällä)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Nykyistä positiota saaminen
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // Nykyisen position merkkiä luominen kartalle
            var currentLocMarker = new google.maps.Marker({
              position: pos,
              map,
            });

            // Ponnahdusilmoitusta nykysijainnissa luominen
            infoWindow.setPosition(pos);
            infoWindow.setContent("Olet tässä");
            // Ponnahdusilmoitusta näyttäminen
            infoWindow.open(map, currentLocMarker);
            map.setCenter(pos);
            map.setZoom(17);
          },
          // Virhekäsittely
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Kun sijaintihaku ei onnistunut
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });

    // Sijaintihakua epäonnistumista funktio
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
      );
      // Ponnahdusilmoitusta näyttäminen (virheen saattuessa)
      infoWindow.open(map);
    }
  }

  setCurrentLocationButton();

    // Lisätään kartalle osoitehaku-toimintoa
  const setSearchFunctionality = () => {
    // Hakukenttaa sivulta saaminen
    var input = document.getElementById('searchInput');
    // Lisätään hakukenttaa kartalle
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(input);

    // Osoitetietotaulukkoa sivulta saaminen
    var receivedGeoData = document.querySelector('.geo-data');

    /*
    Google-rajapinnan 'Autocomplete' käyttäminen
    (osakirjattuvaa osoitetta haku ja täyttäminen automaattisesti)
    */
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    // Löydetyn osoitteen merkkiä luominen kartalle
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    // Osoitehakukentan muutosten seuranta toiminto
    autocomplete.addListener('place_changed', function () {
      // Viimeistä ponnahdusilmoitusta sulkeminen
      infoWindow.close();
      marker.setVisible(false);
      // Löytyvää osoiteetta saaminen
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert(`Autocomplete's returned place contains no geometry`);
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Löytyvää positiota merkkiä luominen kartalle
      marker.setIcon(({
        url: '../img/parkkiMerkki48.ico',
        sixe: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35),
      }));

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      // Osoiteilmoitustietojen luominen (kartan merkille antamista varten)
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      // Ponnahdusilmoitusta löydettysijainnissa luominen
      infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infoWindow.open(map, marker);

      // Löytöosoitteen tietojen laittaminen taulukkoon sivulle
      for (var i = 0; i < marker.address_components.length; i++) {
        if (marker.address_components[i].types[0] == 'postal_code') {
          document.getElementById('postal_code').innerHTML = marker.address_components[i].long_name;
        }
        if (marker.address_components[i].types[0] == 'country') {
          document.getElementById('country').innerHTML = marker.address_components[i].long_name;
        }
      }
      document.getElementById('location').innerHTML = marker.formatted_address;
      document.getElementById('lat').innerHTML = marker.geometry.location.lat();
      document.getElementById('lon').innerHTML = marker.geometry.location.lng();

      // Osoitetietojen taulukkoa näyttäminen sivulle
      receivedGeoData.classList.remove('hidden');
    });
  }

  setSearchFunctionality();

  // Kartalla painettua merrkia tietojen tulostaminen (klikkaamalla merkille)
  const printLocationData = (marker) => {

  }

  /* 
  Nykyisiä merkkeja tietojen lukeminen
  (tietokannasta, joka on tällä hetkellä paikallinen json-tiedosto)
  */
  var markers = [];
  var placesFromFile = [];
  var places = [];
  // Tietokannan tiedoston paikallinen osoite
  var placesFile = '../places.json';

  // Paikallista json-tiedostoa lukeminen-funktio ('XMLHttpRequestin' kautta)
  const readPlacesFile = (file, callback) => {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    }
    rawFile.send(null);
  }

  // Json=-tiedoston lukeminen-toiminto
  readPlacesFile(placesFile, function (text) {
    placesFromFile = JSON.parse(text);
    places = JSON.parse(JSON.stringify(placesFromFile));
    // Jokaiselle json-tiedostosta löydetylle kohteelle asetuksia antaminen
    places.forEach(place => {
      place.icon = '../media/img/parkkiMerkki48.ico';
      place.animation = google.maps.Animation.DROP;
      place.map = map;
      place.draggable = false;
      markers.push(new google.maps.Marker(place));
    });
    // Animaatio-toiminta merkeille
    markers.forEach(el => {
      el.addListener("click", toggleBounce);
    });
    return placesFromFile;
  });

  // Merkkien animaatio-funktio
  function toggleBounce() {
    // Tarkistetaan, onko joka toinen merkki avattuna ja suljetaan tätä, kun on
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
      infoWindow.close();
    } else {
      // Animaatio ei tällä hetkellä ole käytössä
      // this.setAnimation(google.maps.Animation.BOUNCE);
      // Painetulla merkilla ponnahdusilmoitusta luominen
      infoWindow.setContent(`<h4>${this.address}</h4>`);
      infoWindow.open(map, this);
      // Merkkia tietoja tulostaminen sivustolla olevalle taulukolle
      printLocationData(this);
    }
  }

  // Osoitehaun kentän kartalle ilmestyminen kartan luomisen jälkeen
  const searchFieldSet = () => {
    document.getElementById('searchInput').classList.remove('hidden');
  }

  setTimeout(searchFieldSet, 2000);
}