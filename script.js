// Replace this with the Web App URL from your Apps Script deployment.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwp-pRiXRKfekinYf_F0oJApMymPGQNSqZTGmhGm3WErqONMYnxLlGOdWMiY7XV0bOmtQ/exec";

const overlay = document.getElementById('modalOverlay');
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const submitBtn = document.getElementById('submitBtn');
const doneBtn = document.getElementById('doneBtn');
const emailInput = document.getElementById('emailInput');
const status = document.getElementById('modalStatus');
const successEmail = document.getElementById('successEmail');
 
function setStatus(message, type) {
    status.textContent = message;
    status.className = 'modal-status' + (type ? ' ' + type : '');
    // Force reflow so the transition replays even if the same class is reused.
    void status.offsetWidth;
    status.classList.add('visible');
}
 
function clearStatus() {
    status.textContent = '';
    status.className = 'modal-status';
}
 
function openModal() {
    overlay.classList.add('open');
    modal.classList.remove('success');
    clearStatus();
    emailInput.value = '';
    // Wait for the modal's own transition to start before focusing,
    // so the focus ring doesn't jump in ahead of the animation.
    setTimeout(() => emailInput.focus(), 150);
}
 
function closeModal() {
    overlay.classList.remove('open');
    // Wait for the close transition to finish before resetting back to
    // the form, so the user never sees it flash mid-close.
    setTimeout(() => {
        modal.classList.remove('success');
        clearStatus();
    }, 250);
}
 
openBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
doneBtn.addEventListener('click', closeModal);
 
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});
 
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});
 
submitBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('Please enter a valid email address.', 'error');
        return;
    }
 
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
 
    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ email })
        });
        // no-cors means we can't read the response, so we assume success
        // if the request didn't throw. Swap the whole modal body over to
        // an explicit success view rather than a small status line, so
        // there's no ambiguity about whether it worked.
        successEmail.textContent = email;
        modal.classList.add('success');
        doneBtn.focus();
    } catch (err) {
        setStatus('Something went wrong. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
    }
});
 