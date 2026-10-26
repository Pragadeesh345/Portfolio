// Mobile navigation
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation' : 'Open navigation'
    );
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    });
  });
}

// Project architecture notes shown in the dialog.
const projectNotes = {
  recruit: {
    category: 'AI / WORKFLOW AUTOMATION',
    title: 'Recruit AI — Architecture Notes',
    intro:
      'A workflow concept for turning incoming job emails into more structured, useful job information. The main idea is to connect automation, language-model analysis, and storage rather than manually checking every message.',
    flow: [
      'Email trigger',
      'Parse & clean',
      'LLM job analysis',
      'Structured output',
      'MySQL storage',
    ],
    parts: [
      [
        '1. Ingestion',
        'An email workflow watches for job-related messages and passes relevant content to the next steps.',
      ],
      [
        '2. Analysis',
        'An LLM-based step helps interpret the job description and produce structured fields that are easier to review.',
      ],
      [
        '3. Persistence & interface',
        'Structured job information can be stored in MySQL and surfaced through a lightweight application interface.',
      ],
      [
        'Design considerations',
        'Validate model output, handle malformed emails, protect personal data, and keep a human review step for uncertain or suspicious listings.',
      ],
    ],
  },
  resume: {
    category: 'NLP / WEB APPLICATION',
    title: 'Resume Analyzer — Architecture Notes',
    intro:
      'A small web application that accepts resume and job-description text, processes the content, and produces a relevance estimate to support a more focused review.',
    flow: [
      'PDF upload',
      'Text extraction',
      'Text normalization',
      'Matching logic',
      'Score & results',
    ],
    parts: [
      [
        '1. Input handling',
        'The user provides a resume file and a job description. The app extracts text from the PDF and validates the inputs.',
      ],
      [
        '2. Text processing',
        'Text is cleaned and represented for comparison. The score is a heuristic relevance signal, not a hiring decision or a guarantee of suitability.',
      ],
      [
        '3. Application layer',
        'A FastAPI endpoint connects the input, processing logic, and result view; SQLite can retain application records.',
      ],
      [
        'Limitations',
        'PDF extraction quality, keyword overlap, formatting, and the choice of matching method can affect the score. Human review remains important.',
      ],
    ],
  },
  fraud: {
    category: 'MACHINE LEARNING / CLASSIFICATION',
    title: 'Credit Card Fraud Detection — Architecture Notes',
    intro:
      'A classification project exploring how transaction data can be used to distinguish potentially fraudulent activity from normal transactions.',
    flow: [
      'Transaction data',
      'Preprocessing',
      'Train/test split',
      'Model comparison',
      'Evaluation',
    ],
    parts: [
      [
        '1. Data preparation',
        'Prepare the dataset, check class distribution, and ensure transformations are applied consistently.',
      ],
      [
        '2. Model experiments',
        'Compare classification approaches such as Logistic Regression, Random Forest, and Support Vector Machines.',
      ],
      [
        '3. Evaluation',
        'Consider precision, recall, F1-score, and the confusion matrix—not accuracy alone—because fraud datasets are often imbalanced.',
      ],
      [
        'Important caveat',
        'This is an educational project using a prepared dataset. Results depend on the dataset and split and should not be interpreted as production fraud detection performance.',
      ],
    ],
  },
};

const dialog = document.getElementById('architecture-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogCategory = document.getElementById('dialog-category');
const dialogContent = document.getElementById('dialog-content');

function openProjectNotes(key) {
  const note = projectNotes[key];

  if (!note || !dialog) return;

  dialogTitle.textContent = note.title;
  dialogCategory.textContent = note.category;
  dialogContent.replaceChildren();

  const intro = document.createElement('p');
  intro.textContent = note.intro;
  dialogContent.appendChild(intro);

  const flowHeading = document.createElement('h3');
  flowHeading.textContent = 'High-level flow';
  dialogContent.appendChild(flowHeading);

  const flow = document.createElement('div');
  flow.className = 'architecture-flow';

  note.flow.forEach((step, index) => {
    const chip = document.createElement('span');
    chip.textContent = step;
    flow.appendChild(chip);

    if (index < note.flow.length - 1) {
      const arrow = document.createElement('b');
      arrow.textContent = '→';
      flow.appendChild(arrow);
    }
  });

  dialogContent.appendChild(flow);

  note.parts.forEach(([heading, body]) => {
    const headingElement = document.createElement('h3');
    headingElement.textContent = heading;

    const paragraph = document.createElement('p');
    paragraph.textContent = body;

    dialogContent.append(headingElement, paragraph);
  });

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

// Connect each Architecture Notes button to its matching project details.
document.querySelectorAll('.architecture-btn').forEach((button) => {
  button.addEventListener('click', () => {
    openProjectNotes(button.dataset.project);
  });
});

function closeDialog() {
  if (dialog && typeof dialog.close === 'function') {
    dialog.close();
  } else if (dialog) {
    dialog.removeAttribute('open');
  }
}

document.getElementById('dialog-close')?.addEventListener('click', closeDialog);
document.getElementById('dialog-done')?.addEventListener('click', closeDialog);

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

// Prepare an email in the visitor's mail app; the form does not send it itself.
const mailForm = document.getElementById('mailto-form');

mailForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(mailForm);
  const senderName = String(data.get('senderName') || '').trim();
  const senderEmail = String(data.get('senderEmail') || '').trim();
  const subject = String(data.get('subject') || 'Opportunity to connect').trim();
  const body = String(data.get('body') || '').trim();
  const message = `${body}\n\n— ${senderName}${senderEmail ? `\n${senderEmail}` : ''}`;
  const mailto = `mailto:pragadeesh.a.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  window.location.href = mailto;
});

// Keep the copyright year current.
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
