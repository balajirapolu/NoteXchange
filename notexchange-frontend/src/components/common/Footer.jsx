import React from 'react';
import { BookOpen, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-main text-white border-t border-navy-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-teal-main flex items-center justify-center shadow-lg shadow-teal-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Note<span className="text-teal-main">Xchange</span>
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-sm leading-relaxed">
              NoteXchange is an open-access academic repository connecting students and educators to share verified study materials, lecture notes, and semester resources.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">Platform Links</h4>
            <ul className="space-y-2 text-xs text-sky-100/80">
              <li><a href="#all" className="hover:text-teal-main transition-colors">All Notes Library</a></li>
              <li><a href="#top" className="hover:text-teal-main transition-colors">Top Rated Materials</a></li>
              <li><a href="#upload" className="hover:text-teal-main transition-colors">Upload New Note</a></li>
              <li><a href="#auth" className="hover:text-teal-main transition-colors">Student Sign In</a></li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs text-sky-100/80">
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-teal-main" /> Cloudinary PDF Storage</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-teal-main" /> JWT Secure Auth</li>
              <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-amber-400" /> Peer Star Ratings</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-navy-card flex flex-col sm:flex-row items-center justify-between text-xs text-sky-300/70 gap-4">
          <p>© 2026 NoteXchange Portal. Built for Academic Excellence.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-teal-main fill-teal-main" /> using Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
