const { spawn } = require("child_process");
const { createWriteStream } = require("fs");
const cmd = require("node-cmd");
const path = require("path");

const Videos = require("../models/videos.model");
const port = process.env.PORT;

// const ffmpegPath = "../bin/ffmpeg.exe";
const width = 1280;
const height = 720;

const generateThumbnail = async (
  username,
  creatorsName,
  title,
  summary,
  videoFileName,
  target,
  duration,
  res
) => {
  let thumbPath = path.join(
    path.resolve(),
    `/media/uploads/video_thumbnails/${videoFileName}.jpg`
  );
  thumbPath = thumbPath.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi/gi, "");
  cmd.run(
    `ffmpeg.exe -i ${target} -ss 00:01:00.00 -r 1 -s ${width}x${height} -an -vframes 1 -f mjpeg ${thumbPath}`,
    () => {
      console.log("thumbnail created");
    }
  );

  // ffmpeg.stdout.pipe(tmpFile);
  const video = new Videos({
    uploader: username,
    creatorsName,
    title: title,
    summery: summary,
    duration: duration,
    VideoUrl: target,
    thumbnailUrl:
      "http://127.0.0.1:" +
      port +
      "/api/videos/video_thumbnails/" +
      encodeURIComponent(
        videoFileName.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi/gi, "") + ".jpg"
      ),
  });
  video
    .save()
    .then((result) => {
      console.log(result);
      return res.status(201).json({
        success: true,
        msg: "Video uploaded Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    });
};

module.exports = generateThumbnail;
