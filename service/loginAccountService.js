const User = require("../Model/userModel");
const jwtUtils = require("../utils/jwtutils");

// Function to login user
exports.loginInService = async (firstName, password) => {
  try {
    // Find user by firstName and password
    const user = await User.findOne({ firstName, password });

    if (!user) {
      throw new Error("Credentials incorrect");
    }

    // Generate JWT token with user details
    const tokenPayload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      number: user.number,
      bio: user.bio,
    };
    const token = jwtUtils.generateToken(tokenPayload);

    return { user, token }; // Return only the token
  } catch (error) {
    throw new Error(error.message);
  }
};
