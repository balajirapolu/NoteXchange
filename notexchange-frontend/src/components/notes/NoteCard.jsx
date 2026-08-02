import React from 'react';
import { Star, FileText, Download, Eye, User, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NoteCard = ({ note, onViewPdf, onRate, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && note.uploaderName && user.name && note.uploaderName.toLowerCase() === user.name.toLowerCase();

  // Render Star Rating Stars
  const renderStars = (rating) => {
    const score = rating || 0;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(score)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="text-xs font-bold text-navy-main ml-1.5">
          {score > 0 ? score.toFixed(1) : 'New'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
      
      {/* Top Header Card */}
      <div className="p-5 space-y-3">
        
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2">
          <span className="bg-light-blue text-navy-main font-bold text-[11px] px-3 py-1 rounded-full tracking-wide">
            {note.subject}
          </span>
          <span className="bg-teal-50 text-teal-700 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-teal-200">
            Semester {note.semester}
          </span>
        </div>

        {/* Note Title */}
        <h3 className="text-base font-bold text-navy-main group-hover:text-teal-main transition-colors line-clamp-2 leading-snug">
          {note.title}
        </h3>

        {/* Rating & Uploader Info */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div>{renderStars(note.avgRating)}</div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <User className="w-3.5 h-3.5 text-teal-main" />
            <span className="truncate max-w-[110px]">{note.uploaderName || 'Anonymous'}</span>
          </div>
        </div>

      </div>

      {/* Card Action Buttons (View PDF, Download, Rate, Delete) */}
      <div className="bg-light-blue-soft p-3.5 border-t border-sky-100 flex items-center justify-between gap-2">
        
        <button
          onClick={() => onViewPdf(note)}
          className="flex-1 bg-white hover:bg-navy-main text-navy-main hover:text-white border border-sky-200 hover:border-navy-main px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>

        <a
          href={`http://localhost:8080/api/notes/${note.id}/download`}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="bg-teal-main hover:bg-[#00796b] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
          title="Download PDF File"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>

        <button
          onClick={() => onRate(note)}
          className="bg-white hover:bg-amber-400 text-amber-500 hover:text-white border border-amber-200 p-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          title="Rate this note"
        >
          <Star className="w-3.5 h-3.5 fill-current" />
        </button>

        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white p-2 rounded-xl text-xs font-bold transition-all border border-red-200"
            title="Delete Note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

      </div>

    </div>
  );
};
