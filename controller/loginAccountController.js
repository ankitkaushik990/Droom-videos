const loginService = require("../service/loginAccountService");
const logger = require("../config/logger");

exports.loginAccount = async (req, res) => {
  try {
    logger.info("in login controller");
    const { firstName, userPassword } = req.body;
    const { user, token } = await loginService.loginInService(
      firstName,
      userPassword
    );

    // Fetch uploaded videos with data
    const uploadedVideos = await loginService.getUploadedVideosWithData(
      user._id
    );
    console.log("Uploaded videos count:", uploadedVideos.length);

    res.status(200).send({
      message: "Login Successful",
      user: user,
      token: token,
      uploadedVideos: uploadedVideos, // Include uploaded videos in response
    });
  } catch (error) {
    logger.error(error.message);
    res.status(401).send({ message: error.message });
  }
};
