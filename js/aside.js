// Tämä moduuli tulostaa sivulle 'aside'-elementin
'use strict';

// Elementtia luominen
const aside = `
  <aside class='aside'>
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