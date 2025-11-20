/**
 * Generates HTML content for the API request webview
 */
export function getWebviewContent(initialState: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>REST API Tester</title>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
      <noscript><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></noscript>
      <style>
        :root {
          /* Postman-Inspired Professional Color Palette */
          --primary: #FF6C37;
          --primary-dark: #E85C2A;
          --primary-light: #FF8A5B;
          --primary-accent: #D94E1F;
          --secondary: #5F6368;
          --secondary-dark: #4A4D50;
          --accent: #FF6C37;
          --success: #00C853;
          --success-dark: #00A843;
          --error: #F44336;
          --error-dark: #D32F2F;
          --warning: #FFA726;
          --warning-dark: #FB8C00;
          --info: #2196F3;
          
          /* Professional Gray Scale (Postman-like) */
          --white: #ffffff;
          --gray-25: #FAFAFA;
          --gray-50: #F5F5F5;
          --gray-100: #EEEEEE;
          --gray-200: #E0E0E0;
          --gray-300: #BDBDBD;
          --gray-400: #9E9E9E;
          --gray-500: #757575;
          --gray-600: #616161;
          --gray-700: #424242;
          --gray-800: #303030;
          --gray-900: #212121;
          --gray-950: #121212;
          
          /* Clean Surface Colors */
          --surface: #ffffff;
          --surface-hover: #F5F5F5;
          --surface-active: #EEEEEE;
          --border: #E0E0E0;
          --border-hover: #BDBDBD;
          --border-focus: var(--primary);
          
          /* Method Colors (Postman-style) */
          --method-get: #00C853;
          --method-post: #FF6C37;
          --method-put: #2196F3;
          --method-delete: #F44336;
          --method-patch: #9C27B0;
          --method-head: #00BCD4;
          --method-options: #757575;
          
          /* Minimal Glassmorphism */
          --glass-bg: rgba(255, 255, 255, 0.98);
          --glass-border: rgba(0, 0, 0, 0.08);
          --glass-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          
          /* Clean Professional Gradients */
          --gradient-primary: linear-gradient(135deg, #FF6C37 0%, #E85C2A 100%);
          --gradient-secondary: linear-gradient(135deg, #5F6368 0%, #4A4D50 100%);
          --gradient-success: linear-gradient(135deg, #00C853 0%, #00A843 100%);
          --gradient-error: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
          --gradient-warning: linear-gradient(135deg, #FFA726 0%, #FB8C00 100%);
          --gradient-card: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          --gradient-bg: #F5F5F5;
          --gradient-header: linear-gradient(135deg, #FF6C37 0%, #E85C2A 100%);
          
          /* Professional Shadows (Postman-like) */
          --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
          --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
          --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.08);
          --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.08);
          --shadow-2xl: 0 16px 32px rgba(0, 0, 0, 0.08);
          --shadow-inner: inset 0 1px 2px rgba(0, 0, 0, 0.04);
          --shadow-glass: 0 2px 8px rgba(0, 0, 0, 0.08);
          --shadow-colored: 0 4px 12px rgba(255, 108, 55, 0.15);
          --shadow-glow: 0 0 0 3px rgba(255, 108, 55, 0.1);
          
          /* Clean Border Radius */
          --radius-xs: 4px;
          --radius-sm: 6px;
          --radius: 8px;
          --radius-md: 10px;
          --radius-lg: 12px;
          --radius-xl: 16px;
          --radius-2xl: 20px;
          --radius-3xl: 24px;
          --radius-full: 9999px;
          
          /* Fast Transitions - No Delays */
          --transition-fast: all 0.08s ease;
          --transition: all 0.1s ease;
          --transition-slow: all 0.15s ease;
          --transition-bounce: all 0.1s ease;
          --transition-elastic: all 0.15s ease;
          --transition-spring: all 0.1s ease;
          --transition-smooth: all 0.15s ease;
          
          /* Professional Typography */
          --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          
          /* Spacing Scale */
          --space-px: 1px;
          --space-0: 0;
          --space-1: 0.25rem;
          --space-2: 0.5rem;
          --space-3: 0.75rem;
          --space-4: 1rem;
          --space-5: 1.25rem;
          --space-6: 1.5rem;
          --space-8: 2rem;
          --space-10: 2.5rem;
          --space-12: 3rem;
          --space-16: 4rem;
          --space-20: 5rem;
        }

        /* Minimal Fast Animations Only */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
          100% { width: 100%; }
        }

        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes morphButton {
          0% { border-radius: var(--radius-full); }
          50% { border-radius: var(--radius); transform: scale(1.05); }
          100% { border-radius: var(--radius-full); }
        }

        @keyframes slideUpFade {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes elasticScale {
          0% { transform: scale(1); }
          30% { transform: scale(1.25); }
          40% { transform: scale(1.15); }
          50% { transform: scale(1.25); }
          65% { transform: scale(1.05); }
          75% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        /* Skeleton Loading Components */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: skeletonLoading 1.5s infinite;
          border-radius: var(--radius);
        }

        .skeleton-text {
          height: 1rem;
          margin-bottom: 0.5rem;
        }

        .skeleton-text:last-child {
          width: 60%;
        }

        .skeleton-button {
          height: 2.5rem;
          width: 100px;
        }

        /* Enhanced Progress Indicators */
        .progress-container {
          position: relative;
          width: 100%;
          height: 4px;
          background: var(--gray-200);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin: var(--space-4) 0;
        }

        .progress-bar {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          animation: progressBar 2s ease-in-out;
          position: relative;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 1.5s infinite;
        }

        /* Advanced Button States */
        .btn-loading {
          position: relative;
          color: transparent !important;
          pointer-events: none;
        }

        .btn-loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          color: white;
        }

        /* Enhanced Notification System */
        .notification {
          position: fixed;
          top: var(--space-4);
          right: var(--space-4);
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          box-shadow: var(--shadow-xl);
          z-index: 1000;
          animation: slideInFromRight 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          max-width: 400px;
          min-width: 300px;
        }

        .notification.success {
          border-left: 4px solid var(--success);
        }

        .notification.error {
          border-left: 4px solid var(--error);
        }

        .notification.warning {
          border-left: 4px solid var(--warning);
        }

        .notification.info {
          border-left: 4px solid var(--info);
        }

        .notification-content {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
        }

        .notification-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
        }

        .notification-text {
          flex: 1;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .notification-title {
          font-weight: 600;
          margin-bottom: var(--space-1);
        }

        .notification-message {
          color: var(--gray-600);
        }

        /* Enhanced Tooltip System */
        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip::before {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: var(--gray-900);
          color: white;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius);
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition);
          z-index: 1000;
          pointer-events: none;
        }

        .tooltip::after {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-2px);
          border: 4px solid transparent;
          border-top-color: var(--gray-900);
          opacity: 0;
          visibility: hidden;
          transition: var(--transition);
        }

        .tooltip:hover::before,
        .tooltip:hover::after {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(-4px);
        }

        /* Enhanced Focus States */
        .focus-ring {
          outline: none;
          position: relative;
        }

        .focus-ring::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid var(--primary);
          border-radius: inherit;
          opacity: 0;
          transition: var(--transition);
          pointer-events: none;
        }

        .focus-ring:focus::after {
          opacity: 1;
          animation: pulse 2s infinite;
        }

        /* Advanced Hover Effects */
        .hover-lift {
          transition: var(--transition-elastic);
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .hover-glow {
          transition: var(--transition);
        }

        .hover-glow:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .hover-scale {
          transition: var(--transition-elastic);
        }

        .hover-scale:hover {
          transform: scale(1.02);
        }

        /* Micro-interaction Enhancements */
        .click-feedback {
          position: relative;
          overflow: hidden;
        }

        .click-feedback::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }

        .click-feedback:active::before {
          width: 300px;
          height: 300px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Clean Professional Body (Postman-style) */
        body {
          font-family: var(--font-family);
          line-height: 1.5;
          background: #F5F5F5;
          color: var(--gray-900);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          margin: 0;
          padding: 0;
        }

        /* Clean Main Container */
        .main-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--space-4);
          position: relative;
        }

        /* Clean Professional Request Card (Postman-style) */
        .request-card {
          background: #ffffff;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          margin-bottom: var(--space-4);
          border: 1px solid var(--border);
          transition: var(--transition);
        }

        .request-card:hover {
          box-shadow: var(--shadow-md);
        }

        .card-header {
          padding: var(--space-4) var(--space-5);
          background: #ffffff;
          border-bottom: 1px solid var(--border);
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .card-title .material-icons {
          color: var(--primary);
          font-size: 1.25rem;
        }

        .card-description {
          color: var(--gray-600);
          font-size: 1rem;
          font-weight: 400;
        }

        /* Professional Request Row */
        .request-row {
          display: grid;
          grid-template-columns: 140px 1fr auto;
          gap: var(--space-4);
          padding: var(--space-6);
          align-items: stretch;
          animation: slideInFromRight 0.6s ease-out 1s both;
        }

        @media (max-width: 768px) {
          .request-row {
            grid-template-columns: 1fr;
            gap: var(--space-3);
          }
        }

        /* Enhanced Method Select with Dynamic Colors and Animations */
        .method-select {
          height: 52px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          background: var(--method-get) !important;
          color: white !important;
          border: 2px solid transparent;
          text-align: center;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 0 var(--space-4);
          text-align-last: center;
          transition: var(--transition);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 16px !important;
          padding-right: 40px !important;
          position: relative;
          overflow: hidden;
          will-change: transform;
        }

        /* Method-specific background colors with enhanced gradients */
        .method-select[value="GET"] {
          background: linear-gradient(135deg, var(--method-get) 0%, #059669 100%) !important;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        }

        .method-select[value="POST"] {
          background: linear-gradient(135deg, var(--method-post) 0%, #2563eb 100%) !important;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }

        .method-select[value="PUT"] {
          background: linear-gradient(135deg, var(--method-put) 0%, #d97706 100%) !important;
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
        }

        .method-select[value="DELETE"] {
          background: linear-gradient(135deg, var(--method-delete) 0%, #dc2626 100%) !important;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
        }

        .method-select[value="PATCH"] {
          background: linear-gradient(135deg, var(--method-patch) 0%, #7c3aed 100%) !important;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
        }

        .method-select[value="HEAD"] {
          background: linear-gradient(135deg, var(--method-head) 0%, #0891b2 100%) !important;
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
        }

        .method-select[value="OPTIONS"] {
          background: linear-gradient(135deg, var(--method-options) 0%, #4b5563 100%) !important;
          box-shadow: 0 4px 20px rgba(107, 114, 128, 0.3);
        }

        .method-select::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease-out;
        }

        .method-select:hover::before {
          left: 100%;
        }

        .method-select:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(255, 255, 255, 0.3);
          z-index: 10;
        }

        .method-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), var(--shadow-md);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
          z-index: 10;
        }

        .method-select:active {
          transform: translateY(0) scale(0.98);
          transition: var(--transition-fast);
        }

        /* Enhanced dropdown options with smooth animations */
        .method-select option {
          background: var(--white) !important;
          color: var(--gray-900) !important;
          font-weight: 700;
          padding: var(--space-4) var(--space-3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          font-size: 0.875rem;
          min-height: 48px;
          line-height: 1.5;
          transition: var(--transition);
        }

        .method-select option:hover {
          background: var(--gray-50) !important;
          color: var(--primary) !important;
          transform: scale(1.02);
        }

        .method-select option:checked {
          background: var(--primary) !important;
          color: white !important;
        }

        /* Method-specific option colors when selected */
        .method-select option[value="GET"]:checked {
          background: var(--method-get) !important;
        }

        .method-select option[value="POST"]:checked {
          background: var(--method-post) !important;
        }

        .method-select option[value="PUT"]:checked {
          background: var(--method-put) !important;
        }

        .method-select option[value="DELETE"]:checked {
          background: var(--method-delete) !important;
        }

        .method-select option[value="PATCH"]:checked {
          background: var(--method-patch) !important;
        }

        .method-select option[value="HEAD"]:checked {
          background: var(--method-head) !important;
        }

        .method-select option[value="OPTIONS"]:checked {
          background: var(--method-options) !important;
        }

        /* Enhanced URL Input with Advanced Animations */
        .url-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          animation: slideInFromLeft 0.6s ease-out 1.4s both;
        }

        .url-input-icon {
          position: absolute;
          left: var(--space-4);
          color: var(--gray-400);
          font-size: 1.125rem;
          pointer-events: none;
          transition: var(--transition-elastic);
          z-index: 1;
        }

        .url-input:focus + .url-input-icon,
        .url-input-wrapper:hover .url-input-icon {
          color: var(--primary);
          transform: scale(1.1) rotate(5deg);
        }

        .url-input {
          width: 100%;
          height: 52px;
          padding: 0 var(--space-4) 0 var(--space-12);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background: white;
          color: var(--gray-900);
          font-size: 0.95rem;
          font-family: var(--font-mono);
          transition: var(--transition-elastic);
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .url-input:hover {
          border-color: var(--gray-300);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .url-input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--gray-25);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), var(--shadow-sm);
          transform: translateY(-1px);
          z-index: 5;
        }

        .url-input::placeholder {
          color: var(--gray-400);
          font-style: italic;
          font-weight: 400;
          transition: var(--transition);
        }

        .url-input:focus::placeholder {
          color: var(--gray-300);
          transform: translateY(-2px);
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: var(--space-3);
          align-items: center;
        }

        @media (max-width: 768px) {
          .action-buttons {
            justify-content: stretch;
          }
          
          .action-buttons > * {
            flex: 1;
          }
        }

        /* Enhanced Professional Buttons with Advanced Animations */
        .send-button,
        .save-button {
          height: 52px;
          padding: 0 var(--space-6);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: hidden;
          min-width: 120px;
          letter-spacing: 0.025em;
          text-transform: uppercase;
          will-change: transform;
          contain: layout;
        }

        .send-button::before,
        .save-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease-out;
        }

        .send-button:hover::before,
        .save-button:hover::before {
          left: 100%;
        }

        .send-button {
          background: var(--gradient-success);
          animation-delay: 1.6s;
        }

        .send-button:hover {
          background: linear-gradient(135deg, #059669 0%, var(--success) 100%);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          z-index: 5;
        }

        .send-button:active {
          transform: translateY(-1px) scale(1.01);
          transition: var(--transition-fast);
        }

        .send-button .material-icons {
          transition: var(--transition-elastic);
        }

        .send-button:hover .material-icons {
          transform: scale(1.2) rotate(15deg);
        }

        .save-button {
          background: var(--gradient-secondary);
          animation-delay: 1.8s;
        }

        .save-button:hover {
          background: linear-gradient(135deg, #0891b2 0%, var(--secondary) 100%);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          z-index: 5;
        }

        .save-button:active {
          transform: translateY(-1px) scale(1.01);
          transition: var(--transition-fast);
        }

        .save-button .material-icons {
          transition: var(--transition-elastic);
        }

        .save-button:hover .material-icons {
          transform: scale(1.2) rotate(-10deg);
        }

        .send-button:disabled,
        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: var(--shadow-sm);
        }

        .send-button:disabled:hover,
        .save-button:disabled:hover {
          transform: none;
          box-shadow: var(--shadow-sm);
        }

        /* Enhanced Loading State */
        .send-button.loading,
        .save-button.loading {
          pointer-events: none;
          background: var(--gray-400);
          position: relative;
        }

        .send-button.loading .material-icons,
        .save-button.loading .material-icons {
          animation: spin 1s linear infinite;
        }

        /* Enhanced Tabs with Smooth Animations */
        .tabs {
          display: flex;
          background: var(--gray-50);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          padding: var(--space-1);
          margin: 0 var(--space-6);
          border-bottom: 1px solid var(--gray-200);
          gap: var(--space-1);
          animation: slideInFromLeft 0.6s ease-out 2s both;
          position: relative;
          overflow: hidden;
        }

        .tabs::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          z-index: 0;
        }

        .tab {
          flex: 1;
          padding: var(--space-4) var(--space-6);
          background: transparent;
          color: var(--gray-600);
          border: none;
          border-radius: var(--radius-lg);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-size: 0.875rem;
          position: relative;
          z-index: 1;
        }

        .tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(59, 130, 246, 0.1);
          border-radius: var(--radius-lg);
          transform: scaleX(0);
          transition: transform 0.3s ease-out;
          z-index: -1;
        }

        .tab:hover {
          color: var(--gray-800);
          transform: translateY(-2px) scale(1.02);
        }

        .tab:hover::before {
          transform: scaleX(1);
        }

        .tab.active {
          background: white;
          color: var(--primary);
          box-shadow: var(--shadow-md);
          font-weight: 600;
          transform: translateY(-3px) scale(1.05);
        }

        .tab.active::before {
          background: rgba(59, 130, 246, 0.05);
          transform: scaleX(1);
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          width: 60%;
          height: 3px;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          transform: translateX(-50%) scaleX(0);
          animation: scaleIn 0.4s ease-out 0.2s both;
        }

        .tab .material-icons {
          font-size: 1.125rem;
          transition: var(--transition-elastic);
        }

        .tab:hover .material-icons {
          transform: scale(1.15) rotate(5deg);
        }

        .tab.active .material-icons {
          transform: scale(1.2);
        }

        /* Tab Content */
        .tab-content {
          padding: var(--space-6);
        }

        .content-section {
          display: none;
        }

        .content-section.active {
          display: block;
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Enhanced Parameter Rows with Smooth Animations */
        .param-rows {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .param-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: var(--space-3);
          align-items: center;
          padding: var(--space-4);
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          contain: layout;
          will-change: transform;
        }

        .param-row::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
          transition: left 0.6s ease-out;
        }

        .param-row:hover::before {
          left: 100%;
        }

        .param-row:hover {
          border-color: var(--gray-300);
          box-shadow: var(--shadow-sm);
          transform: translateY(-1px);
          z-index: 2;
          position: relative;
        }

        .param-row input {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          background: var(--gray-50);
          color: var(--gray-900);
          font-size: 0.875rem;
          font-family: var(--font-family);
          transition: var(--transition);
          position: relative;
        }

        .param-row input:hover {
          border-color: var(--gray-300);
          background: white;
          transform: translateY(-1px);
        }

        .param-row input:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), var(--shadow-sm);
          transform: translateY(-2px) scale(1.01);
        }

        .param-row input::placeholder {
          color: var(--gray-400);
          font-weight: 400;
          transition: var(--transition);
        }

        .param-row input:focus::placeholder {
          color: var(--gray-300);
          transform: translateY(-1px);
        }

        .remove-param-button {
          width: 36px;
          height: 36px;
          background: var(--gradient-error);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .remove-param-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          transform: scale(0);
          transition: transform 0.3s ease-out;
        }

        .remove-param-button:hover::before {
          transform: scale(1);
        }

        .remove-param-button:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-md);
          z-index: 3;
        }

        .remove-param-button:active {
          transform: scale(1.05) rotate(0deg);
        }

        .remove-param-button .material-icons {
          font-size: 1rem;
          transition: var(--transition);
          position: relative;
          z-index: 1;
        }

        .remove-param-button:hover .material-icons {
          transform: scale(1.2);
        }

        /* Enhanced Add Parameter Button */
        .add-param-button {
          width: 100%;
          padding: var(--space-4);
          background: var(--gray-50);
          color: var(--gray-600);
          border: 2px dashed var(--gray-300);
          border-radius: var(--radius-lg);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-size: 0.875rem;
          position: relative;
          overflow: hidden;
        }

        .add-param-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          border-radius: var(--radius-lg);
          transform: scaleY(0);
          transition: transform 0.2s ease-out;
          transform-origin: bottom;
        }

        .add-param-button:hover::before {
          transform: scaleY(1);
        }

        .add-param-button:hover {
          background: white;
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
          border-style: solid;
        }

        .add-param-button:active {
          transform: translateY(0);
        }

        .add-param-button .material-icons {
          transition: var(--transition);
        }

        .add-param-button:hover .material-icons {
          transform: scale(1.1) rotate(45deg);
        }

        /* Optimized Textarea */
        textarea {
          width: 100%;
          min-height: 200px;
          padding: var(--space-4);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background: white;
          color: var(--gray-900);
          font-size: 0.875rem;
          font-family: var(--font-mono);
          line-height: 1.6;
          transition: var(--transition);
          resize: vertical;
          box-shadow: var(--shadow-sm);
        }

        textarea:hover {
          border-color: var(--gray-300);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), var(--shadow-xl);
          transform: translateY(-3px) scale(1.01);
        }

        textarea::placeholder {
          color: var(--gray-400);
          font-style: italic;
          transition: var(--transition);
        }

        textarea:focus::placeholder {
          color: var(--gray-300);
          transform: translateY(-2px);
        }

        /* Enhanced Response Container */
        .response-container {
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          border: 1px solid var(--gray-200);
          backdrop-filter: blur(20px);
          transition: var(--transition);
          margin-top: var(--space-6);
        }

        .response-container:hover {
          box-shadow: var(--shadow-2xl);
        }

        .response-container.response-success {
          border-left: 4px solid var(--success);
        }

        .response-container.response-error {
          border-left: 4px solid var(--error);
        }

        /* Professional Response Header */
        .response-header {
          padding: var(--space-6);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(6, 182, 212, 0.03) 100%);
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .response-status {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .response-time,
        .response-size {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 500;
        }

        .response-time .material-icons,
        .response-size .material-icons {
          font-size: 1rem;
          color: var(--gray-500);
        }

        /* Enhanced Response Tabs */
        .response-tabs {
          display: flex;
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-200);
          padding: var(--space-1);
          margin: 0 var(--space-6);
          gap: var(--space-1);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }

        .response-tab {
          flex: 1;
          padding: var(--space-3) var(--space-4);
          background: transparent;
          color: var(--gray-600);
          border: none;
          border-radius: var(--radius-lg);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-size: 0.875rem;
          position: relative;
        }

        .response-tab:hover {
          color: var(--gray-800);
          background: rgba(16, 185, 129, 0.05);
        }

        .response-tab.active {
          background: white;
          color: var(--success);
          box-shadow: var(--shadow-sm);
          font-weight: 600;
        }

        .response-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-success);
          border-radius: var(--radius-full);
        }

        .response-tab-badge {
          background: var(--gray-400);
          color: white;
          font-size: 0.75rem;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-weight: 600;
          min-width: 20px;
          text-align: center;
          margin-left: var(--space-1);
        }

        .response-tab.active .response-tab-badge {
          background: var(--success);
        }

        /* Response Content */
        .response-content {
          position: relative;
        }

        .response-section {
          display: none;
          min-height: 300px;
        }

        .response-section.active {
          display: block;
          animation: fadeIn 0.3s ease-in-out;
        }

        /* Enhanced Response Body */
        .response-body {
          padding: var(--space-6);
          background: var(--gray-25);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.7;
          white-space: pre-wrap;
          overflow-x: auto;
          max-height: 600px;
          overflow-y: auto;
          position: relative;
          border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
        }

        /* Professional Response Headers Table */
        .headers-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          margin: var(--space-6);
          width: calc(100% - 3rem);
        }

        .headers-table th,
        .headers-table td {
          padding: var(--space-4) var(--space-5);
          text-align: left;
          border-bottom: 1px solid var(--gray-200);
          font-size: 0.875rem;
        }

        .headers-table th {
          background: var(--gray-50);
          font-weight: 600;
          color: var(--gray-700);
          letter-spacing: 0.025em;
          text-transform: uppercase;
          font-size: 0.75rem;
        }

        .headers-table td {
          color: var(--gray-800);
          font-family: var(--font-mono);
          font-weight: 500;
        }

        .headers-table td:first-child {
          font-weight: 600;
          color: var(--primary);
        }

        .headers-table tr:last-child td {
          border-bottom: none;
        }

        .headers-table tr:hover {
          background: var(--gray-25);
        }

        /* Enhanced Response Controls */
        .response-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-5) var(--space-6);
          background: white;
          border-bottom: 1px solid var(--gray-200);
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .response-search {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex: 1;
          max-width: 320px;
          position: relative;
        }

        .response-search .material-icons {
          position: absolute;
          left: var(--space-3);
          color: var(--gray-400);
          font-size: 1.125rem;
          pointer-events: none;
        }

        .response-search input {
          width: 100%;
          padding: var(--space-3) var(--space-4) var(--space-3) var(--space-10);
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: var(--gray-50);
          transition: var(--transition);
        }

        .response-search input:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .response-options {
          display: flex;
          gap: var(--space-1);
          align-items: center;
          background: var(--gray-100);
          padding: var(--space-1);
          border-radius: var(--radius-lg);
        }

        .response-option-btn {
          padding: var(--space-2) var(--space-4);
          background: transparent;
          color: var(--gray-600);
          border: none;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .response-option-btn:hover {
          background: white;
          color: var(--gray-800);
          box-shadow: var(--shadow-xs);
        }

        .response-option-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
          font-weight: 600;
        }

        .response-option-btn .material-icons {
          font-size: 1rem;
        }

        /* Button Group */
        .button-group {
          display: flex;
          gap: var(--space-3);
          align-items: center;
        }

        .copy-button,
        .copy-as-curl {
          width: 44px;
          height: 44px;
          background: var(--glass-bg);
          color: var(--gray-600);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .copy-button::before,
        .copy-as-curl::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s;
        }

        .copy-button:hover::before,
        .copy-as-curl:hover::before {
          left: 100%;
        }

        .copy-button:hover,
        .copy-as-curl:hover {
          background: white;
          color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .copy-button.success,
        .copy-as-curl.success {
          background: var(--gradient-success);
          color: white;
          border-color: var(--success);
        }

        .copy-button .material-icons,
        .copy-as-curl .material-icons {
          font-size: 1.125rem;
        }

        /* Status Indicators */
        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .status-success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-error {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .status-warning {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        /* Enhanced Loading Animation */
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-16);
          color: var(--gray-500);
          gap: var(--space-4);
          flex-direction: column;
          background: var(--gray-25);
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          font-size: 1rem;
          font-weight: 500;
          text-align: center;
          line-height: 1.5;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Professional Copy Feedback */
        .copy-feedback {
          position: fixed;
          bottom: var(--space-6);
          right: var(--space-6);
          background: var(--gradient-success);
          color: white;
          padding: var(--space-4) var(--space-6);
          border-radius: var(--radius-xl);
          animation: slideInFade 3s ease-in-out;
          pointer-events: none;
          z-index: 1000;
          box-shadow: var(--shadow-2xl);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-weight: 600;
          font-size: 0.875rem;
          backdrop-filter: blur(10px);
        }

        @keyframes slideInFade {
          0% { transform: translateY(100px) scale(0.8); opacity: 0; }
          15%, 85% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
        }

        /* Enhanced JSON Styling */
        .json-container {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.7;
          white-space: pre;
          padding: var(--space-6);
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: var(--radius-lg);
          overflow-x: auto;
          border: 1px solid var(--gray-200);
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .json-string { color: #059669; font-weight: 500; }
        .json-number { color: #dc2626; font-weight: 600; }
        .json-boolean { color: #7c3aed; font-weight: 600; }
        .json-null { color: #6b7280; font-style: italic; }
        .json-bracket { color: var(--gray-600); font-weight: 600; }
        .json-key { color: var(--primary); font-weight: 600; }

        /* Professional Save Dialog */
        .save-dialog {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: var(--transition);
          backdrop-filter: blur(8px);
        }

        .save-dialog.active {
          opacity: 1;
          pointer-events: auto;
        }

        .save-dialog-content {
          background: white;
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          width: 540px;
          max-width: 90%;
          box-shadow: var(--shadow-2xl);
          transform: translateY(-30px) scale(0.95);
          transition: var(--transition);
          border: 1px solid var(--gray-200);
        }

        .save-dialog.active .save-dialog-content {
          transform: translateY(0) scale(1);
        }

        .save-dialog-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: var(--gray-900);
          letter-spacing: -0.025em;
        }

        .save-dialog-title .material-icons {
          color: var(--primary);
          font-size: 1.75rem;
        }

        .save-dialog-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        
        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-4);
          margin-top: var(--space-8);
        }

        .dialog-button {
          padding: var(--space-4) var(--space-8);
          border-radius: var(--radius-xl);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          transition: var(--transition);
          border: none;
          font-size: 1rem;
          min-height: 48px;
        }

        .dialog-cancel {
          background: var(--gray-100);
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }

        .dialog-cancel:hover {
          background: var(--gray-200);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .dialog-save {
          background: var(--gradient-primary);
          color: white;
        }

        .dialog-save:hover {
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }

        /* Professional Timing Breakdown */
        .timing-breakdown {
          padding: var(--space-6);
        }

        .timing-breakdown h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .timing-breakdown h4 .material-icons {
          color: var(--primary);
            font-size: 1.25rem;
          }

        .timing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-2);
          transition: var(--transition);
        }

        .timing-item:hover {
          border-color: var(--gray-300);
          box-shadow: var(--shadow-sm);
        }

        .timing-item:last-child {
          margin-bottom: 0;
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.02);
        }

        .timing-label {
          font-weight: 500;
          color: var(--gray-700);
          font-size: 0.875rem;
        }

        .timing-value {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--primary);
          font-size: 0.875rem;
        }

        /* Mobile Responsive Enhancements */
        @media (max-width: 1200px) {
          .main-container {
            max-width: 100%;
            padding: 0 var(--space-3) var(--space-6);
          }
          
          .header {
            padding: var(--space-5) var(--space-3);
            margin-bottom: var(--space-6);
          }
          
          .request-card {
            border-radius: var(--radius-xl);
          }
          
          .card-header {
            padding: var(--space-5);
          }
          
          .request-row {
            padding: var(--space-5);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: var(--space-4);
          }

          .header-actions {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .response-controls {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-3);
          }

          .response-search {
            max-width: none;
          }
          
          .response-options {
            justify-content: center;
          }
          
          .button-group {
            justify-content: center;
          }

          .tabs {
            margin: 0 var(--space-3);
            padding: var(--space-1);
          }
          
          .response-tabs {
            margin: 0 var(--space-3);
            padding: var(--space-1);
          }
          
          .tab,
          .response-tab {
            padding: var(--space-3) var(--space-2);
            font-size: 0.8125rem;
          }

          .save-dialog-content {
            padding: var(--space-6);
            width: 95%;
          }

          .dialog-actions {
            flex-direction: column-reverse;
            gap: var(--space-3);
          }

          .dialog-button {
            width: 100%;
            justify-content: center;
          }
        }

        /* Enhanced Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--gray-100);
          border-radius: var(--radius-sm);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--gray-300);
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--gray-400);
        }

        /* Focus Styles */
        *:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        /* Collapsible JSON */
        .json-collapsible {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.6;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: var(--radius-md);
          overflow-x: auto;
          border: 1px solid var(--gray-200);
          position: relative;
        }

        .json-container {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          padding: 1rem;
          white-space: pre-wrap;
          overflow-x: auto;
          max-height: 70vh;
          overflow-y: auto;
        }

        .json-key {
          color: var(--primary);
          font-weight: 600;
        }

        .json-string {
          color: #10b981;
        }

        .json-number {
          color: #f59e0b;
        }

        .json-boolean {
          color: #ef4444;
        }

        .json-null {
          color: #6b7280;
          font-style: italic;
        }

        /* Clean Professional Request Type Tabs (Postman-style) */
        .request-type-tabs {
          display: flex;
          gap: 0;
          margin-bottom: var(--space-4);
          border-bottom: 2px solid var(--border);
        }

        .type-tab {
          padding: var(--space-3) var(--space-5);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9375rem;
          color: var(--gray-600);
          transition: var(--transition);
          position: relative;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
        }

        .type-tab:hover {
          color: var(--gray-900);
          background: var(--gray-50);
        }

        .type-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          font-weight: 600;
        }

        .request-content {
          display: none;
        }

        .request-content.active {
          display: block;
        }
      </style>
    </head>
    <body>
      <!-- Main Content Container -->
      <div class="main-container">
        <!-- Request Type Tabs -->
        <div class="request-type-tabs">
          <div class="type-tab active" onclick="switchRequestType('rest')" data-type="rest">REST</div>
          <div class="type-tab" onclick="switchRequestType('graphql')" data-type="graphql">GraphQL</div>
        </div>

        <!-- REST Content -->
        <div id="rest-content" class="request-content active">
          <!-- Request Card -->
          <div class="request-card">
            <div class="card-header">
              <h2 class="card-title">
                <span class="material-icons">http</span>
                REST TEST
              </h2>
            </div>

            <div class="request-row">
              <select id="method-select" class="method-select">
                <option value="GET" ${initialState.method === 'GET' ? 'selected' : ''}>GET</option>
                <option value="POST" ${initialState.method === 'POST' ? 'selected' : ''}>POST</option>
                <option value="PUT" ${initialState.method === 'PUT' ? 'selected' : ''}>PUT</option>
                <option value="DELETE" ${initialState.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
                <option value="PATCH" ${initialState.method === 'PATCH' ? 'selected' : ''}>PATCH</option>
                <option value="HEAD" ${initialState.method === 'HEAD' ? 'selected' : ''}>HEAD</option>
                <option value="OPTIONS" ${initialState.method === 'OPTIONS' ? 'selected' : ''}>OPTIONS</option>
              </select>
              <div class="url-input-wrapper">
                <input type="text" id="url-input" class="url-input" placeholder="https://api.example.com/endpoint" value="${initialState.url || ''}">
              </div>
              <div class="action-buttons">
                <button id="save-btn" class="save-button">
                    <span class="material-icons">bookmark</span>
                  Save
                </button>
                <button id="send-btn" class="send-button">
                  <span class="material-icons">send</span>
                  Send
                </button>
              </div>
            </div>
          </div>

          <div class="tabs">
            <div class="tab active" data-tab="params">
                <span class="material-icons">tune</span>
                Parameters
            </div>
            <div class="tab" data-tab="headers">
              <span class="material-icons">http</span>
              Headers
            </div>
            <div class="tab" data-tab="body">
              <span class="material-icons">data_object</span>
                Request Body
            </div>
          </div>

          <div class="tab-content">
            <div id="params-section" class="content-section active">
              <div id="queryParams" class="param-rows"></div>
              <button class="add-param-button" onclick="addParamRow('queryParams')">
                  <span class="material-icons">add_circle</span>
                  Add Query Parameter
              </button>
            </div>

            <div id="headers-section" class="content-section">
              <div id="headers" class="param-rows"></div>
              <button class="add-param-button" onclick="addParamRow('headers')">
                  <span class="material-icons">add_circle</span>
                Add Header
              </button>
            </div>

            <div id="body-section" class="content-section">
                <textarea id="body" placeholder="{\n  \"key\": \"value\",\n  \"message\": \"Hello, World!\"\n}" rows="12"></textarea>
            </div>
          </div>
        </div>

        <!-- GraphQL Content -->
        <div id="graphql-content" class="request-content">
          <div class="request-card">
            <div class="card-header">
              <h2 class="card-title">
                <span class="material-icons">hub</span>
                GraphQL
              </h2>
            </div>
            <div class="request-row">
              <div class="url-input-wrapper" style="grid-column: 1 / -2;">
                <input type="text" id="graphql-url-input" class="url-input" placeholder="https://api.example.com/graphql" value="${initialState.graphqlUrl || ''}">
              </div>
              <div class="action-buttons">
                <button id="graphql-save-btn" class="save-button">
                    <span class="material-icons">bookmark</span>
                    Save
                </button>
                <button id="graphql-send-btn" class="send-button">
                    <span class="material-icons">send</span>
                    Send
                </button>
              </div>
            </div>
          </div>

          <div class="tabs">
            <div class="tab active" data-tab="query" onclick="switchGraphQLTab('query')">
                <span class="material-icons">code</span>
                Query
            </div>
            <div class="tab" data-tab="variables" onclick="switchGraphQLTab('variables')">
                <span class="material-icons">data_object</span>
                Variables
            </div>
            <div class="tab" data-tab="graphql-headers" onclick="switchGraphQLTab('graphql-headers')">
                <span class="material-icons">http</span>
                Headers
            </div>
          </div>

          <div class="tab-content">
            <div id="query-section" class="content-section active">
                <textarea id="graphql-query" placeholder="query { ... }" rows="12">${initialState.graphqlQuery || ''}</textarea>
            </div>
            <div id="variables-section" class="content-section">
                <textarea id="graphql-variables" placeholder="{ ... }" rows="12">${initialState.graphqlVariables || ''}</textarea>
            </div>
            <div id="graphql-headers-section" class="content-section">
                <div id="graphql-headers" class="param-rows"></div>
                <button class="add-param-button" onclick="addParamRow('graphql-headers')">
                    <span class="material-icons">add_circle</span>
                    Add Header
                </button>
            </div>
          </div>
        </div>
      </div>
      <div id="responseContainer" style="display: none;">
          <div id="responseBox" class="response-container">
            <div id="responseHeader" class="response-header">
              <div class="response-status">
                <span id="responseStatus"></span>
                <span id="responseTime" class="response-time">
                  <span class="material-icons">timer</span>
                  <span></span>
                </span>
                  <span id="responseSize" class="response-size">
                    <span class="material-icons">data_usage</span>
                  <span></span>
                </span>
              </div>
              <div class="button-group">
                  <button id="copyAsCurlButton" class="copy-as-curl" title="Copy as cURL">
                    <span class="material-icons">terminal</span>
                </button>
                  <button id="copyButton" class="copy-button" title="Copy Response">
                  <span class="material-icons">content_copy</span>
                  </button>
                </div>
              </div>

              <!-- Response Tabs -->
              <div class="response-tabs">
                <div class="response-tab active" data-response-tab="body">
                  <span class="material-icons">data_object</span>
                  Body
                </div>
                <div class="response-tab" data-response-tab="headers">
                  <span class="material-icons">list</span>
                  Headers
                  <span id="headersCount" class="response-tab-badge">0</span>
                </div>
                <div class="response-tab" data-response-tab="timing">
                  <span class="material-icons">speed</span>
                  Timing
                </div>
              </div>

              <!-- Response Content -->
              <div class="response-content">
                <!-- Response Body Section -->
                <div id="response-body-section" class="response-section active">
                  <div class="response-controls">
                    <div class="response-search">
                      <span class="material-icons">search</span>
                      <input type="text" id="responseSearch" placeholder="Search in response...">
                    </div>
                    <div class="response-options">
                      <button class="response-option-btn active" data-format="pretty">
                        <span class="material-icons">code</span>
                        Pretty
                      </button>
                      <button class="response-option-btn" data-format="raw">
                        <span class="material-icons">text_fields</span>
                        Raw
                      </button>
                      <button class="response-option-btn" data-format="preview">
                        <span class="material-icons">preview</span>
                        Preview
                </button>
              </div>
            </div>
            <div id="responseBody" class="response-body"></div>
          </div>

                <!-- Response Headers Section -->
                <div id="response-headers-section" class="response-section">
                  <div id="responseHeaders">
                    <table class="headers-table">
                      <thead>
                        <tr>
                          <th>Header</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody id="headersTableBody">
                        <tr>
                          <td colspan="2" style="text-align: center; color: var(--gray-500); font-style: italic;">
                            No headers to display
                          </td>
                        </tr>
                      </tbody>
                    </table>
        </div>
      </div>

                <!-- Response Timing Section -->
                <div id="response-timing-section" class="response-section">
                  <div class="timing-breakdown">
                    <h4>
                      <span class="material-icons">schedule</span>
                      Request Timing Breakdown
                    </h4>
                    <div id="timingDetails">
                      <div class="timing-item">
                        <span class="timing-label">DNS Lookup</span>
                        <span class="timing-value" id="dnsTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">TCP Handshake</span>
                        <span class="timing-value" id="tcpTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">SSL Handshake</span>
                        <span class="timing-value" id="sslTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">Request Sent</span>
                        <span class="timing-value" id="requestTime">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">Response Received</span>
                        <span class="timing-value" id="responseTimeDetail">--</span>
                      </div>
                      <div class="timing-item">
                        <span class="timing-label">Total Time</span>
                        <span class="timing-value" id="totalTime">--</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Dialog -->
      <div id="save-dialog" class="save-dialog">
        <div class="save-dialog-content">
          <div class="save-dialog-title">
            <span class="material-icons">bookmark_add</span>
            Save API Request
          </div>
          <div class="save-dialog-form">
            <div>
              <label for="request-name" style="display: block; margin-bottom: 0.75rem; font-weight: 500; color: var(--gray-700);">Request Name</label>
              <input type="text" id="request-name" class="url-input" placeholder="My Awesome API Request">
            </div>
            <div class="dialog-actions">
              <button id="dialog-cancel" class="dialog-button dialog-cancel">
                <span class="material-icons">close</span>
                Cancel
              </button>
              <button id="dialog-save" class="dialog-button dialog-save">
                <span class="material-icons">save</span>
                Save Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();
        const initialState = ${JSON.stringify(initialState)};
        let currentState = { ...initialState };

        // Enhanced tab switching with animations
        function switchTab(tabId) {
          const tabs = document.querySelectorAll('.tab');
          const sections = document.querySelectorAll('.content-section');
          
          // Remove active states with animation
          tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.transform = '';
          });
          
          sections.forEach(section => {
            if (section.classList.contains('active')) {
              section.style.opacity = '0';
              section.style.transform = 'translateY(10px)';
              setTimeout(() => {
                section.classList.remove('active');
              }, 150);
            }
          });
          
          // Add active states with staggered animation
          setTimeout(() => {
            const activeTab = document.querySelector(\`[data-tab="\${tabId}"]\`);
            const activeSection = document.getElementById(\`\${tabId}-section\`);
            
            activeTab.classList.add('active');
            activeSection.classList.add('active');
            
            // Smooth entrance animation
            requestAnimationFrame(() => {
              activeSection.style.opacity = '1';
              activeSection.style.transform = 'translateY(0)';
            });
          }, 150);
        }

        // Enhanced method select color update with animation
        function updateMethodSelectColor() {
          const methodSelect = document.getElementById('method-select');
          const method = methodSelect.value;
          
          // Add transition effect
          methodSelect.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          
          // Update the select element's value attribute for CSS targeting
          methodSelect.setAttribute('value', method);
          
          // Remove any existing method classes
          methodSelect.classList.remove('method-get', 'method-post', 'method-put', 'method-delete', 'method-patch', 'method-head', 'method-options');
          
          // Add the appropriate method class with animation
          methodSelect.classList.add('method-' + method.toLowerCase());
          
          // Add subtle pulse animation
          methodSelect.style.transform = 'scale(1.02)';
          setTimeout(() => {
            methodSelect.style.transform = '';
          }, 200);
        }

        // Enhanced loading state with better animations
        function showLoading() {
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseBody = document.getElementById('responseBody');
          const responseTimeEl = document.getElementById('responseTime');
          const responseSizeEl = document.getElementById('responseSize');
          
          responseContainer.style.display = 'block';
          responseBox.className = 'response-container';
          responseStatus.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite; margin-right: 8px;">sync</span>Sending request...';
          
          // Clear timing displays with animation
          const timeSpan = responseTimeEl.querySelector('span:last-child');
          if (timeSpan) {
            timeSpan.style.opacity = '0';
            setTimeout(() => timeSpan.textContent = '', 200);
          }
          const sizeSpan = responseSizeEl.querySelector('span:last-child');
          if (sizeSpan) {
            sizeSpan.style.opacity = '0';
            setTimeout(() => sizeSpan.textContent = '', 200);
          }
          
          // Enhanced loading animation
          responseBody.innerHTML = \`
            <div class="loading">
              <div class="loading-spinner"></div>
              <div class="loading-text">
                <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">🚀 Processing your request</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Please wait while we fetch the data...</div>
              </div>
            </div>
          \`;
          
          // Add entrance animation to response container
          responseContainer.style.opacity = '0';
          responseContainer.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            responseContainer.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            responseContainer.style.opacity = '1';
            responseContainer.style.transform = 'translateY(0)';
          });
        }

        // Enhanced copy feedback with better animations
        function showCopyFeedback(message) {
          // Remove existing feedback with fade out
          const existingFeedback = document.querySelector('.copy-feedback');
          if (existingFeedback) {
            existingFeedback.style.opacity = '0';
            existingFeedback.style.transform = 'translateY(-20px) scale(0.8)';
            setTimeout(() => existingFeedback.remove(), 200);
          }
          
          // Create new feedback with enhanced animation
          const feedback = document.createElement('div');
          feedback.className = 'copy-feedback';
          feedback.innerHTML = \`
            <span class="material-icons">check_circle</span>
            \${message}
          \`;
          
          // Start with hidden state
          feedback.style.opacity = '0';
          feedback.style.transform = 'translateY(100px) scale(0.8)';
          document.body.appendChild(feedback);
          
          // Trigger entrance animation
          requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0) scale(1)';
          });
          
          // Auto-remove with exit animation
          setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-100px) scale(0.8)';
            setTimeout(() => feedback.remove(), 400);
          }, 2600);
        }

        // Enhanced button ripple effect
        function addRippleEffect(button, event) {
          const ripple = document.createElement('span');
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;
          
          ripple.style.cssText = \`
            position: absolute;
            width: \${size}px;
            height: \${size}px;
            left: \${x}px;
            top: \${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          \`;
          
          button.style.position = 'relative';
          button.style.overflow = 'hidden';
          button.appendChild(ripple);
          
          setTimeout(() => ripple.remove(), 600);
        }

        function initializeForm() {
          document.getElementById('method-select').value = currentState.method;
          document.getElementById('url-input').value = currentState.url;
          document.getElementById('body').value = currentState.body;

          // Update method select color on initialization
          updateMethodSelectColor();

          const queryParamsContainer = document.getElementById('queryParams');
          queryParamsContainer.innerHTML = '';
          currentState.queryParams.forEach(param => addParamRow('queryParams', param));
          if (currentState.queryParams.length === 0) {
            addParamRow('queryParams');
          }

          const headersContainer = document.getElementById('headers');
          headersContainer.innerHTML = '';
          currentState.headers.forEach(header => addParamRow('headers', header));
          if (currentState.headers.length === 0) {
            addParamRow('headers');
          }
        }

        function saveState() {
          currentState = {
            method: document.getElementById('method-select').value,
            url: document.getElementById('url-input').value,
            body: document.getElementById('body').value,
            queryParams: collectParamsArray('queryParams'),
            headers: collectParamsArray('headers')
          };
          
          vscode.postMessage({
            type: 'saveState',
            state: currentState
          });
        }

        function addParamRow(containerId, initialValue = { key: '', value: '' }) {
          const container = document.getElementById(containerId);
          const row = document.createElement('div');
          row.className = 'param-row';
          
          row.innerHTML = \`
            <input type="text" placeholder="Key" value="\${initialValue.key}" />
            <input type="text" placeholder="Value" value="\${initialValue.value}" />
            <button class="remove-param-button" onclick="removeParamRow(this)" aria-label="Delete parameter">
              <span class="material-icons">delete</span>
            </button>
          \`;

          const inputs = row.getElementsByTagName('input');
          for (const input of inputs) {
            input.addEventListener('input', () => {
              if (containerId === 'queryParams') {
                updateURLWithParams();
              } else {
                saveState();
              }
            });

            // Simplified focus animations
            input.addEventListener('focus', () => {
              row.style.transform = 'translateY(-1px)';
              row.style.boxShadow = 'var(--shadow-sm)';
            });

            input.addEventListener('blur', () => {
              row.style.transform = '';
              row.style.boxShadow = '';
            });
          }

          // Simplified entrance animation - no double animation layers
          row.style.opacity = '0';
          row.style.transform = 'translateY(10px)';
          container.appendChild(row);
          
          // Single animation trigger - much faster
          requestAnimationFrame(() => {
            row.style.transition = 'all 0.2s ease-out';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          });
          
          // Immediate focus for better UX - no delay
          if (initialValue.key === '' && initialValue.value === '') {
            requestAnimationFrame(() => inputs[0].focus());
          }
        }

        function removeParamRow(button) {
          const row = button.parentElement;
          const container = row.parentElement;
          
          // Simplified removal animation - much faster
          row.style.transition = 'all 0.15s ease-out';
          row.style.transform = 'translateX(-10px)';
          row.style.opacity = '0';
          
          setTimeout(() => {
            container.removeChild(row);
            
            if (container.children.length === 0) {
              addParamRow(container.id);
            }
            
            if (container.id === 'queryParams') {
              updateURLWithParams();
            } else {
              saveState();
            }
          }, 150);
        }

        function formatResponseTime(ms) {
          if (ms < 1000) {
            return \`\${ms}ms\`;
          }
          return \`\${(ms / 1000).toFixed(2)}s\`;
        }

        function formatResponseSize(bytes) {
          if (!bytes) return '-- KB';
          if (bytes < 1024) return \`\${bytes} B\`;
          if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`;
          return \`\${(bytes / (1024 * 1024)).toFixed(1)} MB\`;
        }

        function switchResponseTab(tabId) {
          // Switch response tabs
          document.querySelectorAll('.response-tab').forEach(tab => {
            tab.classList.remove('active');
          });
          document.querySelectorAll('.response-section').forEach(section => {
            section.classList.remove('active');
          });
          
          document.querySelector(\`[data-response-tab="\${tabId}"]\`).classList.add('active');
          document.getElementById(\`response-\${tabId}-section\`).classList.add('active');
        }

        function switchResponseFormat(format) {
          document.querySelectorAll('.response-option-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          document.querySelector(\`[data-format="\${format}"]\`).classList.add('active');
          
          // Re-format the current response based on the selected format
          const responseBody = document.getElementById('responseBody');
          const currentData = responseBody.dataset.rawData;
          
          if (currentData) {
            displayResponseData(JSON.parse(currentData), format);
          }
        }

        function displayResponseData(data, format = 'pretty') {
          const responseBody = document.getElementById('responseBody');
          responseBody.dataset.rawData = JSON.stringify(data);
          
          if (format === 'raw') {
            responseBody.textContent = typeof data === 'string' ? data : JSON.stringify(data);
            responseBody.className = 'response-body';
          } else if (format === 'preview') {
            try {
              const parsed = typeof data === 'string' ? JSON.parse(data) : data;
              responseBody.innerHTML = createJsonPreview(parsed);
              responseBody.className = 'response-body';
            } catch (e) {
              responseBody.textContent = typeof data === 'string' ? data : JSON.stringify(data);
              responseBody.className = 'response-body';
            }
          } else { // pretty
            try {
              const jsonContent = formatJSONWithCollapsible(data);
              if (typeof jsonContent === 'string') {
                responseBody.textContent = jsonContent;
              } else {
                responseBody.innerHTML = '';
                responseBody.appendChild(jsonContent);
              }
              responseBody.className = 'response-body';
            } catch (error) {
              responseBody.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
              responseBody.className = 'response-body';
            }
          }
        }

        function createJsonPreview(obj, depth = 0) {
          if (depth > 2) return '<span class="json-truncated">...</span>';
          
          if (obj === null) return '<span class="json-null">null</span>';
          if (typeof obj === 'boolean') return '<span class="json-boolean">' + obj + '</span>';
          if (typeof obj === 'number') return '<span class="json-number">' + obj + '</span>';
          if (typeof obj === 'string') {
            const truncated = obj.length > 50 ? obj.substring(0, 50) + '...' : obj;
            return '<span class="json-string">"' + truncated + '"</span>';
          }
          
          if (Array.isArray(obj)) {
            if (obj.length === 0) return '<span class="json-bracket">[]</span>';
            const items = obj.slice(0, 3).map(item => createJsonPreview(item, depth + 1));
            const more = obj.length > 3 ? '<br>&nbsp;&nbsp;<span class="json-truncated">... (' + (obj.length - 3) + ' more items)</span>' : '';
            return '<span class="json-bracket">[</span><div style="margin-left: 1rem; border-left: 2px solid var(--gray-200); padding-left: 1rem;">' + items.join(',<br>') + more + '</div><span class="json-bracket">]</span>';
          }
          
          if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '<span class="json-bracket">{}</span>';
            const items = keys.slice(0, 5).map(key => 
              '<span class="json-key">"' + key + '"</span>: ' + createJsonPreview(obj[key], depth + 1)
            );
            const more = keys.length > 5 ? '<br>&nbsp;&nbsp;<span class="json-truncated">... (' + (keys.length - 5) + ' more properties)</span>' : '';
            return '<span class="json-bracket">{</span><div style="margin-left: 1rem; border-left: 2px solid var(--gray-200); padding-left: 1rem;">' + items.join(',<br>') + more + '</div><span class="json-bracket">}</span>';
          }
          
          return String(obj);
        }

        function displayResponseHeaders(headers) {
          const headersTableBody = document.getElementById('headersTableBody');
          const headersCount = document.getElementById('headersCount');
          
          if (!headers || Object.keys(headers).length === 0) {
            headersTableBody.innerHTML = \`
              <tr>
                <td colspan="2" style="text-align: center; color: var(--gray-500); font-style: italic;">
                  No headers to display
                </td>
              </tr>
            \`;
            headersCount.textContent = '0';
            return;
          }
          
          const headerEntries = Object.entries(headers);
          headersCount.textContent = headerEntries.length;
          
          headersTableBody.innerHTML = headerEntries.map(([key, value]) => \`
            <tr>
              <td>\${key}</td>
              <td>\${value}</td>
            </tr>
          \`).join('');
        }

        function updateTimingBreakdown(responseTime) {
          // Simulate timing breakdown (in a real implementation, these would come from the actual request)
          const total = responseTime;
          const dns = Math.round(total * 0.05);
          const tcp = Math.round(total * 0.15);
          const ssl = Math.round(total * 0.20);
          const request = Math.round(total * 0.10);
          const response = total - dns - tcp - ssl - request;
          
          document.getElementById('dnsTime').textContent = formatResponseTime(dns);
          document.getElementById('tcpTime').textContent = formatResponseTime(tcp);
          document.getElementById('sslTime').textContent = formatResponseTime(ssl);
          document.getElementById('requestTime').textContent = formatResponseTime(request);
          document.getElementById('responseTimeDetail').textContent = formatResponseTime(response);
          document.getElementById('totalTime').textContent = formatResponseTime(total);
        }

        function setupResponseSearch() {
          const searchInput = document.getElementById('responseSearch');
          searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const responseBody = document.getElementById('responseBody');
            const originalText = responseBody.dataset.originalText || responseBody.textContent;
            
            if (!responseBody.dataset.originalText) {
              responseBody.dataset.originalText = responseBody.textContent;
            }
            
            if (query && query.length > 0) {
              // Simple highlighting without complex regex
              const lowerOriginal = originalText.toLowerCase();
              const lowerQuery = query.toLowerCase();
              
              if (lowerOriginal.indexOf(lowerQuery) !== -1) {
                let highlighted = originalText;
                let startIndex = 0;
                let result = '';
                
                while (true) {
                  const index = lowerOriginal.indexOf(lowerQuery, startIndex);
                  if (index === -1) {
                    result += originalText.substring(startIndex);
                    break;
                  }
                  
                  result += originalText.substring(startIndex, index);
                  result += '<mark style="background: yellow; color: black;">';
                  result += originalText.substring(index, index + query.length);
                  result += '</mark>';
                  startIndex = index + query.length;
                }
                
                responseBody.innerHTML = result;
              } else {
                responseBody.textContent = originalText;
              }
            } else {
              responseBody.textContent = originalText;
            }
          });
        }

        function collectParamsArray(containerId) {
          const params = [];
          const container = document.getElementById(containerId);
          const rows = container.getElementsByClassName('param-row');
          
          for (const row of rows) {
            const inputs = row.getElementsByTagName('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key || value) {
              params.push({ key, value });
            }
          }
          
          return params;
        }

        function collectParams(containerId) {
          const params = {};
          const container = document.getElementById(containerId);
          const rows = container.getElementsByClassName('param-row');
          
          for (const row of rows) {
            const inputs = row.getElementsByTagName('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key) {
              params[key] = value;
            }
          }
          
          return params;
        }

        function updateURLWithParams() {
          const urlInput = document.getElementById('url-input');
          const baseURL = urlInput.value.split('?')[0];
          const queryParams = collectParamsArray('queryParams');
          
          if (queryParams.length > 0 && queryParams.some(param => param.key)) {
            const searchParams = new URLSearchParams();
            queryParams.forEach(param => {
              if (param.key) {
                searchParams.append(param.key, param.value);
              }
            });
            const queryString = searchParams.toString();
            urlInput.value = queryString ? \`\${baseURL}?\${queryString}\` : baseURL;
          } else {
            urlInput.value = baseURL;
          }
          
          saveState();
        }

        function showLoading() {
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseBody = document.getElementById('responseBody');
          const responseTimeEl = document.getElementById('responseTime');
          const responseSizeEl = document.getElementById('responseSize');
          
          responseContainer.style.display = 'block';
          responseBox.className = 'response-container';
          responseStatus.textContent = 'Sending request...';
          
          // Clear timing displays
          const timeSpan = responseTimeEl.querySelector('span:last-child');
          if (timeSpan) timeSpan.textContent = '';
          const sizeSpan = responseSizeEl.querySelector('span:last-child');
          if (sizeSpan) sizeSpan.textContent = '';
          
          responseBody.innerHTML = '<div class="loading">🚀 Processing your request<br>Please wait...</div>';
        }

        function formatJSONWithCollapsible(json) {
          try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            const container = document.createElement('div');
            container.className = 'json-container';
            
            // Simple beautified JSON with syntax highlighting
            const beautifiedJson = JSON.stringify(obj, null, 2);
            const highlightedJson = syntaxHighlightJSON(beautifiedJson);
            
            container.innerHTML = highlightedJson;
            return container;
          } catch (e) {
            const container = document.createElement('div');
            container.className = 'json-container';
            container.textContent = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
            return container;
          }
        }

        function syntaxHighlightJSON(jsonString) {
          return jsonString
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
              let cls = 'json-number';
              if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                  cls = 'json-key';
                } else {
                  cls = 'json-string';
                }
              } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
              } else if (/null/.test(match)) {
                cls = 'json-null';
              }
              return '<span class="' + cls + '">' + match + '</span>';
            });
        }

        function showResponse(data, status, statusText, responseTime, headers = {}) {
          console.log('showResponse called with:', { data, status, statusText, responseTime, headers });
          
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseTimeEl = document.getElementById('responseTime');
          const responseSizeEl = document.getElementById('responseSize');
          const copyButton = document.getElementById('copyButton');
          const copyAsCurlButton = document.getElementById('copyAsCurlButton');

          responseContainer.style.display = 'block';
          responseBox.className = 'response-container response-success';
          responseStatus.innerHTML = \`✅ <strong>\${status}</strong> - \${statusText}\`;
          
          // Update response time
          const timeSpan = responseTimeEl.querySelector('span:last-child');
          if (timeSpan) {
            timeSpan.textContent = formatResponseTime(responseTime);
          }
          
          // Calculate and display response size
          const responseSize = data ? JSON.stringify(data).length : 0;
          const sizeSpan = responseSizeEl.querySelector('span:last-child');
          if (sizeSpan) {
            sizeSpan.textContent = formatResponseSize(responseSize);
          }
          
          // Display response data in body tab
          displayResponseData(data, 'pretty');
          
          // Display headers
          displayResponseHeaders(headers);
          
          // Update timing breakdown
          updateTimingBreakdown(responseTime);
          
          // Show buttons
          copyButton.style.display = 'block';
          copyAsCurlButton.style.display = 'block';
          copyButton.className = 'copy-button';
          copyAsCurlButton.className = 'copy-as-curl';
          copyButton.innerHTML = '<span class="material-icons">content_copy</span>';
          copyAsCurlButton.innerHTML = '<span class="material-icons">terminal</span>';
        }

        function showError(message, data, headers = {}) {
          console.log('showError called with:', { message, data, headers });
          
          const responseContainer = document.getElementById('responseContainer');
          const responseBox = document.getElementById('responseBox');
          const responseStatus = document.getElementById('responseStatus');
          const responseTimeEl = document.getElementById('responseTime');
          const responseSizeEl = document.getElementById('responseSize');
          const copyButton = document.getElementById('copyButton');
          const copyAsCurlButton = document.getElementById('copyAsCurlButton');

          responseContainer.style.display = 'block';
          responseBox.className = 'response-container response-error';
          responseStatus.innerHTML = \`❌ <strong>Error</strong>\`;
          
          // Clear timing displays
          const timeSpan = responseTimeEl.querySelector('span:last-child');
          if (timeSpan) timeSpan.textContent = '';
          const sizeSpan = responseSizeEl.querySelector('span:last-child');
          if (sizeSpan) sizeSpan.textContent = '';
          
          // Display error data if available
          if (data) {
            displayResponseData(data, 'pretty');
              copyButton.style.display = 'block';
          } else {
            const responseBody = document.getElementById('responseBody');
            responseBody.innerHTML = \`<div style="text-align: center; padding: 2rem; color: var(--gray-600);">
              <span class="material-icons" style="font-size: 3rem; margin-bottom: 1rem; display: block;">error</span>
              <div style="font-size: 1.1rem; font-weight: 500;">\${message}</div>
            </div>\`;
            copyButton.style.display = 'none';
          }
          
          // Display headers if available
          displayResponseHeaders(headers);
          
          copyAsCurlButton.style.display = 'block';
        }

        function copyResponse() {
          const responseBody = document.getElementById('responseBody');
          const button = document.getElementById('copyButton');
          
          vscode.postMessage({
            type: 'copyToClipboard',
            text: responseBody.textContent
          });
          
          // Enhanced copy feedback
          const originalHtml = button.innerHTML;
          button.innerHTML = '<span class="material-icons">check</span>';
          button.classList.add('success');
          
          setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('success');
          }, 2000);
          
          showCopyFeedback('Response copied to clipboard!');
        }

        function copyAsCurl() {
          const method = document.getElementById('method-select').value;
          const url = document.getElementById('url-input').value;
          const body = document.getElementById('body').value;
          const headers = collectParams('headers');
          const button = document.getElementById('copyAsCurlButton');
          
          vscode.postMessage({
            type: 'copyAsCurl',
            method,
            url,
            headers,
            body
          });
          
          // Enhanced copy feedback
          const originalHtml = button.innerHTML;
          button.innerHTML = '<span class="material-icons">check</span>';
          button.classList.add('success');
          
          setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('success');
          }, 2000);
          
          showCopyFeedback('cURL command copied to clipboard!');
        }

        function showCopyFeedback(message) {
          // Remove existing feedback
          const existingFeedback = document.querySelector('.copy-feedback');
          if (existingFeedback) {
            existingFeedback.remove();
          }
          
          // Create new feedback
          const feedback = document.createElement('div');
          feedback.className = 'copy-feedback';
          feedback.innerHTML = \`
            <span class="material-icons">check_circle</span>
            \${message}
          \`;
          
          document.body.appendChild(feedback);
          
          setTimeout(() => {
            feedback.remove();
          }, 3000);
        }

        function sendRequest() {
          const method = document.getElementById('method-select').value;
          const url = document.getElementById('url-input').value;
          const body = document.getElementById('body').value;
          const headers = collectParams('headers');
          const queryParams = collectParams('queryParams');
          const sendButton = document.getElementById('send-btn');

          if (!url) {
            showError('Please enter a URL');
            return;
          }

          try {
            new URL(url);
          } catch {
            showError('Please enter a valid URL');
            return;
          }

          if (body) {
            try {
              JSON.parse(body);
            } catch {
              showError('Invalid JSON in request body');
              return;
            }
          }

          // Enhanced button feedback
          const originalHtml = sendButton.innerHTML;
          sendButton.innerHTML = '<span class="material-icons">sync</span>Sending...';
          sendButton.disabled = true;

          showLoading();
          saveState();

          vscode.postMessage({ 
            type: 'sendRequest',
            method, 
            url, 
            headers, 
            body,
            queryParams 
          });
          
          // Reset button after a delay (will be reset properly when response comes)
          setTimeout(() => {
            sendButton.innerHTML = originalHtml;
            sendButton.disabled = false;
          }, 30000); // 30 second timeout
        }

        function openSaveDialog() {
          const dialog = document.getElementById('save-dialog');
          const nameInput = document.getElementById('request-name');
          
          dialog.classList.add('active');
          setTimeout(() => nameInput.focus(), 100);
        }

        function closeSaveDialog() {
          const dialog = document.getElementById('save-dialog');
          dialog.classList.remove('active');
        }

        function saveRequest() {
          const name = document.getElementById('request-name').value;
          if (!name.trim()) {
            document.getElementById('request-name').focus();
            return;
          }

          const requestData = {
            name: name.trim(),
            method: document.getElementById('method-select').value,
            url: document.getElementById('url-input').value,
            headers: collectParamsArray('headers'),
            body: document.getElementById('body').value,
            queryParams: collectParamsArray('queryParams')
          };

          vscode.postMessage({
            type: 'saveRequest',
            request: requestData
          });

          closeSaveDialog();
          showCopyFeedback(\`Request "\${name}" saved successfully!\`);
        }

        // Enhanced event listeners
        document.addEventListener('DOMContentLoaded', () => {
          initializeForm();
          initializeEnhancedFeatures();

          // Tab switching
          document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
              switchTab(tab.dataset.tab);
            });
          });

          // Response tab switching
          document.querySelectorAll('.response-tab').forEach(tab => {
            tab.addEventListener('click', () => {
              switchResponseTab(tab.dataset.responseTab);
            });
          });

          // Response format switching
          document.querySelectorAll('.response-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              switchResponseFormat(btn.dataset.format);
            });
          });

          // Button event listeners
          document.getElementById('send-btn').addEventListener('click', sendRequest);
          document.getElementById('save-btn').addEventListener('click', openSaveDialog);
          document.getElementById('copyButton').addEventListener('click', copyResponse);
          document.getElementById('copyAsCurlButton').addEventListener('click', copyAsCurl);
          
          // Dialog event listeners
          document.getElementById('dialog-cancel').addEventListener('click', closeSaveDialog);
          document.getElementById('dialog-save').addEventListener('click', saveRequest);
          
          // Close dialog on backdrop click
          document.getElementById('save-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'save-dialog') {
              closeSaveDialog();
            }
          });

          // Setup response search
          setupResponseSearch();
          
          // Keyboard shortcuts
          document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to send request
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              sendRequest();
            }
            
            // Escape to close dialog
            if (e.key === 'Escape') {
              closeSaveDialog();
            }
            
            // Ctrl/Cmd + S to save request
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              openSaveDialog();
            }
          });

          // Input change listeners
          document.getElementById('method-select').addEventListener('change', () => {
            updateMethodSelectColor();
            saveState();
          });
          document.getElementById('url-input').addEventListener('input', saveState);
          document.getElementById('body').addEventListener('input', saveState);
          
          // Enhanced URL input with better UX
          const urlInput = document.getElementById('url-input');
          urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendRequest();
            }
          });
          
          // Auto-save request name when typing
          const nameInput = document.getElementById('request-name');
          nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveRequest();
            }
          });
        });

        // Optimized Feature Initialization
        function initializeEnhancedFeatures() {
          // Minimal essential features only
          document.documentElement.style.scrollBehavior = 'smooth';
          
          // Initialize core features without delays
          initializeTooltips();
          initializeNotificationSystem();
        }

        // Removed button enhancements for faster loading

        function createRippleEffect(element, event) {
          const ripple = document.createElement('span');
          const rect = element.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;
          
          ripple.style.cssText = \`
            position: absolute;
            width: \${size}px;
            height: \${size}px;
            left: \${x}px;
            top: \${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
          \`;
          
          element.style.position = 'relative';
          element.style.overflow = 'hidden';
          element.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        }

        function initializeTooltips() {
          // Add tooltips to elements with data-tooltip attribute
          document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.classList.add('tooltip');
          });
          
          // Add tooltips to common elements
          const tooltipElements = [
            { selector: '#send-btn', text: 'Send Request (Ctrl+Enter)' },
            { selector: '#save-btn', text: 'Save Request (Ctrl+S)' },
            { selector: '#copyButton', text: 'Copy Response' },
            { selector: '#copyAsCurlButton', text: 'Copy as cURL' },
            { selector: '#method-select', text: 'Select HTTP Method' },
            { selector: '#url-input', text: 'Enter API URL' }
          ];
          
          tooltipElements.forEach(({ selector, text }) => {
            const element = document.querySelector(selector);
            if (element && !element.hasAttribute('data-tooltip')) {
              element.setAttribute('data-tooltip', text);
              element.classList.add('tooltip');
            }
          });
        }

        // Removed focus enhancements for faster loading

        function initializeNotificationSystem() {
          // Create notification container if it doesn't exist
          if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = \`
              position: fixed;
              top: 1rem;
              right: 1rem;
              z-index: 10000;
              pointer-events: none;
            \`;
            document.body.appendChild(container);
          }
        }

        function showNotification(message, type = 'info', duration = 4000) {
          const container = document.getElementById('notification-container');
          const notification = document.createElement('div');
          
          const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
          };
          
          notification.className = \`notification \${type}\`;
          notification.innerHTML = \`
            <div class="notification-content">
              <div class="notification-icon" style="background: var(--\${type})">
                \${icons[type] || icons.info}
              </div>
              <div class="notification-text">
                <div class="notification-message">\${message}</div>
              </div>
            </div>
          \`;
          
          container.appendChild(notification);
          
          // Auto remove after duration
          setTimeout(() => {
            notification.style.animation = 'slideInFromRight 0.3s reverse';
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove();
              }
            }, 300);
          }, duration);
          
          return notification;
        }

        function setButtonLoading(button, loading = true) {
          if (loading) {
            button.dataset.loading = 'true';
            button.classList.add('btn-loading');
            button.disabled = true;
          } else {
            button.dataset.loading = 'false';
            button.classList.remove('btn-loading');
            button.disabled = false;
          }
        }

        function animateElement(element, animation, duration = 300) {
          return new Promise(resolve => {
            element.style.animation = \`\${animation} \${duration}ms ease-out\`;
            setTimeout(() => {
              element.style.animation = '';
              resolve();
            }, duration);
          });
        }

        function smoothScrollTo(element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }

        // Enhanced form interactions
        function enhanceFormInputs() {
          // Add floating label effect
          document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
              input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
              if (!input.value) {
                input.parentElement.classList.remove('focused');
              }
            });
            
            // Check initial state
            if (input.value) {
              input.parentElement.classList.add('focused');
            }
          });
        }

        // Removed enhanced parameter row animations for better performance

        // Request Type Switching
        function switchRequestType(type) {
          currentState.type = type;
          
          // Update tabs
          document.querySelectorAll('.type-tab').forEach(tab => {
            if (tab.dataset.type === type) {
              tab.classList.add('active');
            } else {
              tab.classList.remove('active');
            }
          });

          // Update content visibility
          document.querySelectorAll('.request-content').forEach(content => {
            content.classList.remove('active');
          });
          
          if (type === 'graphql') {
            document.getElementById('graphql-content').classList.add('active');
          } else {
            document.getElementById('rest-content').classList.add('active');
          }
          
          saveState();
        }

        function switchGraphQLTab(tabId) {
          const tabs = document.querySelectorAll('#graphql-content .tab');
          const sections = document.querySelectorAll('#graphql-content .content-section');
          
          tabs.forEach(tab => tab.classList.remove('active'));
          sections.forEach(section => section.classList.remove('active'));
          
          document.querySelector(\`[data-tab="\${tabId}"]\`).classList.add('active');
          
          // Map tab IDs to section IDs
          const sectionMap = {
            'query': 'query-section',
            'variables': 'variables-section',
            'graphql-headers': 'graphql-headers-section'
          };
          
          document.getElementById(sectionMap[tabId]).classList.add('active');
        }

        // Enhanced method select with smooth transitions
        function updateMethodSelectColorEnhanced() {
          const select = document.getElementById('method-select');
          const method = select.value;
          
          // Add pulse animation
          select.style.animation = 'pulse 0.3s ease-out';
          
          setTimeout(() => {
            select.style.animation = '';
          }, 300);
          
          // Update color with transition
          const colors = {
            'GET': 'var(--method-get)',
            'POST': 'var(--method-post)',
            'PUT': 'var(--method-put)',
            'DELETE': 'var(--method-delete)',
            'PATCH': 'var(--method-patch)',
            'HEAD': 'var(--method-head)',
            'OPTIONS': 'var(--method-options)'
          };
          
          select.style.background = colors[method] || 'var(--gray-500)';
        }

        function sendGraphQLRequest() {
          const url = document.getElementById('graphql-url-input').value;
          const query = document.getElementById('graphql-query').value;
          const variables = document.getElementById('graphql-variables').value;
          const headers = collectParams('graphql-headers');
          const sendButton = document.getElementById('graphql-send-btn');

          if (!url) {
            showError('Please enter a GraphQL URL');
            return;
          }

          if (!query) {
            showError('Please enter a GraphQL Query');
            return;
          }

          // Enhanced button feedback
          const originalHtml = sendButton.innerHTML;
          sendButton.innerHTML = '<span class="material-icons">sync</span>Sending...';
          sendButton.disabled = true;

          showLoading();
          saveState();

          vscode.postMessage({ 
            type: 'sendRequest',
            requestType: 'graphql',
            method: 'POST', // GraphQL is always POST
            url, 
            headers, 
            body: JSON.stringify({
              query,
              variables: variables ? JSON.parse(variables) : undefined
            })
          });
          
          // Reset button after a delay
          setTimeout(() => {
            sendButton.innerHTML = originalHtml;
            sendButton.disabled = false;
          }, 30000);
        }

        // Update saveState to include GraphQL fields
        function saveState() {
          currentState = {
            type: document.querySelector('.type-tab.active').dataset.type,
            method: document.getElementById('method-select').value,
            url: document.getElementById('url-input').value,
            body: document.getElementById('body').value,
            queryParams: collectParamsArray('queryParams'),
            headers: collectParamsArray('headers'),
            graphqlUrl: document.getElementById('graphql-url-input').value,
            graphqlQuery: document.getElementById('graphql-query').value,
            graphqlVariables: document.getElementById('graphql-variables').value,
            graphqlHeaders: collectParamsArray('graphql-headers')
          };
          
          vscode.postMessage({
            type: 'saveState',
            state: currentState
          });
        }

        // Update initializeForm to restore GraphQL fields
        function initializeForm() {
          // Restore request type
          if (currentState.type) {
            switchRequestType(currentState.type);
          }

          // REST fields
          document.getElementById('method-select').value = currentState.method || 'GET';
          document.getElementById('url-input').value = currentState.url || '';
          document.getElementById('body').value = currentState.body || '';

          // Update method select color on initialization
          updateMethodSelectColor();

          const queryParamsContainer = document.getElementById('queryParams');
          queryParamsContainer.innerHTML = '';
          (currentState.queryParams || []).forEach(param => addParamRow('queryParams', param));
          if (!currentState.queryParams || currentState.queryParams.length === 0) {
            addParamRow('queryParams');
          }

          const headersContainer = document.getElementById('headers');
          headersContainer.innerHTML = '';
          (currentState.headers || []).forEach(header => addParamRow('headers', header));
          if (!currentState.headers || currentState.headers.length === 0) {
            addParamRow('headers');
          }

          // GraphQL fields
          document.getElementById('graphql-url-input').value = currentState.graphqlUrl || '';
          document.getElementById('graphql-query').value = currentState.graphqlQuery || '';
          document.getElementById('graphql-variables').value = currentState.graphqlVariables || '';

          const graphqlHeadersContainer = document.getElementById('graphql-headers');
          graphqlHeadersContainer.innerHTML = '';
          (currentState.graphqlHeaders || []).forEach(header => addParamRow('graphql-headers', header));
          if (!currentState.graphqlHeaders || currentState.graphqlHeaders.length === 0) {
            addParamRow('graphql-headers');
          }
        }

        // Message handler for VS Code communication
        window.addEventListener('message', event => {
          const message = event.data;
          console.log('Received message:', message);
          
          switch (message.type) {
            case 'response':
              console.log('Handling response:', message);
              document.getElementById('send-btn').innerHTML = '<span class="material-icons">send</span>Send';
              document.getElementById('send-btn').disabled = false;
              document.getElementById('graphql-send-btn').innerHTML = '<span class="material-icons">send</span>Send';
              document.getElementById('graphql-send-btn').disabled = false;
              showResponse(message.data, message.status, message.statusText, message.responseTime, message.headers || {});
              break;
              
            case 'error':
              console.log('Handling error:', message);
              document.getElementById('send-btn').innerHTML = '<span class="material-icons">send</span>Send';
              document.getElementById('send-btn').disabled = false;
              document.getElementById('graphql-send-btn').innerHTML = '<span class="material-icons">send</span>Send';
              document.getElementById('graphql-send-btn').disabled = false;
              showError(message.message, message.data, message.headers || {});
              break;
              
            case 'copySuccess':
              console.log('Copy success:', message);
              showCopyFeedback(message.message || 'Copied to clipboard!');
              break;
              
            default:
              console.warn('Unknown message type:', message.type);
          }
        });

        // Add event listeners for GraphQL elements
        document.addEventListener('DOMContentLoaded', () => {
            // ... existing listeners ...
            document.getElementById('graphql-send-btn').addEventListener('click', sendGraphQLRequest);
            
            // GraphQL input listeners for auto-save
            document.getElementById('graphql-url-input').addEventListener('input', saveState);
            document.getElementById('graphql-query').addEventListener('input', saveState);
            document.getElementById('graphql-variables').addEventListener('input', saveState);
        });
      </script>
    </body>
    </html>
  `;
} 
