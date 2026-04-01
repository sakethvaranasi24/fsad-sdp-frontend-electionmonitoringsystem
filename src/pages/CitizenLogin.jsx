import RoleLoginTemplate from './RoleLoginTemplate';
import rolePaths from './rolePaths';

function CitizenLogin({ onLogin }) {
  return (
    <RoleLoginTemplate
      role="citizen"
      title="Citizen Login"
      subtitle="Access your election monitoring space"
      loginPath={rolePaths.citizen.loginPath}
      registerPath={rolePaths.citizen.registerPath}
      supportLabel="Help & Support"
      onLogin={onLogin}
      citizenMode
    />
  );
}

export default CitizenLogin;
