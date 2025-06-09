'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
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
      setFeedback(data.feedback || 'No feedback generated.');
    } catch (err) {
      console.error('Upload failed:', err);
      setText('❌ Upload failed');
      setFeedback('');
    } finally {
      setLoading(false);
    }
  };

  // Parse feedback into structured parts
  const parsed = {
    role: feedback.match(/1\.\s*(.+?)\n/)?.[1] ?? '',
    score: feedback.match(/2\.\s*Score:?\s*(.+?)\n/)?.[1] ?? '',
    summary: feedback.match(/3\.\s*Feedback:?\s*(.+?)\n4\./s)?.[1]?.trim() ?? '',
    problems: feedback.match(/4\.\s*Problems:?\s*(.+?)\n5\./s)?.[1]?.trim() ?? '',
    improvements: feedback.match(/5\.\s*Improvements:?\s*(.+)/s)?.[1]?.trim() ?? '',
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto font-sans bg-white text-black">
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

      {feedback && (
        <section className="mb-10 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            🧠 AI Resume Feedback
          </h2>

          <div className="bg-blue-50 border border-blue-300 p-4 rounded shadow-sm">
            <h3 className="font-semibold text-blue-800 mb-1">🎯 Target Job Role</h3>
            <p className="text-sm text-gray-700">{parsed.role}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded shadow-sm">
            <h3 className="font-semibold text-yellow-800 mb-1">📊 Resume Score</h3>
            <p className="text-sm text-gray-700">{parsed.score}</p>
          </div>

          <div className="bg-green-50 border border-green-300 p-4 rounded shadow-sm">
            <h3 className="font-semibold text-green-800 mb-1">📝 General Feedback</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{parsed.summary}</p>
          </div>

          <div className="bg-red-50 border border-red-300 p-4 rounded shadow-sm">
            <h3 className="font-semibold text-red-800 mb-1">❌ Problems</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 whitespace-pre-line">
              {parsed.problems.split('\n').map((line, idx) =>
                <li key={idx}>{line.replace(/^[a-e]\.\s*/, '')}</li>
              )}
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-300 p-4 rounded shadow-sm">
            <h3 className="font-semibold text-purple-800 mb-1">✅ Suggested Improvements</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 whitespace-pre-line">
              {parsed.improvements.split('\n').map((line, idx) =>
                <li key={idx}>{line.replace(/^[a-e]\.\s*/, '')}</li>
              )}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
