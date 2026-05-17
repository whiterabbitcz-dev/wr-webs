// wr-webs · vanilla JS, no dependencies.
// Mobile nav toggle + smooth in-page link close.

(function () {
  'use strict';

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    links.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  // Close menu after clicking an in-page link (mobile)
  links.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a) return;
    setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
