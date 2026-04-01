import RoleLoginTemplate from './RoleLoginTemplate';
import rolePaths from './rolePaths';

function DataAnalystLogin({ onLogin }) {
  return (
    <RoleLoginTemplate
      role="dataanalysts"
      title="Data Analyst Login"
      subtitle="Access analytics and trend reports"
      loginPath={rolePaths.dataanalysts.loginPath}
      registerPath={rolePaths.dataanalysts.registerPath}
      supportLabel="Contact Administrator"
      onLogin={onLogin}
    />
  );
}

export default DataAnalystLogin;
