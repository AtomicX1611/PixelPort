import multer from "multer";
import {v4 as uuidv4} from "uuid";

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE[file.mimetype];
    let error = isValid ? null : new Error("File isnt acceptable");
    cb(error,isValid)
  },
});

export default fileUpload;
