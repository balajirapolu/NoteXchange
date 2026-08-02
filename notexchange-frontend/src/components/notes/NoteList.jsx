import React from 'react';
import { NoteCard } from './NoteCard';
import { SUBJECTS_LIST, SEMESTERS_LIST } from '../../data/mockNotes';
import { Filter, BookOpen, Upload, Layers } from 'lucide-react';

export const NoteList = ({ 
  notes, 
  activeTab, 
  setActiveTab,
  selectedSubject, 
  setSelectedSubject, 
  selectedSemester, 
  setSelectedSemester,
  onViewPdf, 
  onRate,
  onDelete,
  onOpenUpload
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Filters and Navigation Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        
        {/* Header Title & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-main tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-main" />
              {activeTab === 'top' ? 'Top Rated Notes' : activeTab === 'mine' ? 'My Uploaded Notes' : 'Browse All Notes'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {notes.length} verified academic resources
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center space-x-1 bg-light-blue-soft p-1.5 rounded-2xl border border-sky-100">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-navy-main text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-main'
              }`}
            >
              All Notes
            </button>

            <button
              onClick={() => setActiveTab('top')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'top'
                  ? 'bg-navy-main text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-main'
              }`}
            >
              Top Rated
            </button>

            <button
              onClick={() => setActiveTab('mine')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'mine'
                  ? 'bg-navy-main text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-main'
              }`}
            >
              My Notes
            </button>
          </div>

        </div>

        {/* Dropdown Filters (Subject & Semester) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          
          {/* Subject Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-teal-main" /> Subject:
            </span>

            {SUBJECTS_LIST.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedSubject === subj
                    ? 'bg-teal-main text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-light-blue hover:text-navy-main'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Semester Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-main" /> Semester:
            </span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-slate-100 text-navy-main font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-main"
            >
              {SEMESTERS_LIST.map((sem) => (
                <option key={sem} value={sem}>
                  {sem === 'All Semesters' ? 'All Semesters' : `Semester ${sem}`}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Grid of Notes Cards */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onViewPdf={onViewPdf}
              onRate={onRate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-sky-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-light-blue text-teal-main flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-main">No Notes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any study materials matching your selected filters or search terms.
          </p>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 bg-teal-main hover:bg-[#00796b] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-teal-600/30 transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload First Note
          </button>
        </div>
      )}

    </div>
  );
};
