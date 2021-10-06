'use strict';
const parkingSpotArray = [
  {
    paikka: 'Karamalmi',
    parkkiaika: 'Kokopäivän',
    koko: 'Suuri',
    filename: 'media/kuva-1.jpg',
  },
  {
    paikka: 'Rastaspuisto',
    parkkiaika: '4 tuntia',
    koko: 'Keskikokoinen',
    filename: 'media/kuva-2.jpg',
  },
  {
    paikka: 'Sello',
    parkkiaika: '5 tuntia',
    koko: 'Suuri',
    filename: 'media/kuva-3.jpg',
  },
  {
    paikka: 'Leppävaara',
    parkkiaika: 'Kokopäivän',
    koko: 'Pieni',
    filename: 'media/kuva-4.jpg',
  },
  {
    paikka: 'Matinkylä',
    parkkiaika: '4 tuntia',
    koko: 'Keskikokoinen',
    filename: 'media/kuva-5.jpg',
  },
];



const apiUrl = 'https://www.openstreetmap.org/#map=';
let apiKysely;
const hakunappi = document.getElementById( 'button' );
const resultsElement = document.getElementById( 'results' );

let paikka;
let parkkiaika;
let koko;
let kuva;


hakunappi.addEventListener( 'click', teeKysely);


function teeKysely() {
  apiKysely = document.getElementById('searchText');
  teeHaku( apiKysely );
}


function teeHaku( apiKysely ) {

  for (let i = 0; parkingSpotArray.length > i; i++) {

    if (parkingSpotArray[i].paikka == apiKysely)  {
      paikka = parkingSpotArray[i].paikka;
      parkkiaika = parkingSpotArray[i].parkkiaika;
      koko = parkingSpotArray[i].koko;
      kuva = parkingSpotArray[i].filename;
      tulosta( paikka, parkkiaika, koko, kuva );
    }
  }
}

function tulosta( paikka, parkkiaika, koko, kuva )  {
  resultsElement.innerText += paikka + parkkiaika + koko + kuva;
}








//  !!---TALLAISIA KOKEILIN, MUTTEI TOIMINUT :D---!!

//apiKysely.FileReader.readAsText( 'tietokanta/parkkipaikat.txt' );

/*
$.get( 'tietokanta/parkkipaikat.txt', function(returnedData) {
  $( '#results' ).text( returnedData );
}, 'text/plain');
*/

/*
let reader = new FileReader();


reader.readAsText( 'tietokanta/parkkipaikat.txt');

reader.onload = function() {
  console.log(reader.result);
};
*/