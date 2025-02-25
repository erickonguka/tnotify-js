const TNotify = {
  // Default settings
  defaults: {
    type: 'info',         // 'success', 'failure', 'info'
    header: '',
    content: 'Notification',
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
    timeout: 5000         // 0 to disable
  },

  // State
  positions: [], // Track notification heights for stacking

  // Initialize container position from localStorage
  init: function() {
    const container = document.getElementById('tnotify-container');
    const savedPos = localStorage.getItem('tnotify-position');
    if (savedPos) {
      const { top, left } = JSON.parse(savedPos);
      container.style.top = `${top}px`;
      container.style.left = `${left}px`;
      container.style.right = 'auto'; // Override default right positioning
    }

    // Make container draggable
    this.makeDraggable(container);
  },

  // Generate unique ID
  generateId: function() {
    return 'tnotify-' + Math.random().toString(36).substr(2, 9);
  },

  // Make an element draggable
  makeDraggable: function(element) {
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    element.onmousedown = (e) => {
      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      element.style.cursor = 'grabbing';
    };

    document.onmousemove = (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        element.style.left = `${currentX}px`;
        element.style.top = `${currentY}px`;
        element.style.right = 'auto'; // Ensure it follows drag
      }
    };

    document.onmouseup = () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = 'grab';
        // Save position to localStorage
        localStorage.setItem('tnotify-position', JSON.stringify({
          top: currentY,
          left: currentX
        }));
      }
    };

    // Set initial position for dragging
    const rect = element.getBoundingClientRect();
    currentX = rect.left;
    currentY = rect.top;
    element.style.cursor = 'grab';
  },

  // Show notification
  show: function(options) {
    const settings = { ...this.defaults, ...options };
    const id = this.generateId();

    // Build HTML
    const notify = document.createElement('div');
    notify.id = id;
    notify.className = `tnotify p-4 rounded-lg shadow-lg flex items-start space-x-3 max-w-sm ${settings.bgColor} ${settings.textColor} animate-${settings.type}-in`;
    notify.dataset.type = settings.type;

    // Icon based on type
    const icons = {
      success: `<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
      failure: `<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
      info: `<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 18h.01"></path></svg>`
    };
    notify.innerHTML = icons[settings.type] || '';

    // Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex-1';
    if (settings.header) {
      contentDiv.innerHTML += `<div class="font-bold">${settings.header}</div>`;
    }
    contentDiv.innerHTML += `<div>${settings.content}</div>`;
    notify.appendChild(contentDiv);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn ml-2 text-gray-400 hover:text-gray-200';
    closeBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    closeBtn.onclick = () => this.close(id);
    notify.appendChild(closeBtn);

    // Add to container
    const container = document.getElementById('tnotify-container');
    container.appendChild(notify);

    // Position with stacking
    notify.style.top = `${this.getNextPosition(notify)}px`;

    // Auto-dismiss
    if (settings.timeout > 0) {
      setTimeout(() => this.close(id), settings.timeout);
    }

    // Interaction events
    notify.onmouseover = () => notify.classList.add('hover-anim');
    notify.onmouseout = () => notify.classList.remove('hover-anim');
    notify.onclick = (e) => {
      if (e.target !== closeBtn) {
        notify.classList.add('click-anim');
        setTimeout(() => notify.classList.remove('click-anim'), 300);
      }
    };

    this.positions.push({ id, height: notify.offsetHeight });
    return id;
  },

  // Calculate next position for stacking
  getNextPosition: function(notify) {
    let totalHeight = 0;
    this.positions.forEach(pos => totalHeight += pos.height + 8);
    return totalHeight;
  },

  // Close notification
  close: function(id) {
    const notify = document.getElementById(id);
    if (notify) {
      notify.classList.remove(`animate-${notify.dataset.type}-in`);
      notify.classList.add(`animate-${notify.dataset.type}-out`);
      setTimeout(() => {
        notify.remove();
        this.positions = this.positions.filter(pos => pos.id !== id);
      }, 500);
    }
  },

  // Clear all
  clear: function() {
    const container = document.getElementById('tnotify-container');
    container.innerHTML = '';
    this.positions = [];
  }
};

// Initialize
TNotify.init();
window.TNotify = TNotify;

// Add CSS animations
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .tnotify { position: relative; transition: all 0.3s ease; }
    #tnotify-container { transition: all 0.1s ease; }

    /* Type-specific entrance animations */
    .animate-success-in {
      animation: bounceIn 0.6s ease-out forwards;
    }
    .animate-failure-in {
      animation: shakeIn 0.5s ease forwards;
    }
    .animate-info-in {
      animation: slideIn 0.4s ease-out forwards;
    }

    /* Type-specific exit animations */
    .animate-success-out {
      animation: fadeOutUp 0.5s ease forwards;
    }
    .animate-failure-out {
      animation: implode 0.5s ease forwards;
    }
    .animate-info-out {
      animation: slideOut 0.5s ease forwards;
    }

    /* Interaction animations */
    .hover-anim { transform: scale(1.05) rotate(2deg); }
    .click-anim { transform: scale(0.95); transition: transform 0.1s; }

    /* Keyframes */
    @keyframes bounceIn {
      0% { opacity: 0; transform: translateY(-50px); }
      60% { opacity: 1; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes shakeIn {
      0% { opacity: 0; transform: translateX(100px); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-2px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideIn {
      0% { opacity: 0; transform: translateX(100px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeOutUp {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
    @keyframes implode {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0); }
    }
    @keyframes slideOut {
      0% { opacity: 1; transform: translateX(0); }
      100% { opacity: 0; transform: translateX(100px); }
    }
  </style>
`);
