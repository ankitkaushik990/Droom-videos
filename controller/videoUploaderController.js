const videoService = require("../service/videoUploaderService");
const jwtUtils = require("../utils/jwtutils");

const uploadVideo = (req, res) => {
  const videoFilePath = req.file.path;
  const videoFileType = req.file.mimetype;
  const { title, description } = req.body;

  // Extract user ID from JWT token
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token not found" });
  }

  try {
    const decodedToken = jwtUtils.verifyToken(token);

    const userId = decodedToken.id;
    console.log("Decoded Token:", decodedToken);

    videoService
      .saveVideo(videoFilePath, videoFileType, title, description, userId)
      .then((message) => {
        res.json({ message });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: error.message || "Failed to save video to database" });
      });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  uploadVideo,
};
