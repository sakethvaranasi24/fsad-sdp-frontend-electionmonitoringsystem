import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from './AuthLayout';
import { setToken } from '../utils/auth';

const REGISTERED_USERS_KEY = 'emsRegisteredUsers';
const CURRENT_USER_KEY = 'user';
const ADMIN_PROFILE_KEY = 'emsAdminProfile';
const OBSERVER_PROFILE_KEY = 'emsObserverProfile';
const ANALYST_PROFILE_KEY = 'emsAnalystProfile';
const CITIZEN_PROFILE_KEY = 'emsCitizenProfile';

function normalizeRoleToAppRole(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  if (normalized === 'ADMIN') {
    return 'admin';
  }
  if (normalized === 'CITIZEN') {
    return 'citizen';
  }
  if (normalized === 'DATA_ANALYST' || normalized === 'DATAANALYSTS' || normalized === 'DATA_ANALYSTS') {
    return 'dataanalysts';
  }
  if (normalized === 'ELECTION_OBSERVER' || normalized === 'ELECTIONOBSERVER' || normalized === 'OBSERVER') {
    return 'electionobserver';
  }

  const fallback = value.trim().toLowerCase();
  if (fallback === 'admin' || fallback === 'citizen' || fallback === 'dataanalysts' || fallback === 'electionobserver') {
    return fallback;
  }

  return null;
}

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

function getRoleLabel(role) {
  if (role === 'admin') return 'Admin';
  if (role === 'citizen') return 'Citizen';
  if (role === 'dataanalysts') return 'Data Analyst';
  if (role === 'electionobserver') return 'Election Observer';
  return 'User';
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
        await axios.post(registerPath, payload);

        if (autoLoginAfterRegister) {
          onLogin(role);
          toast.success(`${getRoleLabel(role)} logged in successfully.`);
          navigate(`/${role}`);
          return;
        }

        resetRegistrationState();
        setShowRegistration(false);
        setRegistrationSuccess('Registration successful. Login with your registered details.');
        toast.success('Registration successful. Please login.');
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
        toast.success(`${getRoleLabel(role)} logged in successfully.`);
        navigate(`/${role}`);
        return;
      }

      resetRegistrationState();
      setShowRegistration(false);
      setRegistrationSuccess('Registration successful. Login with your registered details.');
      toast.success('Registration successful. Please login.');
    } catch (error) {
      console.error('Registration error:', error);
      const apiMessage =
        typeof error?.response?.data === 'string'
          ? error.response.data
          : error?.response?.data?.message;
      setRegistrationError(apiMessage || 'Registration failed. Please try again.');
      toast.error(apiMessage || 'Registration failed. Please try again.');
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
        const response = await axios.post(loginPath, payload);
        const loginData = response.data;
        const responseObject = loginData?.response && typeof loginData.response === 'object'
          ? loginData.response
          : loginData;

        const baseResponse = responseObject && typeof responseObject === 'object' ? responseObject : {};
        const payloadEmail = payload?.email || '';
        const payloadUsername = payload?.username || '';
        const responseEmail =
          baseResponse?.email
          || baseResponse?.mail
          || baseResponse?.mailId
          || baseResponse?.userEmail
          || baseResponse?.emailId
          || '';
        const usernameAsEmail =
          (baseResponse?.username && baseResponse.username.includes('@') ? baseResponse.username : '')
          || (baseResponse?.userName && baseResponse.userName.includes('@') ? baseResponse.userName : '')
          || (payloadUsername && payloadUsername.includes('@') ? payloadUsername : '');
        const fallbackName = baseResponse?.name
          || baseResponse?.adminName
          || baseResponse?.observerName
          || baseResponse?.analystName
          || baseResponse?.citizenName
          || baseResponse?.userName
          || baseResponse?.username
          || payloadUsername
          || (payloadEmail ? payloadEmail.split('@')[0] : '');

        const mergedUserProfile = {
          ...baseResponse,
          role: baseResponse?.role || role,
          name: fallbackName,
          userName: baseResponse?.userName || baseResponse?.username || payloadUsername,
          username: baseResponse?.username || baseResponse?.userName || payloadUsername,
          email: responseEmail || payloadEmail || usernameAsEmail,
          aadhaarNumber: baseResponse?.aadhaarNumber || payload?.aadhaarNumber || '',
          password: payload?.password || ''
        };

        // Persist token if backend returned one (supports common token field names)
        const possibleToken = (
          loginData?.token
          || loginData?.accessToken
          || loginData?.access_token
          || loginData?.jwt
          || loginData?.authToken
          || responseObject?.token
          || responseObject?.accessToken
          || responseObject?.access_token
          || responseObject?.jwt
          || responseObject?.authToken
          || baseResponse?.token
          || baseResponse?.accessToken
        );

        if (possibleToken) {
          try {
            setToken(possibleToken, { remember: rememberMe });
          } catch (e) {
            console.error('Failed to save auth token', e);
          }
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mergedUserProfile));

        if (role === 'admin') {
          localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(mergedUserProfile));
        }

        if (role === 'electionobserver') {
          localStorage.setItem(OBSERVER_PROFILE_KEY, JSON.stringify(mergedUserProfile));
        }

        if (role === 'dataanalysts') {
          localStorage.setItem(ANALYST_PROFILE_KEY, JSON.stringify(mergedUserProfile));
        }

        if (role === 'citizen') {
          localStorage.setItem(CITIZEN_PROFILE_KEY, JSON.stringify(mergedUserProfile));
        }

        const resolvedRole = normalizeRoleToAppRole(mergedUserProfile?.role) || role;
        onLogin(resolvedRole, mergedUserProfile);
        toast.success(`${getRoleLabel(resolvedRole)} logged in successfully.`);
        navigate(`/${resolvedRole}`);
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
        toast.success(`${getRoleLabel(role)} logged in successfully.`);
        navigate(`/${role}`);
        return;
      }

      try {
        await axios.post(loginPath, payload);
        onLogin(role);
        toast.success(`${getRoleLabel(role)} logged in successfully.`);
        navigate(`/${role}`);
        return;
      } catch (err) {
        console.error('Backend login failed:', err);
      }

      setLoginError('Wrong credentials');
      toast.error('Wrong credentials');
    } catch (error) {
      console.error('Login error:', error);
      const apiMessage =
        typeof error?.response?.data === 'string'
          ? error.response.data
          : error?.response?.data?.message;
      setLoginError(apiMessage || 'An error occurred. Please try again.');
      toast.error(apiMessage || 'An error occurred. Please try again.');
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
