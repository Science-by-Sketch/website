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
    setTimeout(() => emailInput.focus(), 150);
}

function closeModal() {
    overlay.classList.remove('open');
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

const header = document.getElementById('siteHeader');
if (header) {
    const updateHeader = () => {
        if (window.scrollY > 80) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => revealObserver.observe(el));
} else {
    revealEls.forEach((el) => el.classList.add('revealed'));
}

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