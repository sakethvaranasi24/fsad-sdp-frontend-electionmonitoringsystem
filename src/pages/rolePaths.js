const API_URL = import.meta.env.VITE_API_URL;

const rolePaths = {
  admin: {
    loginPath: `${API_URL}/adminapi/login`,
    registerPath: `${API_URL}/adminapi/register`
  },
  citizen: {
    loginPath: `${API_URL}/citizenapi/login`,
    registerPath: `${API_URL}/citizenapi/register`
  },
  dataanalysts: {
    loginPath: `${API_URL}/analystapi/login`,
    registerPath: `${API_URL}/analystapi/register`
  },
  electionobserver: {
    loginPath: `${API_URL}/observerapi/login`,
    registerPath: `${API_URL}/observerapi/register`
  }
};

export default rolePaths;
