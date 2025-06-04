const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const fetch = require('node-fetch'); // ✅ Use node-fetch@2

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// HuggingFace free inference API URL
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6';

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isPDF = file.mimetype === 'application/pdf';
    cb(null, isPDF);
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ ResumeGPT Backend is Running');
});

// Upload and analyze route
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    fs.unlinkSync(filePath); // ✅ Clean up uploaded file

    // Limit text length to avoid HuggingFace input size issues
    const inputText = pdfData.text.slice(0, 4000);

    const hfResponse = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Optional: use your token if hitting rate limit
        // 'Authorization': `Bearer YOUR_TOKEN`
      },
      body: JSON.stringify({ inputs: inputText })
    });

    const hfData = await hfResponse.json();
    const summary = hfData[0]?.summary_text || '⚠️ No summary generated.';

    res.json({
      message: '✅ Resume parsed and analyzed successfully',
      text: pdfData.text,
      summary
    });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🟢 Server is running at http://localhost:${PORT}`);
});
