document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('header');
  header.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  header.addEventListener('mousemove', () => {
    header.style.cursor = 'pointer';
  })

  const setActiveMenu = () => {
    const menuLinks = document.querySelectorAll('.main-menu li a');
    const url = document.location.href;
    for (let i = 0; i < menuLinks.length; i++) {
      if (url === menuLinks[i].href) {
        menuLinks[i].className += 'activeMenu';
      }
    }
  }

  setActiveMenu();
});