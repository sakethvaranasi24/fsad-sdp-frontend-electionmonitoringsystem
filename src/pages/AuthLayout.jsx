import './AuthPages.css';

function AuthLayout({ children }) {
  return (
    <>
      <nav className="auth-navbar">
        <span className="auth-brand-name">Election Monitoring System</span>
      </nav>

      <div className="auth-container">
        <div className="auth-hero">
          <div className="auth-hero-logo" aria-hidden="true">
            <svg viewBox="0 0 120 120" role="img" aria-label="Election monitoring logo">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 40 58 L 54 72 L 82 46" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 60 18 L 60 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M 60 90 L 60 102" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M 18 60 L 30 60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M 90 60 L 102 60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="auth-hero-copy">
            <h1>Election Monitoring System</h1>
            <p>Secure and transparent election oversight</p>
          </div>
        </div>

        <div className="auth-content">{children}</div>
      </div>
    </>
  );
}

export default AuthLayout;
