import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { SUBJECTS_LIST, SEMESTERS_LIST } from '../../data/mockNotes';
import apiClient from '../../api/apiClient';

export const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS_LIST[1] || 'Computer Science');
  const [customSubject, setCustomSubject] = useState('');
  const [semester, setSemester] = useState(3);
  const [file, setFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        setErrorMsg('Please select a valid PDF document.');
        return;
      }
      setErrorMsg('');
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const finalSubject = subject === 'Other' ? customSubject : subject;

    if (!title.trim()) {
      setErrorMsg('Please enter a note title.');
      return;
    }
    if (!finalSubject.trim()) {
      setErrorMsg('Please specify a subject.');
      return;
    }
    if (!file) {
      setErrorMsg('Please attach a PDF file to upload.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', finalSubject);
      formData.append('semester', semester);
      formData.append('file', file);

      const response = await apiClient.post('/notes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg('Note uploaded & published successfully!');
      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess(response.data);
        onClose();
        // Reset form
        setTitle('');
        setFile(null);
      }, 1000);

    } catch (err) {
      console.warn('Backend upload failed:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Upload failed. Please ensure you are logged in and attaching a valid PDF.';
      setErrorMsg(typeof msg === 'string' ? msg : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-lg overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-navy-main p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-main flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upload Lecture Note</h3>
              <p className="text-xs text-sky-200">Share your PDF study material with fellow students</p>
            </div>
          </div>
        </div>

        {/* Body */}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                NOTE TITLE
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structures Unit 1 Handout"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
              />
            </div>

            {/* Subject & Semester Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  SUBJECT
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
                >
                  {SUBJECTS_LIST.filter(s => s !== 'All Subjects').map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="Other">Other Custom Subject</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  SEMESTER
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Subject Input if "Other" */}
            {subject === 'Other' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  SPECIFY CUSTOM SUBJECT
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20"
                />
              </div>
            )}

            {/* PDF File Drag and Drop / Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                ATTACH PDF DOCUMENT
              </label>
              
              <div className="border-2 border-dashed border-sky-200 hover:border-teal-main bg-light-blue-soft rounded-2xl p-6 text-center cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload-input"
                />
                <label htmlFor="pdf-upload-input" className="cursor-pointer block">
                  <FileText className="w-10 h-10 text-teal-main mx-auto mb-2" />
                  {file ? (
                    <div>
                      <p className="text-xs font-bold text-navy-main truncate">{file.name}</p>
                      <p className="text-[11px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB PDF Document</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-navy-main">Click to select PDF document</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full mt-2 bg-teal-main hover:bg-[#00796b] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-600/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading to Cloudinary...
                </>
              ) : (
                'Upload & Publish Note'
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
