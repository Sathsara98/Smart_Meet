// Auth.js contains helper functions for authentication.
// These functions read the saved login token from the browser
// and tell other parts of the app if the user is logged in.

const getToken = () => {
    // Read the saved token from browser storage
    return localStorage.getItem('token');
}

const getUserLevel = () => {
    if (isAuthenticated()) {
        // Decode the token and return the role field, e.g. admin or user
        const user = parseJwt(getToken());
        return user.role;
    }
}

const isAuthenticated = () => {
    // If there is no saved token, user is not logged in.
    if (getToken() == null) {
        return false;
    } else {
        return true;
    }
}

const getUserId = () => {
    let uId = null;
    const user = parseJwt(getToken());
    // Return the user id stored inside the token payload.
    uId = user.id;
    return uId;
}

const getUserName = () => {
    if (isAuthenticated()) {
        const user = parseJwt(getToken());
        console.log("Decoded User:", user);
        // If there is a name in the token, return it. Otherwise use a fallback.
        return user.name || "User";
    }
    return "User";
}

const parseJwt = (token) => {
    if (!token) { return; }
    // Tokens are encoded as three parts separated by dots.
    // We decode the middle part to read the user data.
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

const logout = (callback) => {
    if (isAuthenticated()) {
        // Remove the saved login token and tell the caller the user logged out.
        localStorage.removeItem('token');
        console.log("User Logged Out")
        callback(true);
    } else {
        callback(false);
    }
}

module.exports = {
    getToken,
    getUserLevel,
    isAuthenticated,
    getUserId,
    getUserName,
    logout
}