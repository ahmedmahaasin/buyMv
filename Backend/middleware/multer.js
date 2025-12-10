// multer.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import path from "path";

// Memory storage for multer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// Wrap single file uploads
const originalSingle = upload.single.bind(upload);
upload.single = (fieldName) => {
  const multerMiddleware = originalSingle(fieldName);
  return async (req, res, next) => {
    multerMiddleware(req, res, async (err) => {
      if (err) return next(err);
      try {
        if (req.file) {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "uploads" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
          // Add the Cloudinary URL to req.file
          req.file.path = result.secure_url;
          req.file.url = result.secure_url;
        }
        next();
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }
    });
  };
};

// Wrap multiple files uploads
const originalArray = upload.array.bind(upload);
upload.array = (fieldName, maxCount) => {
  const multerMiddleware = originalArray(fieldName, maxCount);
  return async (req, res, next) => {
    multerMiddleware(req, res, async (err) => {
      if (err) return next(err);
      try {
        if (req.files && req.files.length > 0) {
          for (let file of req.files) {
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "uploads" },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result);
                }
              );
              streamifier.createReadStream(file.buffer).pipe(stream);
            });
            file.path = result.secure_url;
            file.url = result.secure_url;
          }
        }
        next();
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }
    });
  };
};

// Wrap fields uploads
const originalFields = upload.fields.bind(upload);
upload.fields = (fields) => {
  const multerMiddleware = originalFields(fields);
  return async (req, res, next) => {
    multerMiddleware(req, res, async (err) => {
      if (err) return next(err);
      try {
        if (req.files) {
          for (const field in req.files) {
            for (let file of req.files[field]) {
              const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "uploads" },
                  (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                  }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
              });
              file.path = result.secure_url;
              file.url = result.secure_url;
            }
          }
        }
        next();
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }
    });
  };
};

export default upload;
