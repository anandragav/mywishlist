import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Extension is initializing...');

// Handle side panel opening
if (typeof chrome !== 'undefined' && chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log('Root element found, mounting app...');
  createRoot(rootElement).render(<App />);
} else {
  console.error('Root element not found! Check if index.html has a div with id="root"');
}