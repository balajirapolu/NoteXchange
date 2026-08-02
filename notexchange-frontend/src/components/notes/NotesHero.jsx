import React from 'react';
import { BookOpen, Star, Users, Layers, Sparkles } from 'lucide-react';

export const NotesHero = ({ totalNotes, onSubjectSelect, selectedSubject }) => {
  return (
    <div className="bg-navy-main text-white relative overflow-hidden rounded-3xl shadow-xl my-6 mx-4 sm:mx-6 lg:mx-8 border border-navy-card">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-main/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Main Hero Text */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-teal-main/20 border border-teal-main/40 text-teal-main px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Academic Library
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Share & Discover <br />
              <span className="text-teal-main">High Quality</span> Lecture Notes
            </h1>

            <p className="text-sm sm:text-base text-sky-100/80 leading-relaxed">
              Access peer-reviewed study materials, past exam papers, and class notes curated by students and top educators across all semesters.
            </p>
          </div>

          {/* Quick Statistics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 lg:w-80">
            
            <div className="bg-navy-card/90 p-4 rounded-2xl border border-sky-800/40">
              <div className="w-8 h-8 rounded-xl bg-teal-main/20 text-teal-main flex items-center justify-center mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-white">{totalNotes}</span>
              <span className="block text-[11px] font-semibold text-sky-300 uppercase tracking-wider">Total Notes</span>
            </div>

            <div className="bg-navy-card/90 p-4 rounded-2xl border border-sky-800/40">
              <div className="w-8 h-8 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-white">8</span>
              <span className="block text-[11px] font-semibold text-sky-300 uppercase tracking-wider">Semesters</span>
            </div>

            <div className="bg-navy-card/90 p-4 rounded-2xl border border-sky-800/40">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2">
                <Star className="w-4 h-4 fill-amber-300" />
              </div>
              <span className="text-2xl font-black text-white">4.8★</span>
              <span className="block text-[11px] font-semibold text-sky-300 uppercase tracking-wider">Peer Rating</span>
            </div>

            <div className="bg-navy-card/90 p-4 rounded-2xl border border-sky-800/40">
              <div className="w-8 h-8 rounded-xl bg-teal-main/20 text-teal-main flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-white">100%</span>
              <span className="block text-[11px] font-semibold text-sky-300 uppercase tracking-wider">Free Access</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
