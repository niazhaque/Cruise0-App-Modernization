
exports.onExecutePreUserRegistration = async (event, api) => {
  const email = event.user.email;
  try {
    const resp = await fetch(`https://www.disify.com/api/email/${encodeURIComponent(email)}`);
    const data = await resp.json();
    if (data.disposable === true) {
      api.access.deny('Disposable emails are not allowed. Use a permanent email.');
    }
  } catch (e) {
    api.user.setUserMetadata('registration_check', { disposable_check: 'failed', ts: new Date().toISOString() });
  }
};
