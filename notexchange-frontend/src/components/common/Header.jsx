import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { 
  BookOpen, 
  Upload, 
  User as UserIcon, 
  LogOut, 
  Search, 
  Star, 
  FileText, 
  ChevronDown,
  Sparkles,
  Bell,
  X,
  MessageSquare,
  CheckCheck
} from 'lucide-react';

export const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, onOpenUpload, onOpenDoubtForNote }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // Fetch notifications every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        apiClient.get('/notifications'),
        apiClient.get('/notifications/unread-count')
      ]);
      setNotifications(notifRes.data || []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (err) {
      // Silently fail – backend may not be reachable
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const handleNotifClick = async (notif) => {
    // Mark individual notification as read
    if (!notif.isRead) {
      try {
        await apiClient.put(`/notifications/${notif.id}/read`);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {}
    }
    // Open the Doubt Modal for that note if handler is provided
    if (notif.noteId && onOpenDoubtForNote) {
      onOpenDoubtForNote(notif.noteId);
    }
    setIsNotifOpen(false);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="bg-navy-main text-white sticky top-0 z-40 shadow-md border-b border-navy-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('all')}>
            <div className="w-10 h-10 rounded-xl bg-teal-main flex items-center justify-center shadow-lg shadow-teal-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Note<span className="text-teal-main font-black">Xchange</span>
              </span>
              <span className="block text-[10px] text-sky-200 tracking-wider uppercase font-semibold">Academic Repository</span>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300" />
              <input
                type="text"
                placeholder="Search notes by title, subject, or semester..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-navy-card text-white placeholder-sky-200/60 rounded-full border border-sky-900/50 focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/30 transition-all"
              />
            </div>
          </div>

          {/* Navigation & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Desktop Tabs */}
            <nav className="hidden lg:flex items-center space-x-1 bg-navy-dark/60 p-1.5 rounded-xl border border-sky-900/30">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-teal-main text-white shadow-sm'
                    : 'text-sky-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                All Notes
              </button>
              <button
                onClick={() => setActiveTab('top')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'top'
                    ? 'bg-teal-main text-white shadow-sm'
                    : 'text-sky-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                Top Rated
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab('mine')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'mine'
                      ? 'bg-teal-main text-white shadow-sm'
                      : 'text-sky-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  My Notes
                </button>
              )}
            </nav>

            {/* Upload Note Button */}
            <button
              onClick={onOpenUpload}
              className="bg-teal-main hover:bg-[#00796b] text-white px-3.5 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Note</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Notification Bell — only when authenticated */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={async () => {
                    const opening = !isNotifOpen;
                    setIsNotifOpen(opening);
                    if (opening && unreadCount > 0) {
                      // Immediately clear the badge when panel is opened
                      try {
                        await apiClient.put('/notifications/read-all');
                        setUnreadCount(0);
                        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                      } catch (err) {}
                    }
                  }}
                  className="relative w-9 h-9 rounded-xl bg-navy-card hover:bg-sky-900/40 flex items-center justify-center border border-sky-800/50 transition-all"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-sky-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-sky-100 z-50 overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-navy-main border-b border-navy-card">
                      <span className="text-xs font-extrabold text-white flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-teal-main" />
                        Notifications
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                            {unreadCount} new
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] text-teal-main hover:text-white font-semibold flex items-center gap-1 transition-colors"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-3 h-3" />
                            All read
                          </button>
                        )}
                        <button onClick={() => setIsNotifOpen(false)} className="text-sky-300 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 font-medium">No notifications yet</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">You'll be notified about doubts and replies</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <button
                            key={notif.id}
                            onClick={() => handleNotifClick(notif)}
                            className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                              !notif.isRead ? 'bg-teal-50/50' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                              !notif.isRead ? 'bg-teal-main text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {notif.actorName ? notif.actorName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className={`text-xs leading-relaxed ${!notif.isRead ? 'font-semibold text-navy-main' : 'font-normal text-slate-600'}`}>
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] text-slate-400">{formatTime(notif.createdAt)}</span>
                                {notif.noteId && (
                                  <span className="text-[10px] text-teal-main flex items-center gap-0.5 font-medium">
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    View Thread
                                  </span>
                                )}
                              </div>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 rounded-full bg-teal-main shrink-0 mt-2"></div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth / User Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-navy-card hover:bg-sky-900/40 px-3 py-1.5 rounded-xl border border-sky-800/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-light-blue text-navy-main font-bold flex items-center justify-center text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-sky-100 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-sky-300" />
                </button>

                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white text-navy-main rounded-2xl shadow-xl border border-sky-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-sky-100">
                      <p className="text-xs font-bold text-navy-main">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('mine');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-navy-main hover:bg-light-blue-soft flex items-center gap-2 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-main" />
                      My Uploaded Notes
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border border-white/20"
              >
                <UserIcon className="w-4 h-4 text-teal-main" />
                Sign In
              </button>
            )}

          </div>

        </div>

        {/* Mobile Search & Tabs Subheader */}
        <div className="md:hidden py-3 border-t border-navy-card space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-navy-card text-white placeholder-sky-200/60 rounded-lg border border-sky-900/50 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-around bg-navy-dark p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                activeTab === 'all' ? 'bg-teal-main text-white' : 'text-sky-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                activeTab === 'top' ? 'bg-teal-main text-white' : 'text-sky-200'
              }`}
            >
              Top Rated
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('mine')}
                className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                  activeTab === 'mine' ? 'bg-teal-main text-white' : 'text-sky-200'
                }`}
              >
                My Notes
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
