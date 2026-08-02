import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { 
  MessageSquare, 
  Send, 
  X, 
  CornerDownRight, 
  Trash2, 
  User, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const DoubtModal = ({ isOpen, note, onClose }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDoubtText, setNewDoubtText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch comments whenever modal is opened for a note
  useEffect(() => {
    if (isOpen && note?.id) {
      fetchComments();
    }
  }, [isOpen, note]);

  const fetchComments = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiClient.get(`/notes/${note.id}/comments`);
      setComments(res.data || []);
    } catch (err) {
      console.warn('Failed to load doubt threads:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDoubt = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!newDoubtText.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.post(`/notes/${note.id}/comments`, {
        content: newDoubtText.trim(),
        parentId: null
      });
      setNewDoubtText('');
      await fetchComments();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to post doubt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (parentId) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.post(`/notes/${note.id}/comments`, {
        content: replyText.trim(),
        parentId: parentId
      });
      setReplyText('');
      setReplyTargetId(null);
      await fetchComments();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this discussion comment?')) return;
    try {
      await apiClient.delete(`/notes/comments/${commentId}`);
      await fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (!isOpen || !note) return null;

  // Recursive renderer for comments and nested replies
  const renderCommentItem = (comment, isReply = false) => {
    const isOwner = user && user.email === comment.userEmail;

    return (
      <div 
        key={comment.id} 
        className={`p-3 sm:p-4 rounded-2xl transition-all ${
          isReply 
            ? 'bg-sky-50/60 border-l-4 border-teal-main ml-4 sm:ml-8 mt-2' 
            : 'bg-white border border-sky-100 shadow-sm mt-3'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              isReply ? 'bg-teal-main/10 text-teal-main' : 'bg-navy-main text-white'
            }`}>
              {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy-main">{comment.userName}</span>
                {note.uploaderName && note.uploaderName === comment.userName && (
                  <span className="bg-teal-main/10 text-teal-main text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                    Author
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
              </span>
            </div>
          </div>

          {isOwner && (
            <button 
              onClick={() => handleDeleteComment(comment.id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
              title="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-700 mt-2.5 leading-relaxed font-normal whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Reply Action Button */}
        <div className="mt-2.5 flex items-center gap-3">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
              } else {
                setReplyTargetId(replyTargetId === comment.id ? null : comment.id);
                setReplyText('');
              }
            }}
            className="text-[11px] font-semibold text-teal-main hover:text-[#00796b] flex items-center gap-1 transition-colors"
          >
            <CornerDownRight className="w-3 h-3" />
            Reply
          </button>
        </div>

        {/* Inline Reply Input */}
        {replyTargetId === comment.id && (
          <div className="mt-3 flex items-center gap-2 bg-white p-2 rounded-xl border border-teal-main/30 shadow-sm animate-fade-in">
            <input
              type="text"
              placeholder={`Replying to ${comment.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostReply(comment.id)}
              className="flex-grow text-xs px-3 py-1.5 bg-slate-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-main text-navy-main"
              autoFocus
            />
            <button
              onClick={() => handlePostReply(comment.id)}
              disabled={submitting || !replyText.trim()}
              className="bg-teal-main hover:bg-[#00796b] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Send className="w-3 h-3" />
              Reply
            </button>
            <button
              onClick={() => setReplyTargetId(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2 mt-2">
            {comment.replies.map(reply => renderCommentItem(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-main/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-sky-100 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-navy-main text-white px-6 py-4 flex items-center justify-between border-b border-navy-card">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-main/20 text-teal-main flex items-center justify-center border border-teal-main/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                Doubt Threads & Discussions
              </h3>
              <p className="text-[11px] text-sky-200 truncate max-w-md">
                Topic: {note.title} ({note.subject})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs px-6 py-2 border-b border-red-100 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* New Doubt Form */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <form onSubmit={handlePostDoubt} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isAuthenticated ? "Ask a doubt or question about this note..." : "Log in to ask a doubt or join the discussion..."}
                value={newDoubtText}
                onChange={(e) => setNewDoubtText(e.target.value)}
                onClick={() => {
                  if (!isAuthenticated) openAuthModal('login');
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white text-navy-main placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newDoubtText.trim()}
              className="bg-teal-main hover:bg-[#00796b] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Doubt</span>
            </button>
          </form>
        </div>

        {/* Comments Thread List */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-teal-main border-t-transparent rounded-full animate-spin"></div>
              <span>Loading doubt threads...</span>
            </div>
          ) : comments.length > 0 ? (
            comments.map(comment => renderCommentItem(comment))
          ) : (
            <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8">
              <HelpCircle className="w-10 h-10 text-teal-main/40 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-navy-main">No Doubts Posted Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Have a question regarding this study material? Be the first student to start the discussion!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-teal-main">
            <Sparkles className="w-3.5 h-3.5" />
            Subject Discussions on NoteXchange
          </span>
          <button 
            onClick={onClose}
            className="text-slate-600 hover:text-navy-main font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
