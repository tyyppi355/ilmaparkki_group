// Tämä moduuli tulostaa sivulle 'aside'-elementin
'use strict';

// Elementtia luominen
const aside = `
  <aside class='aside'>
    <section class='geoData hidden'>
      <h2>Osoitteesi tiedot</h2>
      <table class="geo-data" id="geoData">
        <tbody>
          <tr>
            <td>Osoite:</td>
            <td><span id="location"></span></td>
          </tr>
          <tr>
            <td>Postitoimipaikka:</td>
            <td><span id="postal_code"></span></td>
          </tr>
          <tr>
            <td>Maa:</td>
            <td><span id="country"></span></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>COVID-19 päivityksiä</h2>
      <p>
        API: Maailman tuoreen tilanteen koronasta
      </p>
    </section>

    <section>
      <h2>Sää ennuste</h2>
      <p>
        API: sää ennuste
      </p>
    </section>

    
  </aside>
`;

// Elementtia tulostaminen
document.write(aside);