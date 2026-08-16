import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useQuestions } from '../hooks/useQuestions';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import AskQuestionForm from '../components/AskQuestionForm';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function SessionRoomPage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { questions, setQuestions, fetchQuestions, askQuestion, upvoteQuestion } = useQuestions(inviteCode);
  
  const isHost = true; // TODO: Determine if host from context/auth

  useEffect(() => {
    fetchQuestions();

    const wsUrl = `ws://localhost:8003/ws/session/${inviteCode}/`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'question_created') {
        setQuestions(prev => {
          if (prev.some(q => q.id === data.question.id)) return prev;
          return [...prev, data.question];
        });
      } else if (data.type === 'vote_updated') {
        setQuestions(prev => prev.map(q => q.id === data.question_id ? { ...q, vote_count: data.vote_count } : q));
      }
    };

    return () => {
      ws.close();
    };
  }, [fetchQuestions, inviteCode, setQuestions]);



  const handleAskQuestion = async (text) => {
    await askQuestion(text);
  };


  const toggleUpvote = async (id) => {
    await upvoteQuestion(id);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-outfit overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[150px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full mix-blend-screen filter blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <header className="border-b border-black/5 bg-zinc-50/50 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">Live Q&A Session</h1>
              <div className="flex items-center gap-3 mt-2 text-sm font-medium text-zinc-600">
                Code: <Badge variant="info" className="font-mono text-sm px-3">{inviteCode}</Badge>
              </div>
            </div>
            <div className="flex space-x-3 w-full sm:w-auto">

              <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)} className="flex-1 sm:flex-none text-sm">Leave Room</Button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col">
          <AskQuestionForm onSubmit={handleAskQuestion} />

          <div className="flex-1 space-y-6 pb-20 sm:pb-10">
            {questions.map(q => (
              <QuestionCard 
                key={q.id}
                question={q}
                isHost={isHost}
                onUpvote={toggleUpvote}
              />
            ))}
            
            {questions.length === 0 && (
              <div className="text-center py-20 px-4 border-2 border-dashed border-black/10 rounded-3xl bg-zinc-100/30 animate-fade-in">
                <div className="mx-auto w-20 h-20 bg-zinc-200/50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-950 mb-2">No questions yet</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">The floor is open. Be the first to ask a question!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
