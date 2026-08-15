import React, { useState } from 'react';
import Button from './ui/Button';

export default function AskQuestionForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sticky top-16 z-30 pt-4 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 backdrop-blur-xl bg-zinc-50/80 border-b border-black/5 mb-6">
      <form onSubmit={handleSubmit} className="glass-panel p-2 sm:p-3 rounded-2xl flex flex-col sm:flex-row gap-3 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-cyan-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-900 placeholder-zinc-500 text-lg relative z-10"
          required
          disabled={isSubmitting}
        />
        <Button type="submit" variant="gradient" isLoading={isSubmitting} className="sm:w-auto w-full px-8 relative z-10 rounded-xl">
          Ask
        </Button>
      </form>
    </div>
  );
}
