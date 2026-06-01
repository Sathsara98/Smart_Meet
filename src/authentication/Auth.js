// Get the saved token from browser localStorage
const getToken = () => {
    return localStorage.getItem('token');
}

// Get the logged-in user's role/level
const getUserLevel = () => {
    // First check whether user is logged in
    if (isAuthenticated()) {
        // Convert token into readable user data
        const user = parseJwt(getToken());

        // Return user role, example: "Admin", "Secretary", "Member"
        return user.role;
    }
}

// Check whether user is logged in or not
const isAuthenticated = () => {
    // If token is not available, user is not logged in
    if (getToken() == null) {
        return false;
    } else {
        // If token exists, user is logged in
        return true;
    }
}

// Get logged-in user's ID from token
const getUserId = () => {
    let uId = null;

    // Decode token and get user details
    const user = parseJwt(getToken());

    // Get user id from decoded token
    uId = user.id;

    return uId;
}

// Get logged-in user's name
const getUserName = () => {
    // Check user is logged in
    if (isAuthenticated()) {
        // Decode token and get user details
        const user = parseJwt(getToken());

        // Print decoded user details in browser console
        console.log("Decoded User:", user);

        // Return user name
        // If name is missing, return "User"
        return user.name || "User";
    }

    // If user is not logged in, return default name
    return "User";
}

// Decode JWT token
// JWT token has 3 parts separated by dots:
// header.payload.signature
// This function reads the payload part
const parseJwt = (token) => {
    // If token is empty, stop the function
    if (!token) { return; }

    // Get the second part of the token
    // This part contains user data
    const base64Url = token.split('.')[1];

    // Convert base64Url format into normal base64 format
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    // Decode base64 string and convert it into JavaScript object
    return JSON.parse(window.atob(base64));
}

// Logout user
const logout = (callback) => {
    // Check whether user is logged in
    if (isAuthenticated()) {
        // Remove token from localStorage
        localStorage.removeItem('token');

        console.log("User Logged Out");

        // Send true after logout success
        callback(true);
    } else {
        // Send false if user was not logged in
        callback(false);
    }
}

// Export these functions so other files can use them
module.exports = {
    getToken,
    getUserLevel,
    isAuthenticated,
    getUserId,
    getUserName,
    logout
}

