const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/app/[locale]/globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/rgba\(255,\s*255,\s*255/g, 'rgba(var(--color-white-rgb)');
css = css.replace(/rgba\(0,\s*0,\s*0/g, 'rgba(var(--color-black-rgb)');

// Add new root variables for Light Mode and .dark class for Dark Mode
const variablesBlock = `
:root {
  /* Default Light Mode Theme */
  --bg-dark: #F8FAFC;
  --bg-panel: #FFFFFF;
  --bg-glass: rgba(255, 255, 255, 0.85);
  --bg-glass-hover: rgba(255, 255, 255, 1);
  --accent-cyan: #00C4CC;
  --accent-teal: #00999E;
  --text-primary: #0F172A;
  --text-secondary: #334155;
  --text-muted: #64748B;
  
  --border-glass: rgba(0, 196, 204, 0.2);
  --glow-cyan: 0 4px 12px rgba(0, 196, 204, 0.15);
  --glow-cyan-strong: 0 8px 24px rgba(0, 196, 204, 0.3);

  --color-white-rgb: 15, 23, 42;  /* Overlays turn dark in light mode */
  --color-black-rgb: 255, 255, 255; /* Shadows/Dark overlays turn light */
  
  --card-glow: 0, 196, 204;
}

.dark {
  /* Obsidian Black Theme */
  --bg-dark: #0B0C10;
  --bg-panel: #1F2833;
  --bg-glass: rgba(31, 40, 51, 0.5);
  --bg-glass-hover: rgba(31, 40, 51, 0.75);
  --accent-cyan: #66FCF1;
  --accent-teal: #45A29E;
  --text-primary: #FFFFFF;
  --text-secondary: #C5C6C7;
  --text-muted: #888888;
  
  --border-glass: rgba(102, 252, 241, 0.15);
  --glow-cyan: 0 0 15px rgba(102, 252, 241, 0.4);
  --glow-cyan-strong: 0 0 25px rgba(102, 252, 241, 0.8);

  --color-white-rgb: 255, 255, 255;
  --color-black-rgb: 0, 0, 0;

  --card-glow: 102, 252, 241;
}
`;

// Replace the original :root block
css = css.replace(/:root\s*\{[\s\S]*?\}\n/, variablesBlock);

fs.writeFileSync(cssPath, css);
console.log('CSS optimized for Light/Dark mode toggle successfully.');
