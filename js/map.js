var map, infoWindow;

function initMap() {
  var opt = {
    center: {
      lat: 60.223907,
      lng: 24.758295,
    },
    zoom: 11,
    scrollwheel: false,

  }

  map = new google.maps.Map(document.getElementById('map'), opt)
  infoWindow = new google.maps.InfoWindow();

  function setCurrentLocationButton() {
    const locationButton = document.createElement("div");

    locationButton.classList.add("custom-map-control-button");
    locationButton.id = "currentLocation";
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            var currentLocMarker = new google.maps.Marker({
              position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              map,
            });

            infoWindow.setPosition(pos);
            infoWindow.setContent("Olet tässä");
            infoWindow.open(map, currentLocMarker);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }
  }

  setCurrentLocationButton();

  function setSearchFunctionality() {
    var input = document.getElementById('searchInput');
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(input);

    var receivedGeoData = document.querySelector('.geo-data');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener('place_changed', function () {
      infoWindow.close();
      marker.setVisible(false);
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

      marker.setIcon(({
        url: '../img/parkkiMerkki48.ico',
        sixe: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35),
      }));

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infoWindow.open(map, marker);

      // Location details
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

      receivedGeoData.classList.remove('hidden')
    });
  }

  setSearchFunctionality();

  function printLocationData(marker) {

  }

  var markers = [];
  var placesFromFile = [];
  var places = [];
  var placesFile = '../places.json';

  function readPlacesFile(file, callback) {
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

  readPlacesFile(placesFile, function (text) {
    placesFromFile = JSON.parse(text);
    places = JSON.parse(JSON.stringify(placesFromFile));
    places.forEach(place => {
      place.icon = '../media/img/parkkiMerkki48.ico';
      place.animation = google.maps.Animation.DROP;
      place.map = map;
      place.draggable = false;
      markers.push(new google.maps.Marker(place));
    })
    markers.forEach(el => {
      el.addListener("click", toggleBounce);
    });
    return placesFromFile;
  });

  function toggleBounce() {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
      infoWindow.close();
    } else {
      // this.setAnimation(google.maps.Animation.BOUNCE);
      infoWindow.setContent(`<h4>${this.address}</h4>`);
      infoWindow.open(map, this);
      printLocationData(this);
    }
  }

  function searchFieldSet() {
    document.getElementById('searchInput').classList.remove('hidden');
  }

  setTimeout(searchFieldSet, 2000);
}