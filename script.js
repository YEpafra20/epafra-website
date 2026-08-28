/* UI behavior is kept separate from content so future data edits remain safe. */
document.addEventListener('DOMContentLoaded', () => {
  const icons = () => window.lucide?.createIcons();
  const root = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('epafra-theme');
  if (savedTheme === 'dark') root.classList.add('dark');
  themeToggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('epafra-theme', root.classList.contains('dark') ? 'dark' : 'light');
  });
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

  const skillsGrid = document.querySelector('#skills-grid');
  skillsGrid.innerHTML = portfolioData.skills.map(skill => `<article class="skill-card reveal"><div class="skill-icon"><i data-lucide="${skill.icon}"></i></div><h3>${skill.title}</h3><p>${skill.description}</p><div class="skill-tags">${skill.tags}</div></article>`).join('');
  document.querySelector('#project-grid').innerHTML = portfolioData.projects.map(project => `<article class="experience-card reveal"><div class="experience-header"><span class="org-logo ${project.logoClass}"><span>${project.logo}</span><img src="${project.logoUrl}" alt="${project.organization} logo" loading="eager" onerror="this.hidden=true"></span><div><div class="project-type">${project.type}</div><h3>${project.title}</h3><div class="organization">${project.organization}</div></div></div><div class="period">${project.period || 'Internship experience'}</div><p>${project.description}</p><div class="experience-skills">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div></article>`).join('');
  const certificationCards = portfolioData.certifications.map(cert => `<article class="cert-card"><a href="${cert.url}" target="_blank" rel="noreferrer" aria-label="View ${cert.name} credential"><span class="cert-mark"><span class="cert-logo-text">${cert.mark}</span><img src="${cert.logo}" alt="${cert.name} logo" loading="eager" decoding="sync" onerror="this.hidden=true"></span><div><h3>${cert.name}</h3><p>${cert.issuer} · View credential ↗</p></div></a></article>`).join('');
  document.querySelector('#cert-grid').innerHTML = `<div class="cert-rail"><div class="cert-track">${certificationCards}${certificationCards}</div></div>`;

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

  document.querySelector('#contact-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button');
    button.disabled = true;
    status.textContent = 'Sending your message...';
    try {
      const response = await fetch(new URL(form.action, window.location.href), { method: form.method.toUpperCase(), body: new FormData(form), headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || `Server error (${response.status}).`);
      status.textContent = result.message;
      form.reset();
    } catch (error) {
      status.textContent = error.message.includes('Failed to fetch') ? 'The form could not reach the server. Please email yepafra1@gmail.com directly.' : error.message;
    } finally { button.disabled = false; }
  });
  icons();
});
