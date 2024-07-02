const fs = require("fs");
const Video = require("../Model/videoModel");
const User = require("../Model/userModel");

const saveVideo = (
  videoFilePath,
  videoFileType,
  title,
  description,
  userId
) => {
  return new Promise((resolve, reject) => {
    fs.readFile(videoFilePath, (err, data) => {
      if (err) {
        return reject(new Error("Failed to read video file"));
      }

      const newVideo = new Video({
        title,
        description,
        videoData: data,
        videoPath: videoFilePath,
        contentType: videoFileType,
        user: userId, // Save user ID with the video
      });

      newVideo
        .save()
        .then((savedVideo) => {
          // Update the User document to include the uploaded video's ID
          return User.findByIdAndUpdate(
            userId,
            { $push: { uploadedVideos: savedVideo._id } },
            { new: true } // To return the updated document
          );
        })
        .then((updatedUser) => {
          // Optionally delete the file from the server after saving to the database
          fs.unlink(videoFilePath, (err) => {
            if (err) {
              return reject(new Error("Failed to delete temporary video file"));
            }
            resolve({
              message: "Video uploaded and saved to database successfully",
              video: updatedUser.uploadedVideos.slice(-1)[0], // Get the last uploaded video ID
            });
          });
        })
        .catch((err) => {
          reject(new Error("Failed to save video to database"));
        });
    });
  });
};

module.exports = {
  saveVideo,
};
