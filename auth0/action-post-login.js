
exports.onExecutePostLogin = async (event, api) => {
  if (!event.user.email_verified) {
    api.access.deny('Please verify your email before logging in.');
    return;
  }
  try {
    const ip = event.request.ip;
    const geoUrl = event.secrets.GEO_API_URL || `https://ipapi.co/${ip}/json/`;
    const r = await fetch(geoUrl);
    const j = await r.json();
    if (j && (j.country_name || j.country)) {
      const ctry = j.country_name || j.country;
      api.user.setUserMetadata('country', ctry);
    }
  } catch (e) {}
  const isSocial = event.authentication && event.authentication.methods?.some(m => m.name === 'federated');
  if (!isSocial) api.multifactor.enable('any');
};
