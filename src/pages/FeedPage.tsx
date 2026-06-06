import { useEffect, useState, type FormEvent } from 'react';
import { getFeed, createComment } from '../api/feed';
import type { Comment, ApiError } from '../types';
import CommentCard from '../components/CommentCard';
import { AxiosError } from 'axios';

export default function FeedPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    getFeed()
      .then(setComments)
      .catch(() => setError('No se pudieron cargar las publicaciones'))
      .finally(() => setLoadingFeed(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!content.trim()) {
      setFormError('La publicación no puede estar vacía');
      return;
    }
    setSubmitting(true);
    try {
      const newComment = await createComment(content.trim());
      setComments(prev => [newComment, ...prev]);
      setContent('');
      setFocused(false);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setFormError(axiosErr.response?.data?.error?.message || 'Error al publicar');
    } finally {
      setSubmitting(false);
    }
  }

  const composerBorder = focused ? '#8aa3f8' : '#edf2ff';
  const composerRing = focused ? '0 0 0 3px rgba(43,78,212,0.10)' : 'none';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-pb-900 text-xl tracking-tight">Feed</h1>
          <p className="text-sm text-slate-400 mt-0.5">Comparte con la comunidad</p>
        </div>
        {!loadingFeed && (
          <span
            className="text-xs font-500 text-slate-500 bg-white border border-pb-50 px-3 py-1.5 rounded-full tabular-nums"
            style={{ boxShadow: '0 1px 2px rgba(7,9,31,0.04)' }}
          >
            {comments.length} {comments.length === 1 ? 'publicación' : 'publicaciones'}
          </span>
        )}
      </div>

      {/* Composer */}
      <div
        className="bg-white rounded-2xl transition-all duration-200"
        style={{
          border: `1px solid ${composerBorder}`,
          boxShadow: `0 1px 4px rgba(7,9,31,0.07), ${composerRing}`,
        }}
      >
        {formError && (
          <div className="mx-5 mt-4 flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-3.5 py-2.5 rounded-xl animate-scale-in">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { if (!content) setFocused(false); }}
            placeholder="¿Qué tienes en mente?"
            rows={focused || content.length > 0 ? 4 : 2}
            maxLength={1000}
            className="w-full px-5 pt-4 pb-2 text-sm bg-transparent resize-none text-pb-900 placeholder-slate-300 focus:outline-none leading-relaxed transition-all duration-200"
          />
          <div className="flex items-center justify-between px-4 pb-4 mt-1">
            <span className={`text-xs tabular-nums transition-colors duration-150 ${content.length > 900 ? 'text-amber-500 font-500' : 'text-slate-300'}`}>
              {content.length > 0 ? `${content.length}/1000` : ''}
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-500 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #1a2878 0%, #2b4ed4 100%)',
                boxShadow: '0 2px 8px rgba(32,53,168,0.28)',
              }}
            >
              {submitting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Publicando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Publicar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feed load error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Feed list */}
      {loadingFeed ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <svg className="w-5 h-5 animate-spin text-pb-200" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-slate-400">Cargando publicaciones...</p>
        </div>
      ) : comments.length === 0 && !error ? (
        <div
          className="flex flex-col items-center justify-center py-24 bg-white border border-pb-50 rounded-2xl gap-4"
          style={{ boxShadow: '0 1px 4px rgba(7,9,31,0.05)' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-pb-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-pb-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-display font-600 text-pb-800 text-sm">El feed está vacío</p>
            <p className="text-slate-400 text-sm mt-1">Sé el primero en compartir algo.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
