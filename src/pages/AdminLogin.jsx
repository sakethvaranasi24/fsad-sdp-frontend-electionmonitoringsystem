import RoleLoginTemplate from './RoleLoginTemplate';
import rolePaths from './rolePaths';

function AdminLogin({ onLogin }) {
  return (
    <RoleLoginTemplate
      role="admin"
      title="Admin Login"
      subtitle="Access administrative controls"
      loginPath={rolePaths.admin.loginPath}
      registerPath={rolePaths.admin.registerPath}
      supportLabel="Contact Administrator"
      onLogin={onLogin}
      autoLoginAfterRegister
    />
  );
}

export default AdminLogin;
