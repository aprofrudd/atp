// shared/tutorial.js — Reusable tutorial step system

export class TutorialManager {
  /**
   * @param {Object} config
   * @param {number} config.stepCount — total steps
   * @param {string[]} config.accents — accent color per step (1-indexed, index 0 unused)
   * @param {string[]} config.descriptions — HTML description per step (0-indexed)
   * @param {Function} config.onEnter — called when tutorial starts
   * @param {Function} config.onExit — called when tutorial exits
   * @param {Function} config.onStepChange — called with step number on each change
   */
  constructor(config) {
    this.stepCount = config.stepCount;
    this.accents = config.accents;
    this.descriptions = config.descriptions;
    this.onEnter = config.onEnter || (() => {});
    this.onExit = config.onExit || (() => {});
    this.onStepChange = config.onStepChange || (() => {});

    this.currentStep = null; // null = free-run

    this._buildDOM();
  }

  _buildDOM() {
    const bar = document.getElementById('tutorial-bar');
    if (!bar) return;
    this.barEl = bar;

    // Build step dots
    const stepsContainer = bar.querySelector('.tutorial-steps');
    stepsContainer.innerHTML = '';
    for (let i = 1; i <= this.stepCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'step-dot';
      btn.dataset.step = i;
      btn.style.setProperty('--accent', this.accents[i] || '#FFD700');
      btn.textContent = i;
      btn.addEventListener('click', () => this.goToStep(i));
      stepsContainer.appendChild(btn);
    }

    // Bind nav buttons
    this.prevBtn = bar.querySelector('#prev-step');
    this.nextBtn = bar.querySelector('#next-step');
    this.exitBtn = bar.querySelector('#exit-tutorial');

    this.prevBtn.addEventListener('click', () => this.prevStep());
    this.nextBtn.addEventListener('click', () => this.nextStep());
    this.exitBtn.addEventListener('click', () => this.exit());
  }

  enter() {
    this.currentStep = 1;
    this.onEnter();
    document.getElementById('controls').style.display = 'none';
    this.barEl.classList.add('active');
    const howBtn = document.getElementById('how-btn');
    if (howBtn) howBtn.classList.add('active');
    this._updateUI();
    this.onStepChange(this.currentStep);
  }

  exit() {
    this.currentStep = null;
    this.onExit();
    this.barEl.classList.remove('active');
    document.getElementById('controls').style.display = '';
    const howBtn = document.getElementById('how-btn');
    if (howBtn) howBtn.classList.remove('active');
  }

  goToStep(n) {
    if (n < 1 || n > this.stepCount) return;
    this.currentStep = n;
    this._updateUI();
    this.onStepChange(n);
  }

  prevStep() {
    if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
  }

  nextStep() {
    if (this.currentStep < this.stepCount) this.goToStep(this.currentStep + 1);
  }

  get isActive() {
    return this.currentStep !== null;
  }

  _updateUI() {
    const n = this.currentStep;
    this.barEl.querySelectorAll('.step-dot').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.step) === n);
    });
    this.prevBtn.disabled = (n <= 1);
    this.nextBtn.disabled = (n >= this.stepCount);
    const descEl = document.getElementById('step-description');
    if (descEl && this.descriptions.length >= n) {
      descEl.innerHTML = this.descriptions[n - 1];
    }
  }
}
