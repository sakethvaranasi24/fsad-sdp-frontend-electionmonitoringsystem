import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const roleCards = [
  {
    title: 'Admin',
    description: 'Manage system-level election settings and users.',
    path: '/login/admin'
  },
  {
    title: 'Citizen',
    description: 'Access citizen services and election details.',
    path: '/login/citizen'
  },
  {
    title: 'Data Analyst',
    description: 'Review election data, trends, and reports.',
    path: '/login/dataanalyst'
  },
  {
    title: 'Election Observer',
    description: 'Track transparency and field observations.',
    path: '/login/electionobserver'
  }
];

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-header">
          <h2>Choose Your Role</h2>
          <p>Select a role to continue to login</p>
        </div>

        <div className="role-grid">
          {roleCards.map((role) => (
            <button
              key={role.path}
              className="role-card"
              type="button"
              onClick={() => navigate(role.path)}
            >
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}

export default RoleSelection;
