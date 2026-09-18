const figmaIcon = (name, size = 22) => `<img class="figma-icon" src="assets/icons/${name}.svg" width="${size}" height="${size}" alt="" aria-hidden="true">`;

// Keep the footer identical on every page. Older pages contain slightly different
// static versions, so this shared template is the single rendered source of truth.
document.querySelectorAll('body > footer:not(.resource-footer)').forEach(footer => {
  footer.id = 'footer';
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-main">
      <div class="footer-brand">
        <a class="footer-logo" href="index.html" aria-label="Al Manal Dental Centre home">
          <img src="assets/logo-original.png" alt="Al Manal Dental Centre">
        </a>
        <p>Dentistry as Art. Smiles as Identity.<br>Excellence in dental care with artistic<br class="footer-copy-break"> sensitivity and genuine empathy.</p>
        <div class="socials" aria-label="Social media">
          <a href="#" aria-label="Instagram"></a>
          <a href="#" aria-label="Facebook"></a>
          <a href="#" aria-label="Twitter"></a>
          <a href="#" aria-label="LinkedIn"></a>
        </div>
      </div>
      <nav class="footer-navigation" aria-label="Footer navigation">
        <h3>Navigation</h3>
        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="index.html#concept">Concept</a>
          <a href="services.html">Treatments</a>
          <a href="doctors.html">Our Artists</a>
          <a href="index.html#gallery">Gallery</a>
          <a href="contact.html">Contact Us</a>
        </div>
      </nav>
      <div class="footer-subscribe">
        <h3>Subscribe</h3>
        <p>Receive smile-care tips and clinic news, thoughtfully curated.</p>
        <form class="subscribe">
          <label class="sr-only" for="footer-email">Email address</label>
          <input id="footer-email" type="email" inputmode="email" autocomplete="email" placeholder="Enter Your Email" required>
          <button type="submit" aria-label="Subscribe"></button>
        </form>
      </div>
    </div>
    <div class="footer-bottom">
      <span>MOHAP APPROVAL LICENSE: RE6YF8UV-101224</span>
      <span>©2026 Al Manal. All Rights Reserved.</span>
    </div>`;
});
const valueIcons = ['personal-care', 'artistic', 'calm', 'technology', 'professionals', 'excellence'];
const values = [
  ['✦','Personalized Care','We take time to understand each patient, because no two smiles are the same.'],
  ['◌','Artistic Sensitivity','We combine clinical precision with aesthetic awareness for natural results.'],
  ['⌁','Calm Environment','Thoughtfully designed to feel calm, welcoming, and reassuring.'],
  ['◇','Modern Technology','Precision instruments and digital workflows for refined results.'],
  ['✧','Experienced Professionals','Extensive experience across general, cosmetic, and restorative dentistry.'],
  ['✓','Clinical Excellence','Combining clinical excellence with artistic sensitivity and genuine empathy.']
];
const homepageAboutValues = [
  ['artistic', 'Poetic but clear', 'We speak with emotion and meaning, never cold or clinical.'],
  ['personal-care', 'Refined and human', 'Luxury without arrogance. Elegance without distance.'],
  ['calm', 'Confident and calm', 'Authority that reassures, not intimidates.'],
  ['excellence', 'Inspirational, not promotional', 'We tell stories, not slogans.']
];
const valuesGrid = document.querySelector('#values');
if (valuesGrid) {
  const cardValues = document.body.classList.contains('homepage')
    ? homepageAboutValues
    : values.map((value, index) => [valueIcons[index], value[1], value[2]]);
  valuesGrid.innerHTML = cardValues.map(([icon, title, description]) => `<article><i>${figmaIcon(icon)}</i><h3>${title}</h3><p>${description}</p></article>`).join('');
}

const treatments = [
  ['service-smile.png','Smile Design','A digital design process that plans your ideal smile based on your facial features.'],
  ['service-veneers.png','Veneers','Ultra-thin cosmetic veneers designed to perfect colour, shape, and symmetry.'],
  ['service-root.png','Root Canal Treatment','Advanced treatment that removes infection to preserve the natural tooth.'],
  ['service-crowns.png','Dental Crowns','Durable, aesthetic restorations that strengthen damaged or missing teeth.'],
  ['service-implants.png','Dental Implants','State-of-the-art implant solutions with exceptional stability.'],
  ['service-ortho.png','Orthodontics','Modern solutions for all ages, with comfortable and precise results.']
];
const treatmentGrid = document.querySelector('#treatment-grid');
document.querySelectorAll('[data-treatment]').forEach(link => link.addEventListener('click', () => {
  const select = document.querySelector('#appointment-service');
  if (select) {
    select.value = link.dataset.treatment;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
}));
if (treatmentGrid) treatmentGrid.innerHTML = treatments.map(t => `<article><img src="assets/${t[0]}" alt="${t[1]}"><div><h3>${t[1]}</h3><p>${t[2]}</p><a href="#contact">Learn More ${figmaIcon('arrow', 17)}</a></div></article>`).join('');

const doctors = [['doctor-1.png','Dr. Talaat Al-Qadi'],['doctor-2.png','Dr. Ghaeth Helal'],['doctor-3.png','Dr. May Abdelraouf'],['doctor-4.png','Dr. Manal Dandan']];
const teamGrid = document.querySelector('#team-grid');
if (teamGrid) teamGrid.innerHTML = doctors.map(d => `<article><img src="assets/${d[0]}" alt="${d[1]}"><h3>${d[1]}</h3><p>G.P. Dentist</p></article>`).join('');

const doctorProfiles = {
  mohamed:{name:'Dr. Mohamed Fadl',role:'General Practitioner with Implant Privilege',summary:'Dr. Mohamed Fadl is a General Practitioner with clinical experience in dental implant procedures under granted privileges. He has over 13 years of clinical experience, including two years in the UAE and extensive experience abroad.',image:null,experience:['13+ years of clinical experience','2 years of experience in the UAE','Clinical experience abroad','Dental implant procedures under granted privileges'],education:[['Bachelor of Dental Surgery','El Razi University']],expertise:['General dental care','Dental implant procedures under granted privileges']},
  talaat:{name:'Dr. Talaat Al-Qadi',role:'General Dentist',summary:'Dr. Talaat Al-Qadi is a General Dentist with 31 years of experience across the UAE, Saudi Arabia, and Syria. He has extensive experience across general and restorative dental treatments.',image:'assets/doctors-talaat.png',experience:['31 years of clinical experience','Registered in the UAE, Saudi Arabia, and Syria'],education:[['Bachelor in Dentistry','Aleppo University']],expertise:['Tooth extractions','Crowns and fillings','Root canal treatments','General dental care']},
  ghaeth:{name:'Dr. Ghaeth Helal',role:'General Dentist',summary:'Dr. Ghaeth Helal is a General Dentist with five years of experience in Syria and the UAE, with experience across cosmetic, restorative, and general dental care.',image:'assets/doctors-ghaeth.png',experience:['5 years of clinical experience','Experience in Syria and the UAE'],education:[['Bachelor of Dental Surgery','Damascus University']],expertise:['Cosmetic dentistry','Fillings','Crowns and bridges','General dental care']},
  may:{name:'Dr. May Abdelraouf',role:'General Dentist',summary:'Dr. May Abdelraouf is a General Dentist with 20 years of experience in the UAE. She holds a Master’s degree in Dental Laser and has extensive experience across general, restorative, and cosmetic dental treatments.',image:'assets/doctors-may.png',experience:['20 years of clinical experience in the UAE','Advanced training in dental laser treatment'],education:[['Bachelor of Dental Surgery','Misr University for Science and Technology'],['Master’s Degree in Dental Laser','RWTH Aachen University, Germany']],expertise:['Tooth extractions','Crowns and fillings','Root canal treatments','Cosmetic dental procedures']},
  manal:{name:'Dr. Manal Dandan',role:'General Dentist',summary:'Dr. Manal Dandan is a General Dentist with 29 years of experience in the UAE and extensive experience across cosmetic, restorative, and general dental care.',image:'assets/doctors-manal.png',experience:['29 years of clinical experience in the UAE'],education:[['Bachelor of Dental Surgery','Damascus University']],expertise:['Cosmetic dentistry','Root canal treatments','Crowns and veneers','Fillings and general dental care']},
  mustafa:{name:'Dr. Mustafa Ramzi',role:'General Dentist',summary:'Dr. Mustafa Ramzi is a General Dentist with 35 years of experience in the UAE and extensive experience across cosmetic, restorative, and general dental care.',image:null,experience:['35 years of clinical experience in the UAE'],education:[['Bachelor of Dental Surgery','Damascus University']],expertise:['Cosmetic dentistry','Root canal treatments','Crowns and bridges','General dental care']},
  amr:{name:'Dr. Amr Hassoun',role:'Orthodontist',summary:'Dr. Amr Hassoun is an Orthodontist with more than nine years of experience in Syria and the UAE.',image:null,experience:['9+ years of clinical experience','Experience in Syria and the UAE'],education:[['Bachelor in Dental Surgery','Damascus University'],['Master’s Degree in Orthodontics','Damascus University']],expertise:['Orthodontics']}
};
const profileName = document.querySelector('#profile-name');
if (profileName) {
  const key = new URLSearchParams(location.search).get('doctor') || 'talaat';
  const profile = doctorProfiles[key] || doctorProfiles.talaat;
  document.title = `${profile.name} — Al Manal Dental Center`;
  profileName.textContent = profile.name;
  document.querySelector('#profile-role').textContent = profile.role;
  document.querySelector('#profile-summary').textContent = profile.summary;
  const photo = document.querySelector('#profile-photo');
  const image = document.querySelector('#profile-image');
  image.src = profile.image || 'assets/logo-original.png';
  image.alt = profile.image ? profile.name : `Al Manal logo placeholder for ${profile.name}`;
  photo.classList.toggle('is-placeholder', !profile.image);
  document.querySelector('#profile-experience').innerHTML = profile.experience.map(item => `<li>${item}</li>`).join('');
  document.querySelector('#profile-education').innerHTML = profile.education.map(([degree,school]) => `<h3>${degree}</h3><p>${school}</p>`).join('');
  document.querySelector('#profile-expertise').innerHTML = profile.expertise.map(item => `<li>${item}</li>`).join('');
}

// Appointment flow: a service must be selected before the doctor field is available.
const appointmentService = document.querySelector('#appointment-service');
const appointmentDoctor = document.querySelector('#appointment-doctor');
if (appointmentService && appointmentDoctor) {
  appointmentService.addEventListener('change', () => {
    const hasService = Boolean(appointmentService.value);
    appointmentDoctor.disabled = !hasService;
    appointmentDoctor.innerHTML = hasService
      ? `<option value="">Select a doctor</option>${doctors.map(([, name]) => `<option>${name}</option>`).join('')}`
      : '<option value="">Select a service first</option>';
  });
}

// Shared accessible "More" navigation dropdown.
document.querySelectorAll('.nav').forEach(nav => {
  const moreLink = [...nav.children].find(item => item.textContent.trim().startsWith('More'));
  if (!moreLink) return;

  const dropdown = document.createElement('div');
  dropdown.className = `more-dropdown${moreLink.classList.contains('active') ? ' current' : ''}`;
  dropdown.innerHTML = `
    <button class="more-trigger" type="button" aria-expanded="false" aria-haspopup="true">
      <span>More</span><img class="more-chevron" src="assets/icons/chevron.svg" width="14" height="14" alt="" aria-hidden="true">
    </button>
    <div class="more-menu" role="menu">
      <a href="patient-guide.html" role="menuitem">Patient Guide</a>
      <a href="careers.html" role="menuitem">Careers</a>
      <a href="faqs.html" role="menuitem">FAQs</a>
      <a href="privacy-policy.html" role="menuitem">Privacy Policy</a>
    </div>`;
  moreLink.replaceWith(dropdown);

  const trigger = dropdown.querySelector('.more-trigger');
  const items = [...dropdown.querySelectorAll('.more-menu a')];
  const setOpen = open => {
    dropdown.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
    if (open) items[0].focus();
  };

  trigger.addEventListener('click', event => {
    event.stopPropagation();
    setOpen(!dropdown.classList.contains('open'));
  });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); }
  });
  dropdown.addEventListener('keydown', event => {
    const index = items.indexOf(document.activeElement);
    if (event.key === 'Escape') { setOpen(false); trigger.focus(); }
    if (event.key === 'ArrowDown') { event.preventDefault(); items[(index + 1) % items.length].focus(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); items[(index - 1 + items.length) % items.length].focus(); }
  });
  items.forEach(item => item.addEventListener('click', () => {
    setOpen(false);
    document.body.classList.remove('menu-open');
  }));
});

document.addEventListener('click', event => {
  document.querySelectorAll('.more-dropdown.open').forEach(dropdown => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
      dropdown.querySelector('.more-trigger').setAttribute('aria-expanded', 'false');
    }
  });
});

const toggle = document.querySelector('.menu-toggle');
const setMenuOpen = open => {
  document.body.classList.toggle('menu-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  if (!open) document.querySelectorAll('.more-dropdown.open').forEach(dropdown => {
    dropdown.classList.remove('open');
    dropdown.querySelector('.more-trigger').setAttribute('aria-expanded', 'false');
  });
};
if (toggle) toggle.addEventListener('click', event => {
  event.stopPropagation();
  setMenuOpen(!document.body.classList.contains('menu-open'));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('click', event => {
  if (document.body.classList.contains('menu-open') && !event.target.closest('.site-header')) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenuOpen(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1080) setMenuOpen(false);
});

document.querySelectorAll('form').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  if (form.classList.contains('subscribe')) {
    button.textContent = '✓';
    button.setAttribute('aria-label', 'Subscribed');
  } else {
    button.textContent = 'Request received ✓';
  }
  button.disabled = true;
}));

document.querySelectorAll('.faq-question').forEach(button => button.addEventListener('click', () => {
  const item = button.closest('.faq-item');
  const open = item.classList.toggle('open');
  button.setAttribute('aria-expanded', String(open));
}));

// Shared visual polish and motion, with accessibility-safe fallbacks.
const header = document.querySelector('.site-header');
document.querySelectorAll('.resource-footer p').forEach(paragraph => {
  const name = {'☎':'phone','✉':'email','◷':'clock'}[paragraph.textContent.trim()[0]];
  if (!name) return;
  const label = document.createElement('span');
  label.textContent = paragraph.textContent.trim().slice(1).trim();
  paragraph.innerHTML = figmaIcon(name, 20);
  paragraph.append(label);
  paragraph.classList.add('footer-contact-row');
});
document.querySelectorAll('.faq-question span').forEach(icon => {
  icon.innerHTML = figmaIcon('chevron', 14);
});
// Exact exported Figma assets; fixed dimensions prevent intrinsic SVG scaling.
document.querySelectorAll('.contact-cards i, .info-row i').forEach(icon => {
  const name = {'⌖':'location','☎':'phone','◷':'clock','✉':'email'}[icon.textContent.trim()];
  if (name) icon.innerHTML = figmaIcon(name, 20);
});
document.querySelectorAll('.metrics-grid i').forEach((icon, i) => {
  icon.innerHTML = figmaIcon(['patients','experience','rating','availability'][i % 4]);
});
document.querySelectorAll('.why-grid i').forEach((icon, i) => {
  icon.innerHTML = figmaIcon(['personal-care','professionals','artistic'][i % 3]);
});
document.querySelectorAll('.scroll-cue').forEach(icon => { icon.innerHTML = figmaIcon('arrow', 22); });
document.querySelectorAll('.subscribe button').forEach(button => {
  button.innerHTML = figmaIcon('send', 18);
  button.setAttribute('aria-label', 'Subscribe');
});
document.querySelectorAll('.socials a').forEach((link, i) => {
  link.innerHTML = figmaIcon(`social-${i + 1}`, 20);
  link.setAttribute('aria-label', ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'][i % 4]);
});
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(link => {
  const href = link.getAttribute('href')?.split('#')[0];
  if (href && href === currentPage) link.classList.add('active');
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('.hero-video');
const syncMotionPreference = event => {
  if (!heroVideo) return;
  if (event.matches) heroVideo.pause();
  else heroVideo.play().catch(() => {});
};
syncMotionPreference(reduceMotion);
reduceMotion.addEventListener?.('change', syncMotionPreference);


if (!reduceMotion.matches) {
  document.body.classList.add('motion-ready');
  const loadTargets = document.querySelectorAll('.site-header, .hero-video-bg, .hero-copy > *, .page-hero .eyebrow, .page-hero h1, .resource-hero > *');
  loadTargets.forEach((element, index) => {
    element.classList.add('load-target');
    element.style.setProperty('--load-delay', `${Math.min(index, 6) * 90}ms`);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => loadTargets.forEach(element => element.classList.add('load-visible'))));

  const revealTargets = document.querySelectorAll([
    '.section > *', '.resource-section > *', '.resource-band > *',
    '.insurance-section > *', '.gallery-section > *', '.apply-section > *',
    '.policy-content > *', '.page-hero > div',
    '.values-grid article', '.home-concept-grid article', '.team-grid article',
    '.experience-list article', '.services-cards article', '.services-support > *',
    '.about-story > *', '.about-purpose article', '.metrics-grid article', '.metrics-grid a', '.about-voice-values > *', '.about-values-list > div',
    '.doctors-top > *', '.doctors-grid article', '.contact-dashboard > *',
    '.contact-primary > *', '.contact-secondary > *', '.home-appointment > *',
    '.footer-main > *', '.footer-bottom > *'
  ].join(','));
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-target');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
  });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }
}

const enquiryType = new URLSearchParams(window.location.search).get('enquiry');
if (enquiryType === 'packages') {
  const contactService = document.querySelector('#contact-form select[name="service"]');
  if (contactService) contactService.value = 'Packages & Offers';
}
