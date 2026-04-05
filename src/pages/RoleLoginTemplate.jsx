import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const REGISTERED_USERS_KEY = 'emsRegisteredUsers';

function getRegisteredUsers() {
  const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!storedUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(storedUsers);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

function RoleLoginTemplate({
  role,
  title,
  subtitle,
  loginPath,
  registerPath,
  supportLabel,
  onLogin,
  citizenMode = false,
  autoLoginAfterRegister = false
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [username, setUsername] = useState('');
  const [aadhaarId, setAadhaarId] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');

  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationUsername, setRegistrationUsername] = useState('');
  const [registrationAadhaar, setRegistrationAadhaar] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loginError, setLoginError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState('');

  const isBackendRole = role === 'admin' || role === 'citizen' || role === 'dataanalysts' || role === 'electionobserver';

  const resetRegistrationState = () => {
    setRegistrationUsername('');
    setRegistrationAadhaar('');
    setRegistrationEmail('');
    setRegistrationPassword('');
    setConfirmPassword('');
    setRegistrationError('');
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    setRegistrationSuccess('');

    if (registrationPassword !== confirmPassword) {
      setRegistrationError('Passwords do not match.');
      return;
    }

    let payload;

    if (citizenMode) {
      const normalizedUsername = registrationUsername.trim().toLowerCase();
      const normalizedAadhaar = registrationAadhaar.replace(/\D/g, '').slice(0, 12);

      if (!normalizedUsername || !normalizedAadhaar || !registrationPassword || !confirmPassword) {
        setRegistrationError('Please enter all required details.');
        return;
      }

      if (normalizedAadhaar.length !== 12) {
        setRegistrationError('Aadhaar number must be 12 digits.');
        return;
      }

      payload = {
        username: normalizedUsername,
        aadhaarNumber: normalizedAadhaar,
        password: registrationPassword
      };
    } else {
      const normalizedEmail = registrationEmail.trim().toLowerCase();

      if (!normalizedEmail || !registrationPassword || !confirmPassword) {
        setRegistrationError('Please enter all required details.');
        return;
      }

      payload = {
        email: normalizedEmail,
        password: registrationPassword
      };
    }

    try {
      if (isBackendRole) {
        const response = await fetch(registerPath, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          setRegistrationError(errorText || 'Registration failed. Please try again.');
          return;
        }

        if (autoLoginAfterRegister) {
          onLogin(role);
          navigate(`/${role}`);
          return;
        }

        resetRegistrationState();
        setShowRegistration(false);
        setRegistrationSuccess('Registration successful. Login with your registered details.');
        return;
      }

      // Keep existing local registration flow for non-admin roles.
      const users = getRegisteredUsers();
      if (citizenMode) {
        users.push({
          role,
          username: registrationUsername.trim().toLowerCase(),
          aadhaarNumber: registrationAadhaar.replace(/\D/g, '').slice(0, 12),
          password: registrationPassword
        });
      } else {
        users.push({
          role,
          email: registrationEmail.trim().toLowerCase(),
          password: registrationPassword
        });
      }
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

      if (autoLoginAfterRegister) {
        onLogin(role);
        navigate(`/${role}`);
        return;
      }

      resetRegistrationState();
      setShowRegistration(false);
      setRegistrationSuccess('Registration successful. Login with your registered details.');
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('Registration failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setRegistrationSuccess('');

    const payload = citizenMode
      ? {
          username: username.trim().toLowerCase(),
          aadhaarNumber: aadhaarId.replace(/\D/g, '').slice(0, 12),
          password: citizenPassword
        }
      : {
          email: email.trim().toLowerCase(),
          password
        };

    try {
      if (isBackendRole) {
        const response = await fetch(loginPath, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          setLoginError(errorText || 'Wrong credentials');
          return;
        }

        onLogin(role);
        navigate(`/${role}`);
        return;
      }

      // Existing local login flow for non-admin roles.
      const users = getRegisteredUsers();
      let userFound = false;

      if (citizenMode) {
        userFound = users.some(user =>
          user.role === role &&
          user.username === payload.username &&
          user.aadhaarNumber === payload.aadhaarNumber &&
          user.password === payload.password
        );
      } else {
        userFound = users.some(user =>
          user.role === role &&
          user.email === payload.email &&
          user.password === payload.password
        );
      }

      if (userFound) {
        onLogin(role);
        navigate(`/${role}`);
        return;
      }

      try {
        const response = await fetch(loginPath, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          onLogin(role);
          navigate(`/${role}`);
          return;
        }
      } catch (err) {
        console.error('Backend login failed:', err);
      }

      setLoginError('Wrong credentials');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {!showRegistration && registrationSuccess && (
          <p className="auth-status auth-status-success">{registrationSuccess}</p>
        )}

        {!showRegistration ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {citizenMode ? (
              <>
                <div className="auth-form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label htmlFor="aadhaar">Aadhaar Number *</label>
                  <input
                    type="text"
                    id="aadhaar"
                    placeholder="Enter 12-digit Aadhaar Number"
                    value={aadhaarId}
                    onChange={(e) => setAadhaarId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    maxLength="12"
                    pattern="\d{12}"
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label htmlFor="citizen-password">Password *</label>
                  <input
                    type="password"
                    id="citizen-password"
                    placeholder="Enter your password"
                    value={citizenPassword}
                    onChange={(e) => setCitizenPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="auth-form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form-options">
                  <label className="auth-remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember Me</span>
                  </label>
                  <a href="#" className="auth-forgot">Forgot Password?</a>
                </div>
              </>
            )}

            <button type="submit" className="auth-button">
              Login
            </button>

            {loginError && <p className="auth-status auth-status-error">{loginError}</p>}

            <div className="auth-links">
              <button
                type="button"
                className="auth-link-button"
                onClick={() => {
                  setShowRegistration(true);
                  setLoginError('');
                  setRegistrationSuccess('');
                  setRegistrationError('');
                }}
              >
                New Registration
              </button>
              <span className="auth-separator">|</span>
              <a href="#" className="auth-link-anchor">{supportLabel}</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegistrationSubmit} className="auth-form">
            {citizenMode ? (
              <>
                <div className="auth-form-group">
                  <label htmlFor="registration-username">Username *</label>
                  <input
                    type="text"
                    id="registration-username"
                    placeholder="Choose username"
                    value={registrationUsername}
                    onChange={(e) => setRegistrationUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label htmlFor="registration-aadhaar">Aadhaar Number *</label>
                  <input
                    type="text"
                    id="registration-aadhaar"
                    placeholder="Enter 12-digit Aadhaar Number"
                    value={registrationAadhaar}
                    onChange={(e) =>
                      setRegistrationAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))
                    }
                    maxLength="12"
                    pattern="\d{12}"
                    required
                  />
                </div>
              </>
            ) : (
              <div className="auth-form-group">
                <label htmlFor="registration-email">Email Address *</label>
                <input
                  type="email"
                  id="registration-email"
                  placeholder="Enter your email"
                  value={registrationEmail}
                  onChange={(e) => setRegistrationEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="registration-password">Password *</label>
              <input
                type="password"
                id="registration-password"
                placeholder="Create password"
                value={registrationPassword}
                onChange={(e) => setRegistrationPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="confirm-password">Confirm Password *</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {registrationError && <p className="auth-status auth-status-error">{registrationError}</p>}

            <button type="submit" className="auth-button">
              Register
            </button>

            <div className="auth-links">
              <button
                type="button"
                className="auth-link-button"
                onClick={() => {
                  setShowRegistration(false);
                  setRegistrationError('');
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

export default RoleLoginTemplate;
