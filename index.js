// ════════════════════════════════
// RESUME DATA STATE
// ════════════════════════════════
let resumeData = {
  firstName:  '',
  lastName:   '',
  jobTitle:   '',
  email:      '',
  phone:      '',
  location:   '',
  linkedin:   '',
  summary:    '',
  experience: [
    { company:'', role:'', startDate:'', endDate:'', description:'' }
  ],
  education: [
    { school:'', degree:'', year:'' }
  ],
  skills: ['Flutter', 'Java', 'Firebase', 'Android'],
  activeTemplate: 'classic'
};


// ════════════════════════════════
// SCREEN NAVIGATION
// ════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const tabs = ['home','builder','templates','export'];
  document.querySelectorAll('.nav-tab')[tabs.indexOf(id)].classList.add('active');
  if (id === 'export') syncExportScreen();
}


// ════════════════════════════════
// EDITOR TABS
// ════════════════════════════════
function switchTab(index) {
  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.editor-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.editor-tab')[index].classList.add('active');
  document.querySelectorAll('.editor-section')[index].classList.add('active');
}


// ════════════════════════════════
// LOCALSTORAGE
// ════════════════════════════════
function saveData() {
  localStorage.setItem('resumeForgeData', JSON.stringify(resumeData));
}

function loadData() {
  const saved = localStorage.getItem('resumeForgeData');
  if (!saved) return;
  resumeData = JSON.parse(saved);
  fillPersonalFields();
  renderExperience();
  renderEducation();
  renderSkills();
  updatePreview();
}

function fillPersonalFields() {
  ['firstName','lastName','jobTitle','email','phone','location','linkedin','summary']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = resumeData[id] || '';
    });
}


// ════════════════════════════════
// BIND PERSONAL FIELDS
// ════════════════════════════════
function bindPersonalFields() {
  ['firstName','lastName','jobTitle','email','phone','location','linkedin','summary']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        resumeData[id] = el.value;
        saveData();
        updatePreview();
      });
    });
}


// ════════════════════════════════
// LIVE PREVIEW
// ════════════════════════════════
function updatePreview() {
  const d = resumeData;
  const fullName = `${d.firstName} ${d.lastName}`.trim() || 'Your Name';

  set('preview-name',     fullName);
  set('preview-role',     d.jobTitle   || 'Job Title');
  set('preview-email',    d.email      || 'email@email.com');
  set('preview-phone',    d.phone      || 'Phone');
  set('preview-location', d.location   || 'Location');
  set('preview-summary',  d.summary    || '');

  const expEl = document.getElementById('preview-experience');
  if (expEl) {
    expEl.innerHTML = d.experience.map(e => `
      <div class="rp-item">
        <div class="rp-item-title">${e.role || 'Job Title'}</div>
        <div class="rp-item-sub">${e.company || 'Company'} · ${e.startDate || ''} – ${e.endDate || ''}</div>
        <div class="rp-item-desc">${e.description || ''}</div>
      </div>
    `).join('');
  }

  const eduEl = document.getElementById('preview-education');
  if (eduEl) {
    eduEl.innerHTML = d.education.map(e => `
      <div class="rp-item">
        <div class="rp-item-title">${e.degree || 'Degree'}</div>
        <div class="rp-item-sub">${e.school || 'School'} · ${e.year || ''}</div>
      </div>
    `).join('');
  }

  const skillEl = document.getElementById('preview-skills');
  if (skillEl) {
    skillEl.innerHTML = d.skills.map(s => `
      <div class="rp-skill-label">${s}</div>
      <div class="rp-skill-bar">
        <div class="rp-skill-fill" style="width:80%"></div>
      </div>
    `).join('');
  }
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}


// ════════════════════════════════
// TEMPLATE SWITCHING
// ════════════════════════════════
function switchTemplate(name) {
  resumeData.activeTemplate = name;
  saveData();

  // Update toolbar buttons in builder
  document.querySelectorAll('.tmpl-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.tmpl-btn[data-template="${name}"]`);
  if (btn) btn.classList.add('active');

  // Swap class on resume paper — this is what actually changes the look
  const paper = document.getElementById('resume-paper');
  if (paper) paper.className = `resume-paper template-${name}`;

  // Also swap class on export paper
  const exportPaper = document.getElementById('export-paper');
  if (exportPaper) exportPaper.className = `export-resume template-${name}`;
}

function selectTemplate(card, name) {
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  switchTemplate(name);
}


// ════════════════════════════════
// EXPERIENCE
// ════════════════════════════════
function renderExperience() {
  const container = document.getElementById('experience-container');
  if (!container) return;
  container.innerHTML = '';

  resumeData.experience.forEach((exp, i) => {
    const div = document.createElement('div');
    div.className = 'experience-entry';
    div.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">Entry ${i + 1}</span>
        <button class="entry-remove" onclick="removeExperience(${i})">✕</button>
      </div>
      <div class="field-group">
        <label class="field-label">Company</label>
        <input class="field-input" id="exp-company-${i}" type="text" placeholder="Company name" value="${exp.company || ''}"/>
      </div>
      <div class="field-group">
        <label class="field-label">Job Title</label>
        <input class="field-input" id="exp-role-${i}" type="text" placeholder="Your role" value="${exp.role || ''}"/>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">Start Date</label>
          <input class="field-input" id="exp-start-${i}" type="text" placeholder="Jan 2022" value="${exp.startDate || ''}"/>
        </div>
        <div class="field-group">
          <label class="field-label">End Date</label>
          <input class="field-input" id="exp-end-${i}" type="text" placeholder="Present" value="${exp.endDate || ''}"/>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Description</label>
        <textarea class="field-input" id="exp-desc-${i}" rows="3" placeholder="What did you do in this role?">${exp.description || ''}</textarea>
      </div>
    `;
    container.appendChild(div);

    [
      { id:`exp-company-${i}`, key:'company' },
      { id:`exp-role-${i}`,    key:'role' },
      { id:`exp-start-${i}`,   key:'startDate' },
      { id:`exp-end-${i}`,     key:'endDate' },
      { id:`exp-desc-${i}`,    key:'description' }
    ].forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        resumeData.experience[i][key] = el.value;
        saveData();
        updatePreview();
      });
    });
  });
}

function addExperience() {
  resumeData.experience.push({ company:'', role:'', startDate:'', endDate:'', description:'' });
  saveData();
  renderExperience();
}

function removeExperience(i) {
  if (resumeData.experience.length === 1) return;
  resumeData.experience.splice(i, 1);
  saveData();
  renderExperience();
  updatePreview();
}


// ════════════════════════════════
// EDUCATION
// ════════════════════════════════
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container) return;
  container.innerHTML = '';

  resumeData.education.forEach((edu, i) => {
    const div = document.createElement('div');
    div.className = 'experience-entry';
    div.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">Entry ${i + 1}</span>
        <button class="entry-remove" onclick="removeEducation(${i})">✕</button>
      </div>
      <div class="field-group">
        <label class="field-label">School / University</label>
        <input class="field-input" id="edu-school-${i}" type="text" placeholder="University name" value="${edu.school || ''}"/>
      </div>
      <div class="field-group">
        <label class="field-label">Degree</label>
        <input class="field-input" id="edu-degree-${i}" type="text" placeholder="BSc Computer Science" value="${edu.degree || ''}"/>
      </div>
      <div class="field-group">
        <label class="field-label">Year Graduated</label>
        <input class="field-input" id="edu-year-${i}" type="text" placeholder="2020" value="${edu.year || ''}"/>
      </div>
    `;
    container.appendChild(div);

    [
      { id:`edu-school-${i}`, key:'school' },
      { id:`edu-degree-${i}`, key:'degree' },
      { id:`edu-year-${i}`,   key:'year' }
    ].forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        resumeData.education[i][key] = el.value;
        saveData();
        updatePreview();
      });
    });
  });
}

function addEducation() {
  resumeData.education.push({ school:'', degree:'', year:'' });
  saveData();
  renderEducation();
}

function removeEducation(i) {
  if (resumeData.education.length === 1) return;
  resumeData.education.splice(i, 1);
  saveData();
  renderEducation();
  updatePreview();
}


// ════════════════════════════════
// SKILLS
// ════════════════════════════════
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;
  container.innerHTML = resumeData.skills.map((skill, i) => `
    <div class="skill-tag">
      ${skill}
      <span onclick="removeSkill(${i})">✕</span>
    </div>
  `).join('');
}

function addSkill() {
  const input = document.getElementById('skill-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  resumeData.skills.push(val);
  input.value = '';
  saveData();
  renderSkills();
  updatePreview();
}

function removeSkill(i) {
  resumeData.skills.splice(i, 1);
  saveData();
  renderSkills();
  updatePreview();
}


// ════════════════════════════════
// SYNC EXPORT SCREEN
// ════════════════════════════════
function syncExportScreen() {
  const d = resumeData;
  const fullName = `${d.firstName} ${d.lastName}`.trim() || 'Your Name';

  set('export-name',     fullName);
  set('export-role',     d.jobTitle  || 'Job Title');
  set('export-email',    d.email     || '');
  set('export-phone',    d.phone     || '');
  set('export-location', d.location  || '');
  set('export-summary',  d.summary   || '');

  const expEl = document.getElementById('export-experience');
  if (expEl) {
    expEl.innerHTML = d.experience.map(e => `
      <div class="er-item">
        <div class="er-item-title">${e.role || ''}</div>
        <div class="er-item-meta">${e.company || ''} · ${e.startDate || ''} – ${e.endDate || ''}</div>
        <div class="er-item-desc">${e.description || ''}</div>
      </div>
    `).join('');
  }

  const eduEl = document.getElementById('export-education');
  if (eduEl) {
    eduEl.innerHTML = d.education.map(e => `
      <div class="er-item">
        <div class="er-item-title">${e.degree || ''}</div>
        <div class="er-item-meta">${e.school || ''} · ${e.year || ''}</div>
      </div>
    `).join('');
  }

  const skillEl = document.getElementById('export-skills');
  if (skillEl) {
    skillEl.innerHTML = d.skills.map(s => `
      <div class="er-skill">
        <div class="er-skill-name"><span>${s}</span></div>
        <div class="er-skill-bar">
          <div class="er-skill-fill" style="width:80%"></div>
        </div>
      </div>
    `).join('');
  }

  // Apply template to export paper too
  const exportPaper = document.getElementById('export-paper');
  if (exportPaper) exportPaper.className = `export-resume template-${d.activeTemplate}`;
}


// ════════════════════════════════
// PDF DOWNLOAD
// ════════════════════════════════
function downloadPDF() {
  syncExportScreen();
  const element = document.getElementById('export-paper');
  const options = {
    margin:      0,
    filename:    `${resumeData.firstName || 'My'}_Resume.pdf`,
    image:       { type:'jpeg', quality:0.98 },
    html2canvas: { scale:2, useCORS:true },
    jsPDF:       { unit:'mm', format:'a4', orientation:'portrait' }
  };
  html2pdf().set(options).from(element).save();
}


// ════════════════════════════════
// INIT
// ════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  bindPersonalFields();
  renderExperience();
  renderEducation();
  renderSkills();
  updatePreview();
  switchTemplate(resumeData.activeTemplate || 'classic');

  // Enter key to add skill
  const skillInput = document.getElementById('skill-input');
  if (skillInput) {
    skillInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') addSkill();
    });
  }
});