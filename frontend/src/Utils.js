
const MAX_CREDENTIALS_LEN = {
  username: 20,
  password: 20,
}

const handleFetchError = (res) => {
    if (res.ok) {
        return res;
    } else {
        let reason;
        switch(res.status) {
          case 401:
            reason = 'Access denied: Not authenticated (401)'; break;  // TRANSLATE
          case 403:
            reason = 'Access denied: Not authorised (403)'; break;  // TRANSLATE
          default:
            reason = `(Status ${res.status})`; break;  // TRANSLATE
        }

        throw Error(reason);
    }
}

module.exports = {
    handleFetchError,

    // Constants
    MAX_CREDENTIALS_LEN,
}