'use strict';

(() => {
  const container = document.querySelector('.nav-container');
  const nav = container.querySelector('.top-bar');
  const toggle = nav.querySelector('.mobile-toggle');
  const logo = nav.querySelector('.logo');
  const desktop = () => getComputedStyle(toggle).display === 'none';

  function sizeLogo() {
    if (!logo.naturalHeight) return;
    const ratio = logo.naturalWidth / logo.naturalHeight;
    logo.classList.toggle('logo-wide', ratio > 2.8);
    logo.classList.toggle('logo-square', ratio < 2);
  }

  function updateLayout() {
    const isDesktop = desktop();
    const isSticky = isDesktop && window.scrollY > 500;
    nav.classList.toggle('nav-sticky', isSticky);
    const height = nav.offsetHeight;
    if (!isSticky && !nav.classList.contains('open-nav')) {
      container.style.height = `${height}px`;
    }
    document.body.style.setProperty('--wine-nav-sticky-height', `${isDesktop ? height : 0}px`);
  }

  toggle.addEventListener('click', () => nav.classList.toggle('open-nav'));
  logo.addEventListener('load', sizeLogo);
  window.addEventListener('scroll', updateLayout, { passive: true });
  window.addEventListener('resize', () => {
    nav.classList.remove('open-nav');
    updateLayout();
  });
  new ResizeObserver(updateLayout).observe(nav);
  sizeLogo();
  updateLayout();
})();
