import { useState, type FormEvent } from 'react';
import type { Comment } from '../types';
import { createComment } from '../api/feed';

interface CommentCardProps {
  comment: Comment;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function avatarFallback(name: string, size = 40): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=c8d6fd&color=1a2878`;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const [submitting, setSubmitting] = useState(false);

  async function handleReplySubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    
    setSubmitting(true);
    try {
      const newReply = await createComment(trimmed, comment.id);
      setReplies(prev => [...prev, newReply]);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to post reply', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article
      className="bg-white border border-pb-50 rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-sm"
      style={{ boxShadow: '0 1px 4px rgba(7,9,31,0.05)' }}
    >
      {/* Post body */}
      <div className="p-5">
        <div className="flex items-start gap-3.5">
          <img
            src={comment.user.avatar}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full object-cover bg-pb-50 shrink-0 ring-2 ring-pb-50"
            onError={e => { (e.target as HTMLImageElement).src = avatarFallback(comment.user.name); }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-sm font-600 text-pb-900">{comment.user.name}</span>
                <span className="text-xs text-slate-400 ml-1.5 hidden sm:inline">@{comment.user.username}</span>
              </div>
              <time className="text-xs text-slate-400 shrink-0 tabular-nums">{formatDate(comment.createdAt)}</time>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mt-2">{comment.content}</p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-5 pb-3.5 border-t border-pb-50 pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowReplyForm(v => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-500 text-slate-500 hover:text-pb-600 px-2.5 py-1.5 rounded-lg hover:bg-pb-50 -ml-2.5 transition-all duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          {showReplyForm
            ? 'Cancelar'
            : replies.length > 0
            ? `Responder (${replies.length})`
            : 'Responder'}
        </button>
      </div>

      {/* Inline reply composer */}
      {showReplyForm && (
        <div className="px-5 pb-4 animate-slide-down">
          <form onSubmit={handleReplySubmit} className="flex gap-3 items-end bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Escribe una respuesta..."
              rows={1}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
              className="flex-1 px-3 py-2 text-sm bg-transparent resize-none text-pb-900 placeholder-slate-400 focus:outline-none transition-all duration-150 leading-relaxed max-h-[120px]"
            />
            <button
              type="submit"
              disabled={submitting || !replyContent.trim()}
              className="shrink-0 p-2 text-white text-sm font-500 rounded-xl disabled:opacity-40 transition-all duration-150 hover:scale-105 active:scale-[0.97] mb-0.5 mr-0.5"
              style={{ background: 'linear-gradient(135deg, #1a2878 0%, #2b4ed4 100%)', boxShadow: '0 2px 6px rgba(32,53,168,0.25)' }}
            >
              {submitting ? (
                 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                 </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="bg-slate-50/50 border-t border-pb-50 divide-y divide-pb-50/60">
          {replies.map(reply => (
            <div key={reply.id} className="flex gap-3 px-5 py-3.5 ml-8 border-l-2 border-pb-100/50">
              <img
                src={reply.user.avatar}
                alt={reply.user.name}
                className="w-7 h-7 rounded-full shrink-0 object-cover ring-1 ring-pb-100"
                onError={e => { (e.target as HTMLImageElement).src = avatarFallback(reply.user.name, 28); }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-600 text-pb-900">{reply.user.name}</span>
                  <time className="text-[11px] text-slate-400 tabular-nums">{formatDate(reply.createdAt)}</time>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
