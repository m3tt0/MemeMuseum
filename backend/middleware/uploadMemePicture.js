import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFolder = process.env.UPLOAD_MEME_DIR;

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `meme_${req.userId}_${Date.now()}${ext}`;
        cb(null, name);
    }
});

export const uploadMeme = multer({ storage });
