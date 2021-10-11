// Tämä moduuli tulostaa sivulle 'header'-elementin
'use strict';

// Elementtia luominen
const header = `
<header>
</header>

<nav>
  <ul class='main-menu'>
    <li><a href="./index.html">Etusivu</a></li>
    <li><a href="./map.html">Parkkipaikat</a></li>
    <li><a href="./about.html">Projektistamme</a></li>
    <li><a href="./contacts.html">Yhteystiedot</a></li>
  </ul>
</nav>
`;

// Elementtia tulostaminen
document.write(header);