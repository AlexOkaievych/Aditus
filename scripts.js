// Year
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Read more toggles
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.previousElementSibling;
      const isOpen = box.style.display === 'block';
      box.style.display = isOpen ? 'none' : 'block';
      btn.textContent = isOpen ? 'Читати більше' : 'Згорнути';
    });
  });

  // Client-side search
  const input = document.getElementById('site-search');
  const sections = document.querySelectorAll('.section');
  function doSearch(q){
    const query = q.trim().toLowerCase();
    document.querySelectorAll('.searchable').forEach(el => {
      const match = el.innerText.toLowerCase().includes(query) || query === '';
      el.style.display = match ? '' : 'none';
    });
    // toggle per-section "no results"
    sections.forEach(sec => {
      const cards = sec.querySelectorAll('.searchable');
      if(cards.length){
        const visible = Array.from(cards).some(c => c.style.display !== 'none');
        const msg = sec.querySelector('.no-results');
        if(msg){ msg.hidden = visible; }
      }
    });
  }
  input.addEventListener('input', e => doSearch(e.target.value));
  doSearch('');

  // ---- Contact form: Formspree integration ----
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwpnavzo'; // e.g. https://formspree.io/f/abcdwxyz
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  function setStatus(text, ok=true){
    statusEl.textContent = text;
    statusEl.style.color = ok ? '#1b8a5a' : '#b00020';
  }

  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // honeypot (spam trap)
      if(form.website && form.website.value){ return; }

      if(!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('REPLACE_WITH')){
        setStatus('Будь ласка, додайте адресу форми Formspree у scripts.js (FORMSPREE_ENDPOINT).', false);
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if(res.ok){
          form.reset();
          setStatus('Дякуємо! Ми зв’яжемося з вами найближчим часом.');
        }else{
          setStatus('На жаль, не вдалося надіслати форму. Спробуйте пізніше або зателефонуйте.', false);
        }
      } catch (err){
        setStatus('Сталася мережна помилка. Перевірте інтернет або спробуйте пізніше.', false);
      }
    });
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }
    });
  });
});
