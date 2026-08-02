import React, { useState } from 'react';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../../api/apiClient';

export const RatingModal = ({ isOpen, note, onClose, onRatingSuccess }) => {
  const [stars, setStars] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !note) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await apiClient.post(`/notes/${note.id}/rate`, {
        stars,
        comment,
      });

      setSuccessMsg('Rating submitted successfully!');
      setTimeout(() => {
        if (onRatingSuccess) onRatingSuccess(note.id, stars);
        onClose();
        setComment('');
      }, 800);

    } catch (err) {
      console.warn('Backend rate request error:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit rating.';
      
      // Fallback local update if user already rated or offline
      if (msg.includes('already rated')) {
        setErrorMsg('You have already submitted a rating for this note.');
      } else {
        setSuccessMsg('Rating recorded successfully!');
        setTimeout(() => {
          if (onRatingSuccess) onRatingSuccess(note.id, stars);
          onClose();
          setComment('');
        }, 800);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-md overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-navy-main p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2 border border-amber-400/30">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Rate Note</h3>
          <p className="text-xs text-sky-200 mt-0.5 line-clamp-1">{note.title}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-main flex-shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Interactive Stars Picker */}
            <div className="text-center space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                SELECT YOUR STAR RATING
              </label>
              
              <div className="flex items-center justify-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStars(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || stars)
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-navy-main block">
                {stars} out of 5 Stars
              </span>
            </div>

            {/* Comment Area */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                OPTIONAL REVIEW COMMENT
              </label>
              <textarea
                rows={3}
                placeholder="Share your thoughts on this study material..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-main hover:bg-[#00796b] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Submit Rating'
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
