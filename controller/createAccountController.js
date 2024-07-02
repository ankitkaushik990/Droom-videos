const singupService = require("../service/createAccountService");
const logger = require("../config/logger");

const jwtUtils = require("../utils/jwtutils");

exports.createAccount = async (req, res) => {
  try {
    logger.info("in signup controller");
    const { firstName, lastName, email, number } = req.body;
    await singupService.createAccountInService(
      firstName,
      lastName,
      email,
      number
    );
    res.status(201).send({ message: "Signup Successfull" });
  } catch (error) {
    logger.error(error.message);
    res.status(401).send({ message: error.message });
  }
};

exports.updateBio = async (req, res) => {
  try {
    // Extract the token from Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token and decode payload
    const decodedToken = jwtUtils.verifyToken(token);

    // Extract user ID from decoded token
    const userId = decodedToken.id;

    // Call service to update bio
    const updatedUser = await singupService.updateUserBio(userId, req.body.bio);

    res.status(200).send({
      message: "Bio updated successfully",
      user: {
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ message: error.message });
  }
};
