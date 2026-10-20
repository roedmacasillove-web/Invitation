const openButton = document.querySelector('#open-invitation');
const envelope = document.querySelector('#envelope');
const envelopeScene = document.querySelector('#envelope-scene');
const invitationLayout = document.querySelector('#invitation-layout');
const navigationLinks = [...document.querySelectorAll('.navigation__link')];
const panels = [...document.querySelectorAll('.panel')];
const rsvpForm = document.querySelector('.rsvp-form');
const rsvpStatus = document.querySelector('#rsvp-status');
const rsvpThankYou = document.querySelector('#rsvp-thank-you');
const rsvpCopy = document.querySelector('.panel__copy--form');

openButton.addEventListener('click', () => {
  if (openButton.disabled) return;

  openButton.disabled = true;
  envelope.classList.add('is-opening');
  envelopeScene.classList.add('is-opening');

  window.setTimeout(() => {
    envelopeScene.hidden = true;
    envelopeScene.style.display = 'none';
    invitationLayout.hidden = false;
  }, 720);
});

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const targetId = `panel-${link.dataset.panel}`;
    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;

    navigationLinks.forEach((item) => {
      const isActive = item === link;
      item.classList.toggle('is-active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    panels.forEach((panel) => {
      const isActive = panel === targetPanel;
      panel.classList.toggle('is-visible', isActive);
      panel.hidden = !isActive;
    });
  });

  rsvpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = rsvpForm.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    rsvpStatus.hidden = true;
    rsvpStatus.textContent = '';

    try {
      const response = await fetch('https://formsubmit.co/ajax/roedmacasil.love@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(rsvpForm)
      });
      const result = await response.json();

      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error(result.message || 'Your confirmation could not be sent.');
      }

      rsvpCopy.classList.add('is-confirmed');
      rsvpThankYou.hidden = false;
    } catch (error) {
      rsvpStatus.textContent = error.message || 'We could not send your confirmation. Please try again.';
      rsvpStatus.hidden = false;
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    }
  });
});
