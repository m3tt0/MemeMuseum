import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFolder = process.env.UPLOAD_PROFILE_DIR;

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `user_${req.userId}_${Date.now()}${ext}`;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
};

export const uploadProfile = multer({ 
    storage,
    limits: {fileSize: process.env.MAX_SIZE_UPLOAD},
    fileFilter
});
