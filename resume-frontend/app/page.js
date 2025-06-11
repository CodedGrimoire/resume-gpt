'use client';
import { useState } from 'react';
import { Upload, FileText, Target, TrendingUp, Lightbulb, Code, Users, Briefcase, Globe, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

// Header Component
function Header() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 backdrop-blur-xl rounded-2xl mb-6 shadow-2xl border border-white/10">
        <FileText className="w-10 h-10 text-slate-300" />
      </div>
      <h1 className="text-5xl font-bold text-slate-200 mb-4">
        ResumeGPT
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        AI-powered resume analysis for professional excellence
      </p>
    </div>
  );
}

// Upload Component
function UploadSection({ onUpload, loading, file, setFile }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="space-y-6">
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all duration-300 group backdrop-blur-sm"
          >
            <Upload className="w-10 h-10 text-slate-400 group-hover:text-slate-300 mb-3 transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
              {file ? (
                <span className="text-slate-300">{file.name}</span>
              ) : (
                'Click to upload your resume (PDF)'
              )}
            </span>
          </label>
        </div>
        
        <button
          onClick={onUpload}
          disabled={!file || loading}
          className="w-full bg-white/10 hover:bg-white/15 disabled:bg-white/5 text-slate-200 font-semibold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/30 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-300 mr-3"></div>
              <span>Analyzing Resume...</span>
            </div>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </div>
    </div>
  );
}

// Score Component
function ScoreBoard({ score }) {
  const numericScore = parseFloat(score?.match(/[\d.]+/)?.[0] || '0');
  const scoreOutOf10 = numericScore > 10 ? Math.round(numericScore / 10) : numericScore;
  
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreText = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Work';
  };

  const strokeDasharray = `${(scoreOutOf10 / 10) * 100}, 100`;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-200 mb-8 flex items-center justify-center">
          <TrendingUp className="w-7 h-7 mr-3 text-slate-400" />
          Resume Score
        </h3>
        
        <div className="relative w-40 h-40 mx-auto mb-8">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"></div>
          
          {/* Progress ring */}
          <svg className="w-40 h-40 transform -rotate-90 absolute inset-0" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={getScoreColor(scoreOutOf10)}
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/5 backdrop-blur-xl rounded-full w-24 h-24 flex items-center justify-center border border-white/10">
              <div>
                <div className="text-3xl font-bold text-slate-200">{scoreOutOf10.toFixed(1)}</div>
                <div className="text-xs text-slate-400">/ 10</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`inline-block px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 ${getScoreColor(scoreOutOf10)} font-semibold`}>
          {getScoreText(scoreOutOf10)}
        </div>
        
        {score && score.length > 10 && (
          <p className="text-slate-300 mt-6 text-sm leading-relaxed">{score.replace(/^[\d.]+\/?\d*\s*[-:]?\s*/, '')}</p>
        )}
      </div>
    </div>
  );
}

// Feedback Card Component
function FeedbackCard({ title, content, icon: Icon, isList = false }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:border-white/20">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
        <Icon className="w-6 h-6 mr-3 text-slate-400" />
        {title}
      </h3>
      
      {isList ? (
        <ul className="space-y-3">
          {content?.map((item, idx) => (
            <li key={idx} className="text-slate-300 flex items-start">
              <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{content}</p>
      )}
    </div>
  );
}

// Main Component
export default function Home() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
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
      setFeedback(data.feedback || null);
    } catch (err) {
      console.error('Upload failed:', err);
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  const renderList = (text) =>
    text?.split('\n').map((line) => line.replace(/^[\-\*\d\.]\s*/, '').trim()).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent"></div>
      </div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}></div>
      
      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        <Header />
        
        <UploadSection 
          onUpload={handleUpload} 
          loading={loading} 
          file={file} 
          setFile={setFile} 
        />

        {feedback && (
          <div className="space-y-8">
            {feedback.score && <ScoreBoard score={feedback.score} />}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {feedback.role && (
                <FeedbackCard 
                  title="Target Job Role" 
                  content={feedback.role} 
                  icon={Target}
                />
              )}
              
              {feedback.feedback && (
                <FeedbackCard 
                  title="General Feedback" 
                  content={feedback.feedback} 
                  icon={Lightbulb}
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {feedback.issues && (
                <FeedbackCard 
                  title="Areas for Improvement" 
                  content={renderList(feedback.issues)} 
                  icon={AlertCircle}
                  isList 
                />
              )}
              
              {feedback.suggestions && (
                <FeedbackCard 
                  title="Suggested Improvements" 
                  content={renderList(feedback.suggestions)} 
                  icon={CheckCircle}
                  isList 
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {feedback.technicalSkills && (
                <FeedbackCard 
                  title="Required Technical Skills" 
                  content={renderList(feedback.technicalSkills)} 
                  icon={Code}
                  isList 
                />
              )}
              
              {feedback.softSkills && (
                <FeedbackCard 
                  title="Required Soft Skills" 
                  content={renderList(feedback.softSkills)} 
                  icon={Users}
                  isList 
                />
              )}
            </div>

            {feedback.projects && (
              <FeedbackCard 
                title="Impressive Projects" 
                content={renderList(feedback.projects)} 
                icon={Briefcase}
                isList 
              />
            )}

            {feedback.marketInsight && (
              <FeedbackCard 
                title="Job Market Insight" 
                content={feedback.marketInsight} 
                icon={Globe}
              />
            )}

            {feedback.learningPaths && (
              <FeedbackCard 
                title="Learning Paths & Certifications" 
                content={renderList(feedback.learningPaths)} 
                icon={BookOpen}
                isList 
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}