/* ==========================================================
   ANADynamics — site scripts (vanilla JS, no dependencies)
   ========================================================== */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CONTACT_EMAIL = 'anadynamics1@gmail.com';

  /* Year */
  $('#year').textContent = new Date().getFullYear();

  /* Header + back-to-top */
  const header = $('.site-header'), toTop = $('.to-top');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 20);
    toTop.classList.toggle('show', scrollY > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  const toggle = $('.nav-toggle'), menu = $('#nav-menu');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('.nav-link', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); } });
  addEventListener('resize', () => { if (innerWidth > 920 && menu.classList.contains('open')) setMenu(false); });

  /* Scroll spy */
  const links = $$('.nav-link');
  const map = { why: 'industries', contact: 'contact' }; // sections without own link inherit the previous
  const sections = $$('main section[id]');
  const spy = () => {
    const pos = scrollY + innerHeight * 0.35;
    let current = 'home';
    sections.forEach(s => { if (s.offsetTop <= pos) current = map[s.id] || s.id; });
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) current = 'contact';
    links.forEach(l => {
      const on = l.hash === '#' + current;
      l.classList.toggle('active', on);
      on ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', spy, { passive: true }); spy();

  /* Reveal on scroll */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  } else reveals.forEach(el => el.classList.add('in'));

  /* Industry tabs (WAI-ARIA tabs pattern) */
  const tabs = $$('.tab');
  const activate = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      if (on) panel.classList.add('in');
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(t));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        activate(next); next.focus(); e.preventDefault();
      }
    });
  });

  /* Service modal */
  const modal = $('#modal');
  let lastFocus = null;
  const select = $('#f-service');
  let currentService = '';
  $$('.service').forEach(card => {
    $('.more', card).addEventListener('click', () => {
      lastFocus = document.activeElement;
      currentService = $('h3', card).textContent;
      $('#m-title', modal).textContent = currentService;
      $('.m-ic', modal).innerHTML = $('.s-ic', card).outerHTML;
      const body = $('.m-body', modal); body.innerHTML = '';
      body.appendChild($('template', card).content.cloneNode(true));
      typeof modal.showModal === 'function' ? modal.showModal() : modal.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
      $('.m-close', modal).focus();
    });
  });
  const closeModal = () => typeof modal.close === 'function' ? modal.close() : modal.removeAttribute('open');
  modal.addEventListener('close', () => { document.body.style.overflow = ''; lastFocus && lastFocus.focus(); });
  $('.m-close', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  $('.m-cta', modal).addEventListener('click', () => {
    // pre-select the service in the contact form
    [...select.options].forEach(o => { if (o.text === currentService) select.value = o.value || o.text; });
    closeModal();
  });

  /* Contact form */
  const form = $('#contact-form'), status = $('.status', form);
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRe = /^[+]?[\d\s()-]{7,20}$/;
  const rules = {
    name:    v => v.trim().length >= 2 || 'Please enter your name.',
    email:   v => emailRe.test(v.trim()) || 'Please enter a valid email address.',
    phone:   v => !v.trim() || phoneRe.test(v.trim()) || 'Please enter a valid phone number.',
    service: v => !!v || 'Please select a service.',
    message: v => v.trim().length >= 10 || 'Please describe your project (at least 10 characters).'
  };
  const check = el => {
    const r = rules[el.name](el.value), ok = r === true;
    const f = el.closest('.field'), err = $('.err', f);
    f.classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    el.setAttribute('aria-describedby', err.id);
    err.textContent = ok ? '' : r;
    return ok;
  };
  Object.keys(rules).forEach(n => {
    const el = form.elements[n];
    el.addEventListener('blur', () => check(el));
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { if (el.closest('.field').classList.contains('invalid')) check(el); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'status'; status.textContent = '';
    if (form.elements._gotcha.value) return;
    const els = Object.keys(rules).map(n => form.elements[n]);
    const res = els.map(check);
    if (res.includes(false)) {
      els[res.indexOf(false)].focus();
      status.classList.add('fail'); status.textContent = 'Please correct the highlighted fields.';
      return;
    }
    const d = {
      name: form.elements.name.value.trim(), company: form.elements.company.value.trim(),
      email: form.elements.email.value.trim(), phone: form.elements.phone.value.trim(),
      service: form.elements.service.value, message: form.elements.message.value.trim()
    };
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      const btn = $('button[type="submit"]', form); btn.disabled = true;
      try {
        const r = await fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        if (!r.ok) throw new Error(r.status);
        form.reset(); status.classList.add('ok'); status.textContent = 'Thank you, your request has been sent. We will get back to you soon.';
      } catch {
        status.classList.add('fail'); status.textContent = `Sending failed. Please email ${CONTACT_EMAIL} directly.`;
      } finally { btn.disabled = false; }
    } else {
      const lines = [`Name: ${d.name}`];
      if (d.company) lines.push(`Company: ${d.company}`);
      lines.push(`Email: ${d.email}`);
      if (d.phone) lines.push(`Phone: ${d.phone}`);
      lines.push(`Service: ${d.service}`);
      const body = lines.join('\n') + '\n\n' + d.message;
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Consultation request: ' + d.service)}&body=${encodeURIComponent(body)}`;
      status.classList.add('ok'); status.textContent = 'Your email app should now open with the request ready to send.';
    }
  });
})();
