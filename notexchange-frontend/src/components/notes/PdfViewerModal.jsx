import React, { useState } from 'react';
import { X, ExternalLink, Download, FileText, User, RefreshCw } from 'lucide-react';

export const PdfViewerModal = ({ isOpen, note, onClose }) => {
  const [viewMethod, setViewMethod] = useState('direct'); // 'direct' | 'google'

  if (!isOpen || !note) return null;

  const fileUrl = note.fileUrl && note.fileUrl.startsWith('http') 
    ? note.fileUrl 
    : `http://localhost:8080/api/notes/${note.id}/file`;

  const downloadUrl = `http://localhost:8080/api/notes/${note.id}/download`;
  const encodedUrl = encodeURIComponent(fileUrl);
  const googleViewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-dark/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="bg-navy-main p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-card">
          
          <div className="flex items-center space-x-3 max-w-full sm:max-w-[60%]">
            <div className="w-10 h-10 rounded-xl bg-teal-main flex items-center justify-center shadow-lg shadow-teal-500/20 flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">{note.title}</h3>
              <div className="flex items-center gap-3 text-xs text-sky-200 mt-0.5">
                <span className="bg-teal-main/20 text-teal-main px-2 py-0.5 rounded font-semibold">{note.subject}</span>
                <span>Semester {note.semester}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3 text-teal-main" /> {note.uploaderName}</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            
            {/* View Mode Toggle */}
            <div className="bg-navy-card p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setViewMethod('direct')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMethod === 'direct' ? 'bg-teal-main text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                Direct Stream
              </button>
              <button
                onClick={() => setViewMethod('google')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMethod === 'google' ? 'bg-teal-main text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                Google Viewer
              </button>
            </div>

            {/* External New Tab Open */}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-main hover:bg-[#00796b] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Open PDF in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open in Tab</span>
            </a>

            {/* Download */}
            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              title="Download PDF File"
            >
              <Download className="w-3.5 h-3.5" />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Embedded Viewer Container */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center">
          {viewMethod === 'google' ? (
            <iframe
              src={googleViewerUrl}
              title={note.title}
              className="w-full h-full border-none"
            />
          ) : (
            <object
              data={note.fileUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <iframe
                src={googleViewerUrl}
                title={note.title}
                className="w-full h-full border-none"
              />
            </object>
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div className="bg-navy-main px-4 py-2 text-xs text-sky-200/80 flex items-center justify-between border-t border-navy-card">
          <span>Having trouble viewing inside the frame?</span>
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-main font-bold hover:underline flex items-center gap-1"
          >
            Click here to open PDF directly <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
