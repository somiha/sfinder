const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload/");
  },

  filename: function (req, file, cb) {
    const filename = file.originalname.replace(/\s+/g, "_"); // replace spaces with underscores
    const fileExtension = file.originalname.split(".").pop(); // get the file extension
    const truncatedFilename = filename.substring(0, 47) + "." + fileExtension; // truncate to 50 characters and add file extension
    cb(null, truncatedFilename);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
