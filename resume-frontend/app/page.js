'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3003/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setText(data.text || '');
      setSummary(data.summary || '');
    } catch (err) {
      console.error('Upload failed:', err);
      setText('❌ Upload failed');
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto font-sans">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        📄 ResumeGPT
      </h1>

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
        >
          {loading ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </form>

      {text && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            📝 Extracted Resume Text
          </h2>
          <div className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto shadow-inner border border-gray-200">
            {text}
          </div>
        </section>
      )}

      {summary && (
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            🧠 AI Summary Feedback
          </h2>
          <div className="bg-green-100 border border-green-300 p-4 rounded text-sm shadow-inner">
            {summary}
          </div>
        </section>
      )}
    </main>
  );
}
