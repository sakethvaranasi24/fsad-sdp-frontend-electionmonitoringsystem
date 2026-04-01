import RoleLoginTemplate from './RoleLoginTemplate';
import rolePaths from './rolePaths';

function ElectionObserverLogin({ onLogin }) {
  return (
    <RoleLoginTemplate
      role="electionobserver"
      title="Election Observer Login"
      subtitle="Access observation and transparency tools"
      loginPath={rolePaths.electionobserver.loginPath}
      registerPath={rolePaths.electionobserver.registerPath}
      supportLabel="Contact Administrator"
      onLogin={onLogin}
    />
  );
}

export default ElectionObserverLogin;
