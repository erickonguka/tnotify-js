# tnotify-js
A lightweight, draggable notification library with type-specific animations.

# TNotify

A lightweight, draggable notification library with type-specific animations.

## Overview

TNotify is a vanilla JavaScript notification system that uses Tailwind CSS for styling. It supports success, failure, and info notifications with unique animations, and allows users to drag the notification container anywhere on the page. The position is saved in `localStorage` for future use.

- **Features**: Draggable container, type-specific animations, hover/click effects.
- **Dependencies**: None (Tailwind CSS optional via CDN).
- **Size**: Minimal, no external libraries required.

## Installation

1. **Add the HTML Container**:
   Include the notification container in your HTML:
   ```html
   <div id="tnotify-container" class="fixed top-4 right-4 space-y-2 z-50"></div>
Include Tailwind CSS (optional, for styling): Add the CDN to your <head>:
html
 
 
<script src="https://cdn.tailwindcss.com"></script>
Add TNotify Script: Include the tnotify.js file before the closing </body> tag:
html
 
 
<script src="tnotify.js"></script>
Serve Your Project: Use a local server (e.g., python -m http.server) to test, as localStorage requires a hosted environment.
Usage
Basic Usage
Trigger a notification with JavaScript:

javascript
 
 
TNotify.show({ content: 'Hello, world!' });
Customization Options
Pass an object to TNotify.show() with these properties:

type: 'success', 'failure', or 'info' (default: 'info')
header: Optional title text (string)
content: Main message text (string, required)
bgColor: Tailwind background color class (e.g., 'bg-green-500', default: 'bg-gray-800')
textColor: Tailwind text color class (e.g., 'text-white', default: 'text-white')
timeout: Duration in milliseconds before auto-dismiss (default: 5000, set to 0 to disable)
Methods
TNotify.show(options): Display a notification.
TNotify.clear(): Remove all notifications.
Dragging
Click and drag the #tnotify-container to reposition it. The new position is saved and reused on page reload.

HTML Examples
1. Basic Success
html
 
 
<button onclick="TNotify.show({ type: 'success', content: 'Task completed!' })">Basic Success</button>
Simple success notification with bounce animation.

2. Styled Success
html
 
 
<button onclick="TNotify.show({ type: 'success', header: 'Success', content: 'Task done!', bgColor: 'bg-green-500', textColor: 'text-white' })">Styled Success</button>
Success with header and green styling.

3. Basic Failure
html
 
 
<button onclick="TNotify.show({ type: 'failure', content: 'Task failed.' })">Basic Failure</button>
Simple failure notification with shake animation.

4. Fast Failure
html
 
 
<button onclick="TNotify.show({ type: 'failure', header: 'Error', content: 'Critical error!', bgColor: 'bg-red-500', timeout: 2000 })">Fast Failure</button>
Failure with red color and 2-second timeout.

5. Basic Info
html
 
 
<button onclick="TNotify.show({ type: 'info', content: 'Heads up!' })">Basic Info</button>
Simple info notification with slide animation.

6. Sticky Info
html
 
 
<button onclick="TNotify.show({ type: 'info', header: 'Info', content: 'Sticky note.', bgColor: 'bg-blue-600', textColor: 'text-yellow-200', timeout: 0 })">Sticky Info</button>
Info with no timeout, stays until closed.

7. Clear All
html
 
 
<button onclick="TNotify.clear()">Clear All</button>
Removes all active notifications.

Animations
Success: Bounces in, fades out upward.
Failure: Shakes in, implodes out.
Info: Slides in, slides out.
Hover: Scales up and tilts.
Click: Quick scale-down pulse.
Customization
Modify styles in tnotify.js’s <style> block or override with your own CSS. Use Tailwind classes for bgColor and textColor.

License
MIT License - Free to use, modify, and distribute.

Happy notifying with TNotify!

text
 
 

---

### **Notes:**
- The `README.md` covers setup, usage, and all HTML examples with 10-word descriptions.
- The updated `index.html` includes all possible use cases from the README.
- The `tnotify.js` file remains unchanged from the previous version, as it already supports these features.

To use this:
1. Save `index.html`, `tnotify.js`, and `README.md` in a folder.
2. Serve it locally (e.g., `python -m http.server` or just double click on the index.html haha).
3. Test the buttons and drag the container to see TNotify in action.

Let me know if you’d like to tweak the README further or add more examples!
