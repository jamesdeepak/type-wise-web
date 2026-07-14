// Core Touch Typing Engine

class TypingEngine {
  constructor(text, containerEl, options = {}) {
    this.text = text;
    this.containerEl = containerEl;
    this.options = {
      onKeypress: () => {},
      onComplete: () => {},
      onUpdate: () => {},
      soundEnabled: true,
      readAloudEnabled: false,
      keyboardLayout: 'QWERTY',
      ...options
    };

    this.reset(text);
    this.initAudio();
  }

  initAudio() {
    // Web Audio API for feedback sounds
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported.');
    }
  }

  playBeep(frequency, duration) {
    if (!this.options.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be suspended by browser autoplay policy
    }
  }

  playCorrectSound() {
    this.playBeep(800, 0.08);
  }

  playErrorSound() {
    this.playBeep(180, 0.15);
  }

  reset(text) {
    this.text = text;
    this.currentIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.errorsCount = 0;
    this.keyErrors = {};
    this.isStarted = false;
    this.isFinished = false;
    this.totalTypedChars = 0;

    // Render initial text in container
    if (this.containerEl) {
      this.containerEl.innerHTML = '';
      for (let i = 0; i < this.text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char' + (i === 0 ? ' current' : '');
        // Preserve newlines, double spaces, etc.
        if (this.text[i] === '\n') {
          span.innerHTML = '&crarr;<br>';
        } else if (this.text[i] === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = this.text[i];
        }
        this.containerEl.appendChild(span);
      }
    }
  }

  // Handle typing input
  handleInput(char) {
    if (this.isFinished) return;

    if (!this.isStarted) {
      this.isStarted = true;
      this.startTime = Date.now();
      
      // Read Aloud fact at start if enabled
      if (this.options.readAloudEnabled) {
        this.speakText(this.text);
      }
    }

    const targetChar = this.text[this.currentIndex];
    const spanElements = this.containerEl ? this.containerEl.children : [];
    const currentSpan = spanElements[this.currentIndex];

    // Total characters clicked
    this.totalTypedChars++;

    if (char === targetChar) {
      // Correct character
      if (currentSpan) {
        currentSpan.className = 'char correct';
      }
      this.playCorrectSound();
      this.currentIndex++;
    } else {
      // Incorrect character
      if (currentSpan) {
        currentSpan.className = 'char incorrect';
      }
      this.playErrorSound();
      this.errorsCount++;
      // Log errors on key
      const keyName = targetChar.toLowerCase();
      this.keyErrors[keyName] = (this.keyErrors[keyName] || 0) + 1;
    }

    // Scroll container to keep typing line centered if needed
    if (currentSpan && this.containerEl) {
      const topPos = currentSpan.offsetTop;
      this.containerEl.scrollTop = topPos - 30;
    }

    // Set next current active index
    if (this.currentIndex < this.text.length) {
      const nextSpan = spanElements[this.currentIndex];
      if (nextSpan) {
        nextSpan.className = 'char current';
      }
      this.options.onKeypress(char, targetChar);
      this.options.onUpdate(this.getState());
    } else {
      // Finished
      this.isFinished = true;
      this.endTime = Date.now();
      
      if (this.options.readAloudEnabled) {
        window.speechSynthesis.cancel();
      }

      this.options.onComplete(this.getState());
    }
  }

  // Speech synthesis helper
  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[\r\n]+/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Get active statistics
  getState() {
    const elapsed = this.getElapsedTime(); // seconds
    const wpm = this.calculateWpm(elapsed);
    const accuracy = this.calculateAccuracy();

    return {
      wpm,
      accuracy,
      elapsed,
      errors: this.errorsCount,
      progress: Math.round((this.currentIndex / this.text.length) * 100),
      isFinished: this.isFinished,
      keyErrors: this.keyErrors,
      nextChar: this.isFinished ? null : this.text[this.currentIndex]
    };
  }

  getElapsedTime() {
    if (!this.startTime) return 0;
    const end = this.endTime ? this.endTime : Date.now();
    return (end - this.startTime) / 1000; // in seconds
  }

  calculateWpm(seconds) {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    // Standard: 5 characters = 1 word
    const words = this.currentIndex / 5;
    return Math.round(words / minutes);
  }

  calculateAccuracy() {
    if (this.totalTypedChars === 0) return 100;
    const correct = this.totalTypedChars - this.errorsCount;
    return Math.round((correct / this.totalTypedChars) * 100);
  }

  // Map keyboard characters to fingers
  static getFingerForChar(char, layout = 'QWERTY') {
    if (!char) return null;
    let c = char.toLowerCase();

    // Map spacebar
    if (c === ' ') return 'Thumb';

    // Standard QWERTY mapping
    const fingerMaps = {
      'Left Pinky': ['q', 'a', 'z', '1', '!', '`', '~', 'tab', 'capslock', 'shift', 'ctrl'],
      'Left Ring': ['w', 's', 'x', '2', '@'],
      'Left Middle': ['e', 'd', 'c', '3', '#'],
      'Left Index': ['r', 't', 'f', 'g', 'v', 'b', '4', '5', '$', '%'],
      'Right Index': ['y', 'u', 'h', 'j', 'n', 'm', '6', '7', '^', '&'],
      'Right Middle': ['i', 'k', ',', '<', '8', '*'],
      'Right Ring': ['o', 'l', '.', '>', '9', '('],
      'Right Pinky': [
        'p', ';', ':', '/', '?', '0', ')', '-', '_', '=', '+', '[', '{', ']', '}',
        '\'', '"', '\\', '|', 'enter', 'backspace'
      ]
    };

    // If keyboard is Dvorak, map keys to different fingers
    if (layout === 'Dvorak') {
      const dvorakMaps = {
        'Left Pinky': ['\'', '"', 'a', ';', ':', '1', '!', '`', '~'],
        'Left Ring': [',', '<', 'o', 'q', '2', '@'],
        'Left Middle': ['.', '>', 'e', 'j', '3', '#'],
        'Left Index': ['p', 'y', 'u', 'i', 'k', 'x', '4', '5', '$', '%'],
        'Right Index': ['f', 'g', 'd', 'h', 'c', 't', 'm', 'w', 'v', 'z', '6', '7', '^', '&'],
        'Right Middle': ['c', 't', 'n', '8', '*'],
        'Right Ring': ['r', 's', 'l', '9', '('],
        'Right Pinky': ['l', 'o', 'r', 's', 't', 'n', 'e', 'i', 'p', '0', ')', '[', '{', ']', '}', '=', '+', '-', '_', '\\', '|']
      };
      for (const [finger, list] of Object.entries(dvorakMaps)) {
        if (list.includes(c)) return finger;
      }
    }

    // Default to lookup standard QWERTY
    for (const [finger, list] of Object.entries(fingerMaps)) {
      if (list.includes(c)) return finger;
    }

    return null;
  }
}

// Attach to window
window.TypingEngine = TypingEngine;
