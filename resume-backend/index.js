require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const HF_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-xxl';
const HF_API_KEY = process.env['api-key'];

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  }
});

app.get('/', (req, res) => {
  res.send('✅ ResumeGPT Backend is Running');
});

app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });

    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);
    fs.unlinkSync(req.file.path);

    const inputText = pdfData.text.slice(0, 4000);

    const prompt = `
You are a professional resume reviewer.

Here is a resume:
"""
${inputText}
"""

Now, provide the following:

1. Identify the job or role this resume is best suited for.
2. Give a score out of 10 based on formatting, grammar, content, and style.
3. Provide a brief paragraph of overall feedback.
4. Point out any formatting or grammar issues.
5. Suggest 3–5 improvements to help the candidate better highlight their skills and stand out.

Respond clearly and concisely.
`;

    const hfResponse = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 600,
          temperature: 0.7
        }
      })
    });

    const hfData = await hfResponse.json();
    console.log('🧪 HuggingFace API Response:', JSON.stringify(hfData, null, 2));

    // ✅ CORRECTLY extract feedback from the known response format
    let feedback;
    if (Array.isArray(hfData) && hfData[0]?.generated_text) {
      feedback = hfData[0].generated_text;
    } else if (hfData.generated_text) {
      feedback = hfData.generated_text;
    } else {
      feedback = null;
    }

    if (!feedback) {
      return res.json({
        text: pdfData.text,
        feedback: '⚠️ No feedback generated.',
        raw: hfData
      });
    }

    res.json({
      message: '✅ Resume analyzed successfully',
      text: pdfData.text,
      feedback
    });

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
