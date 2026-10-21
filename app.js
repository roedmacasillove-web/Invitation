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

  rsvpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = rsvpForm.querySelector('.submit-button');
    const status = rsvpForm.querySelector('.form-status');
    const action = new URL(rsvpForm.action);
    action.pathname = `/ajax${action.pathname}`;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    status.textContent = '';
    status.classList.remove('is-error');

    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(rsvpForm))),
      });

      if (!response.ok) {
        throw new Error(`The RSVP service returned ${response.status}.`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'The RSVP could not be sent.');
      }

      submitButton.textContent = 'Sent';
      status.textContent = 'Your attendance confirmation has been sent.';
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
      status.classList.add('is-error');
      status.textContent = 'We could not send your confirmation. Please try again.';
      console.error('RSVP submission failed:', error);
    }
  });
});
