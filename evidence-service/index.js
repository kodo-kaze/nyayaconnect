const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 9000;
const UPLOAD_DIR = 'uploads';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// POST /upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  const hex = hashSum.digest('hex');

  res.json({
    hash: hex,
    path: filePath,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
  });
});

// GET /file/:filename
app.get('/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

// GET /verify/:hash
app.get('/verify/:hash', (req, res) => {
    // In a real system, we would check if any file in UPLOAD_DIR matches this hash
    // For now, this is a placeholder
    res.json({ message: 'Hash verification logic to be implemented' });
});

app.listen(PORT, () => {
  console.log(`Evidence Service running on port ${PORT}`);
});
