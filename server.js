import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Load biến môi trường từ .env
dotenv.config();

const app = express();
const port = 4000;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dùng thư mục public làm frontend
app.use(express.static(path.join(process.cwd(), "public")));

// Multer để nhận file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route upload ảnh
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Chưa chọn file" });

    // Upload trực tiếp từ buffer
    const result = await cloudinary.uploader.upload_stream(
      { folder: "trangcanhan" }, // folder trong Cloudinary
      (error, result) => {
        if (error) return res.status(500).json({ message: "Upload thất bại", error });
        res.json({ message: "Upload thành công", url: result.secure_url });
      }
    );

    result.end(file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

// Route lấy danh sách ảnh
app.get("/gallery", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "trangcanhan/", // lấy đúng folder
      max_results: 20,
    });

    const urls = result.resources.map((img) => img.secure_url);
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được ảnh", error: err });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server chạy tại http://127.0.0.1:${port}`);
});
