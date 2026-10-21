const openButton = document.querySelector('#open-invitation');
const envelope = document.querySelector('#envelope');
const envelopeScene = document.querySelector('#envelope-scene');
const invitationLayout = document.querySelector('#invitation-layout');
const navigationLinks = [...document.querySelectorAll('.navigation__link')];
const panels = [...document.querySelectorAll('.panel')];
const rsvpForm = document.querySelector('.rsvp-form');

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
});

const thankYouLetter = document.querySelector('#thank-you-letter');
const thankYouCloseButton = thankYouLetter.querySelector('.thank-you-letter__close');
const thankYouGreeting = thankYouLetter.querySelector('#thank-you-greeting');
const rsvpSuccess = new URLSearchParams(window.location.search).get('rsvp') === 'success';

if (rsvpSuccess) {
  envelopeScene.hidden = true;
  envelopeScene.style.display = 'none';
  invitationLayout.hidden = false;
  navigationLinks.find((link) => link.dataset.panel === 'attendance')?.click();

  const guestName = window.sessionStorage.getItem('rsvpGuestName');
  thankYouGreeting.textContent = guestName ? `Dear ${guestName},` : 'Dear guest,';
  window.sessionStorage.removeItem('rsvpGuestName');
  rsvpForm.querySelector('.submit-button').textContent = 'Sent';
  rsvpForm.querySelector('.submit-button').disabled = true;
  rsvpForm.querySelector('.form-status').textContent =
    'Your attendance confirmation was received. A thank-you email was sent to the address you provided.';
  thankYouLetter.showModal();
  thankYouCloseButton.focus();

  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete('rsvp');
  window.history.replaceState({}, '', cleanUrl);
}

rsvpForm.addEventListener('submit', () => {
  const submitButton = rsvpForm.querySelector('.submit-button');
  const status = rsvpForm.querySelector('.form-status');

  const formData = new FormData(rsvpForm);
  const guestName = [formData.get('First Name'), formData.get('Last Name')]
    .filter((name) => typeof name === 'string' && name.trim())
    .join(' ');
  window.sessionStorage.setItem('rsvpGuestName', guestName);

  const returnUrl = new URL(window.location.href);
  if (returnUrl.protocol === 'http:' || returnUrl.protocol === 'https:') {
    returnUrl.searchParams.set('rsvp', 'success');
    rsvpForm.querySelector('[name="_next"]').value = returnUrl.href;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  status.textContent = 'Submitting your attendance confirmation...';
});

thankYouCloseButton.addEventListener('click', () => {
  thankYouLetter.close();
});
