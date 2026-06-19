import React, { useState, useEffect, useCallback } from 'react';

interface ContactProps {
  onClose: () => void;
}

interface FeedbackEntry {
  _id: string;
  name: string;
  message: string;
  rating: number;
  likes: number;
  createdAt: string;
}

const API_BASE = '/api/feedback';

const Star: React.FC<{
  filled: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  size?: string;
  interactive?: boolean;
}> = ({ filled, onClick, onMouseEnter, onMouseLeave, size = 'w-7 h-7', interactive = false }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`${size} transition-colors duration-150 ${
      interactive ? 'cursor-pointer' : ''
    } ${filled ? 'text-amber-400' : 'text-neutral-200'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.286 3.957c.3.921-.755 1.688-1.538 1.118L10.586 15.6a1 1 0 00-1.176 0l-3.368 2.447c-.783.57-1.838-.197-1.538-1.118l1.285-3.957a1 1 0 00-.363-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
  </svg>
);

const StarRatingInput: React.FC<{ value: number; onChange: (v: number) => void }> = ({
  value,
  onChange,
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          filled={n <= (hovered || value)}
          interactive
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
        />
      ))}
    </div>
  );
};

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} filled={n <= rating} size="w-4 h-4" />
    ))}
  </div>
);

const timeAgo = (dateString: string): string => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

export const Contact: React.FC<ContactProps> = ({ onClose }) => {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const fetchFeedback = useCallback(async () => {
    try {
      setLoadError(false);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (rating === 0) {
      setSubmitError('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      setSubmitError('Please write a short comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous',
          message: comment.trim(),
          rating,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong.');
      }

      const newEntry = await res.json();
      setEntries((prev) => [newEntry, ...prev]);
      setName('');
      setComment('');
      setRating(0);
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (likedIds.has(id)) return;

    setLikedIds((prev) => new Set(prev).add(id));
    setEntries((prev) =>
      prev.map((entry) => (entry._id === id ? { ...entry, likes: entry.likes + 1 } : entry))
    );

    try {
      const res = await fetch(`${API_BASE}/${id}/like`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
    } catch (err) {
      // Roll back on failure
      setEntries((prev) =>
        prev.map((entry) => (entry._id === id ? { ...entry, likes: Math.max(0, entry.likes - 1) } : entry))
      );
      setLikedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const averageRating =
    entries.length > 0
      ? (entries.reduce((sum, e) => sum + e.rating, 0) / entries.length).toFixed(1)
      : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <button
        onClick={onClose}
        className="mb-8 flex items-center text-neutral-400 hover:text-neutral-800 transition-colors group"
      >
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      <article className="bg-white p-12 md:p-20 shadow-2xl rounded-sm border border-neutral-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-neutral-100 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-neutral-100 pointer-events-none" />

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif-heading text-neutral-800 mb-4">
            Get in Touch
          </h1>
          <div className="w-12 h-px bg-neutral-300 mx-auto" />
          <p className="mt-6 text-neutral-500 italic">Let's connect through words</p>
        </header>

        <div className="space-y-8 text-lg leading-relaxed text-neutral-700">
          <p className="text-center">
            I'd love to hear from you. Whether you have feedback, want to share your thoughts
            on a poem, or simply wish to connect, feel free to reach out.
          </p>

          <div className="space-y-6 pt-8">
            <div className="flex items-start gap-4 p-6 bg-neutral-50 rounded-lg border border-neutral-100 hover:border-neutral-300 transition-colors">
              <svg className="w-6 h-6 text-neutral-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Email</h3>
                <a href="mailto:unfilteredpage2026@gmail.com" className="text-neutral-600 hover:text-neutral-800 transition-colors">
                  unfilteredpage2026@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-neutral-50 rounded-lg border border-neutral-100 hover:border-neutral-300 transition-colors">
              <svg className="w-6 h-6 text-neutral-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Social Media</h3>
                <p className="text-neutral-600">
                  Connect with me on your preferred platform
                </p>
                <div className="flex gap-4 mt-3">
                  <a href="https://www.instagram.com/dsouza.glenisha/" className="text-neutral-400 hover:text-neutral-800 transition-colors text-sm">Instagram</a>
                  <a href="https://www.linkedin.com/in/glenisha-dsouza-b8a1032a7/" className="text-neutral-400 hover:text-neutral-800 transition-colors text-sm">LinkedIn</a>
                </div>
              </div>
            </div>

            {/* Feedback: rate + comment form */}
            <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="flex items-start gap-4 mb-6">
                <svg className="w-6 h-6 text-neutral-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Feedback</h3>
                  <p className="text-neutral-600 text-base">
                    Rate your experience and leave a comment. Your thoughts help make this space better.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pl-0 md:pl-10">
                <div>
                  <label className="block text-sm text-neutral-500 mb-2">Your rating</label>
                  <StarRatingInput value={rating} onChange={setRating} />
                </div>

                <div>
                  <label htmlFor="feedback-name" className="block text-sm text-neutral-500 mb-2">
                    Name (optional)
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anonymous"
                    maxLength={60}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-300 transition-shadow text-base"
                  />
                </div>

                <div>
                  <label htmlFor="feedback-comment" className="block text-sm text-neutral-500 mb-2">
                    Comment
                  </label>
                  <textarea
                    id="feedback-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    maxLength={1000}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-300 transition-shadow resize-none text-base"
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-rose-600">{submitError}</p>
                )}
                {justSubmitted && (
                  <p className="text-sm text-emerald-600">Thank you — your feedback has been posted.</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-neutral-800 text-white text-sm rounded-md hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Feedback'}
                </button>
              </form>
            </div>

            {/* Public feedback wall */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-medium text-neutral-800">
                  What others are saying
                </h3>
                {averageRating && (
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={Math.round(Number(averageRating))} />
                    <span className="text-sm text-neutral-500">
                      {averageRating} avg ({entries.length})
                    </span>
                  </div>
                )}
              </div>

              {loading && (
                <p className="text-neutral-400 text-base text-center py-8">Loading feedback...</p>
              )}

              {!loading && loadError && (
                <p className="text-neutral-400 text-base text-center py-8">
                  Couldn't load feedback right now. Please try again later.
                </p>
              )}

              {!loading && !loadError && entries.length === 0 && (
                <p className="text-neutral-400 text-base text-center py-8 italic">
                  No feedback yet — be the first to share your thoughts.
                </p>
              )}

              {!loading && !loadError && entries.length > 0 && (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry._id}
                      className="p-5 bg-white border border-neutral-100 rounded-lg hover:border-neutral-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="font-medium text-neutral-800 text-base">{entry.name}</span>
                            <StarDisplay rating={entry.rating} />
                          </div>
                          <p className="text-neutral-600 text-base leading-relaxed">{entry.message}</p>
                          <p className="text-neutral-400 text-xs mt-2">{timeAgo(entry.createdAt)}</p>
                        </div>

                        <button
                          onClick={() => handleLike(entry._id)}
                          disabled={likedIds.has(entry._id)}
                          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors flex-shrink-0 ${
                            likedIds.has(entry._id)
                              ? 'text-rose-500'
                              : 'text-neutral-400 hover:text-rose-500 hover:bg-rose-50'
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={likedIds.has(entry._id) ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={likedIds.has(entry._id) ? 0 : 2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z" />
                          </svg>
                          <span className="text-xs font-medium">{entry.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 text-center border-t border-neutral-200">
            <p className="text-neutral-500 italic font-serif">
              "Poetry is the rhythmical creation of beauty in words."
            </p>
            <p className="text-neutral-400 text-sm mt-2">— Edgar Allan Poe</p>
          </div>
        </div>
      </article>
    </div>
  );
};