import React from 'react';
import Badge from './ui/Badge';
import Button from './ui/Button';

export default function QuestionCard({ question, isHost, onUpvote }) {
  const hasUserVoted = question.has_voted || false;

  return (
    <div className={`glass-panel p-4 sm:p-6 rounded-3xl transition-all duration-300 hover:border-black/10 ${question.is_answered ? 'opacity-70 bg-zinc-100/30' : 'bg-zinc-100/50'}`}>
      <div className="flex items-start gap-4 sm:gap-6">
        
        {/* Upvote Column */}
        <div className="flex flex-col items-center justify-start shrink-0 pt-1">
          <button 
            onClick={() => !hasUserVoted && onUpvote(question.id)}
            disabled={hasUserVoted}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              hasUserVoted 
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-default' 
                : 'bg-zinc-200/50 text-zinc-600 hover:bg-zinc-300 hover:text-zinc-950 border border-black/5'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <span className={`font-bold mt-2 text-sm sm:text-base ${hasUserVoted ? 'text-brand-400' : 'text-zinc-500'}`}>
            {question.vote_count || 0}
          </span>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <p className={`text-lg sm:text-xl font-medium leading-relaxed break-words ${question.is_answered ? 'text-zinc-600' : 'text-zinc-900'}`}>
              {question.text}
            </p>
            {question.is_answered && <Badge variant="success">Answered</Badge>}
          </div>


        </div>
      </div>
    </div>
  );
}
