/* =============================================
   João Amorim — Portfólio · script.js
============================================= */

/* ── INIT EMAILJS (apenas uma vez) ─────────── */
emailjs.init("TD4kWAnZRBhPY0-0J");

/* ── SELETORES ─────────────────────────────── */
const header      = document.getElementById('header');
const hamburger   = document.getElementById('hamburger');
const nav         = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const feedback    = document.getElementById('feedback');
const navLinks    = document.querySelectorAll('.nav__link');

/* ══════════════════════════════════════════
   1. CURSOR PERSONALIZADO
══════════════════════════════════════════ */
const cDot  = document.getElementById('cDot');
const cRing = document.getElementById('cRing');

let mx = -200, my = -200;
let rx = -200, ry = -200;

const hasPointer = window.matchMedia('(hover: hover)').matches;

if (hasPointer) {

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cDot.style.transform =
      `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cRing.style.transform =
      `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(lerpRing);
  })();

  const targets = 'a, button, input, textarea, .proj__link, .scard, .contact__link';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(targets)) {
      cDot.classList.add('hov');
      cRing.classList.add('hov');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(targets)) {
      cDot.classList.remove('hov');
      cRing.classList.remove('hov');
    }
  });

  document.addEventListener('mousedown', () => {
    cDot.classList.add('press');
    cRing.classList.add('press');
  });

  document.addEventListener('mouseup', () => {
    cDot.classList.remove('press');
    cRing.classList.remove('press');
  });
}

/* ══════════════════════════════════════════
   2. HEADER SCROLLED
══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ══════════════════════════════════════════
   3. MENU MOBILE
══════════════════════════════════════════ */
hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ══════════════════════════════════════════
   4. REVEAL AO SCROLL
══════════════════════════════════════════ */
const allReveals = document.querySelectorAll(
  '.reveal, .hero__name--first, .hero__name--last, .scard'
);

const io = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -28px 0px' }
);

allReveals.forEach(el => io.observe(el));

/* ══════════════════════════════════════════
   5. RIPPLE NO BOTÃO
══════════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--bx', `${((e.clientX - r.left) / r.width)  * 100}%`);
    btn.style.setProperty('--by', `${((e.clientY - r.top)  / r.height) * 100}%`);
  });
});

/* ══════════════════════════════════════════
   6. FORMULÁRIO + EMAILJS
══════════════════════════════════════════ */
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const submit  = contactForm.querySelector('.btn');
    const btnText = submit.querySelector('.btn__text');
    const original = btnText.textContent;

    /* Validação */
    if (!name || !message) {
      setFeedback('Preencha nome e mensagem.', 'error');
      shake(!name ? 'fname' : 'fmsg');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('E-mail inválido.', 'error');
      shake('femail');
      return;
    }

    /* Loading */
    btnText.textContent = 'Enviando...';
    submit.disabled = true;

    try {
      await emailjs.send('service_w4vgcz8', 'template_pny26wh', {
        name:    name,
        email:   email,
        subject: contactForm.subject.value.trim(),
        message: message,
      });

      setFeedback('Mensagem enviada! Responderei em breve.', 'ok');
      contactForm.reset();

    } catch (err) {
      setFeedback('Erro ao enviar. Tente novamente.', 'error');
      console.error('EmailJS error:', err);
    }

    btnText.textContent = original;
    submit.disabled = false;
  });
}

function setFeedback(msg, type) {
  if (!feedback) return;
  feedback.textContent = msg;
  feedback.style.color = type === 'ok' ? 'var(--accent)' : '#E05252';
  setTimeout(() => { feedback.textContent = ''; }, 5000);
}

function shake(id) {
  if (!document.getElementById('sh-kf')) {
    const s = document.createElement('style');
    s.id = 'sh-kf';
    s.textContent = `@keyframes sh {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-5px)}
      40%{transform:translateX(5px)}
      60%{transform:translateX(-3px)}
      80%{transform:translateX(3px)}
    }`;
    document.head.appendChild(s);
  }
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'sh 0.38s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}