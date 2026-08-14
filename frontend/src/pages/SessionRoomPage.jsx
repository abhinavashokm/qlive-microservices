import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SessionRoomPage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  
  // TODO: Fetch real session details from backend using inviteCode
  const sessionTitle = "Placeholder Session Title";
  
  // Mock data for UI building
  const isHost = true; // TODO: Determine if current user is host from backend response
  
  const [questions, setQuestions] = useState([
    { id: 1, text: "How do we implement WebSocket connections?", votes: 5, isAnswered: false, answerText: "", hasUserVoted: true },
    { id: 2, text: "What is the best way to structure microservices?", votes: 12, isAnswered: true, answerText: "Keep them small and single-responsibility.", hasUserVoted: false },
    { id: 3, text: "Can we use GraphQL instead of REST?", votes: 2, isAnswered: false, answerText: "", hasUserVoted: false },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});

  // TODO: Connect WebSocket for live updates when component mounts
  // useEffect(() => { ... }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${inviteCode}`);
    alert("Invite link copied!");
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    // TODO: Send new question to backend via API or WebSocket
    const q = {
      id: Date.now(),
      text: newQuestion,
      votes: 0,
      isAnswered: false,
      answerText: "",
      hasUserVoted: false
    };
    
    setQuestions([...questions, q]);
    setNewQuestion("");
  };

  const toggleUpvote = (id) => {
    // TODO: Send upvote toggle request to backend
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          hasUserVoted: !q.hasUserVoted,
          votes: q.hasUserVoted ? q.votes - 1 : q.votes + 1
        };
      }
      return q;
    }));
  };

  const handleAnswerSubmit = (id) => {
    const text = answerInputs[id];
    if (!text || !text.trim()) return;
    
    // TODO: Send answer to backend
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, isAnswered: true, answerText: text } : q
    ));
    
    setAnswerInputs({ ...answerInputs, [id]: '' });
  };

  const markAsAnswered = (id) => {
    // TODO: Send mark-as-answered request to backend
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, isAnswered: true } : q
    ));
  };

  const sortedQuestions = [...questions].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Session Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{sessionTitle}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-medium text-gray-500 flex items-center">
                Code: <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded ml-2 font-bold tracking-wider">{inviteCode}</span>
              </span>
            </div>
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <button 
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
            >
              Copy Link
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors shadow-sm"
            >
              Leave
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col relative">
        
        {/* Ask Question Form - Sticky on desktop, fixed bottom on mobile (or sticky top depending on preference. Sticky top is safer) */}
        <div className="sticky top-16 z-20 bg-gray-50 pt-2 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <form onSubmit={handleAskQuestion} className="bg-white p-3 sm:p-4 rounded-2xl shadow-md border border-gray-200 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900"
              required
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
            >
              Ask
            </button>
          </form>
        </div>

        {/* Questions List */}
        <div className="flex-1 space-y-4 pb-20 sm:pb-10 mt-2">
          {sortedQuestions.map(q => (
            <div key={q.id} className={`bg-white p-4 sm:p-5 rounded-2xl shadow-sm border transition-colors ${q.isAnswered ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                
                {/* Upvote Column */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <button 
                    onClick={() => toggleUpvote(q.id)}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                      q.hasUserVoted 
                        ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                        : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-gray-600 border border-gray-100'
                    }`}
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className={`font-bold mt-1 text-sm sm:text-base ${q.hasUserVoted ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {q.votes}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <p className={`text-base sm:text-lg font-medium leading-snug break-words ${q.isAnswered ? 'text-gray-600' : 'text-gray-900'}`}>
                      {q.text}
                    </p>
                    {q.isAnswered && (
                      <span className="shrink-0 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border border-emerald-200">
                        Answered
                      </span>
                    )}
                  </div>

                  {q.answerText && (
                    <div className="mt-3 bg-emerald-50/50 p-3 sm:p-4 rounded-xl border border-emerald-100/50">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Answer</p>
                      <p className="text-gray-700 text-sm sm:text-base">{q.answerText}</p>
                    </div>
                  )}

                  {/* Host Controls */}
                  {isHost && !q.isAnswered && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <textarea
                          value={answerInputs[q.id] || ''}
                          onChange={(e) => setAnswerInputs({...answerInputs, [q.id]: e.target.value})}
                          placeholder="Type a response..."
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-10 min-h-[40px]"
                        />
                        <div className="flex gap-2 shrink-0 justify-end">
                          <button 
                            onClick={() => handleAnswerSubmit(q.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 text-sm rounded-lg transition-colors shadow-sm"
                          >
                            Reply
                          </button>
                          <button 
                            onClick={() => markAsAnswered(q.id)}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 text-sm rounded-lg transition-colors shadow-sm whitespace-nowrap"
                          >
                            Mark Done
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No questions yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">It's quiet in here. Be the first to ask a question!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
