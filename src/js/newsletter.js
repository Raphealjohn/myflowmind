/* MyFlowMind — footer newsletter signup
   Posts to the same Formspree endpoint as the contact form (distinguished
   by _subject); falls back to native form action if JS is unavailable. */
(function () {
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/xdavaabq";

  document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
    form.setAttribute('action', FORMSPREE_ENDPOINT);
    var msg = form.querySelector('[data-newsletter-msg]');
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var original = btn.textContent;
      btn.disabled = true; btn.textContent = 'Joining…';
      try {
        var res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          form.reset();
          msg.textContent = "You're on the list — welcome aboard!";
        } else {
          msg.textContent = 'Something went wrong — please email contact@myflowmind.com.';
        }
      } catch (err) {
        msg.textContent = 'Network error — please email contact@myflowmind.com.';
      } finally {
        btn.disabled = false; btn.textContent = original;
        msg.style.display = 'block';
      }
    });
  });
})();
