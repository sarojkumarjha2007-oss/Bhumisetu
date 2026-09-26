import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Search, 
  Upload, 
  Download, 
  CheckCircle, 
  Clock, 
  Folder, 
  ShieldCheck,
  Filter,
  FileCheck
} from 'lucide-react';
import { DocumentItem } from '../../types';

export const DocumentManagement: React.FC = () => {
  const { documents, addDocument, projects, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentItem['category']>('Notifications');
  const [newDocProject, setNewDocProject] = useState(projects[0]?.name || '');

  const categories = [
    'All',
    'Proposal',
    'Land Records',
    'Notifications',
    'Survey Reports',
    'Awards',
    'Compensation',
    'R&R Documents',
    'Possession Documents'
  ];

  const filtered = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doc.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || doc.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    const proj = projects.find(p => p.name === newDocProject) || projects[0];

    await addDocument({
      projectId: proj.id,
      projectName: proj.name,
      title: newDocTitle,
      category: newDocCategory,
      fileType: 'PDF',
      fileSizeMb: Number((Math.random() * 8 + 1).toFixed(1)),
      uploadedBy: currentUser.displayName,
      version: 'v1.0',
      status: 'Verified',
      downloadUrl: '#'
    });

    setShowUploadModal(false);
    setNewDocTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Digital Evidence Archive</span>
            <span>·</span>
            <span className="text-blue-700 font-bold">SHA-256 Tamper Evident</span>
            <span>·</span>
            <span>State Gazette Section 3A/4 Repository</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Statutory Gazette &amp; Cadastral Document Vault
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Official digital archive of Section 3A/4/3D gazettes, cadastral village maps, 3G award declarations and compensation receipts.
          </p>
        </div>

        {currentUser.role !== 'viewer' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Statutory Document</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search gazette, award or project..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {doc.id}
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {doc.status}
                </span>
              </div>

              <div className="flex items-start gap-3 mt-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {doc.fileType}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{doc.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.projectName}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-800">{doc.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Uploaded By:</span>
                  <span className="font-medium text-slate-700">{doc.uploadedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-mono text-slate-700">{doc.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Version:</span>
                  <span className="font-mono font-semibold text-slate-800">{doc.version}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                {doc.hash}
              </span>
              <button
                onClick={() => {
                  const content = `BhumiSetu Digital Document Repository\n---------------------------------------\nDocument Title: ${doc.title}\nProject: ${doc.projectName}\nCategory: ${doc.category}\nVersion: ${doc.version}\nUploaded By: ${doc.uploadedBy}\nUpload Date: ${doc.uploadDate}\nDigital Signature Hash: ${doc.hash}\n---------------------------------------\nCertified copy verified under statutory proceedings of RFCTLARR Act 2013.\n`;
                  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_signed.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ({doc.fileSizeMb} MB)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Upload Official Land Document / Gazette
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Documents are digitally fingerprinted with SHA-256 for legal integrity under RFCTLARR.
            </p>

            <form onSubmit={handleUpload} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gazette Notification Sec 3D or Cadastral Map"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Associated Infrastructure Project</label>
                <select
                  value={newDocProject}
                  onChange={e => setNewDocProject(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Statutory Category</label>
                <select
                  value={newDocCategory}
                  onChange={e => setNewDocCategory(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  {categories.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <div className="text-xs font-medium text-slate-700">Drag PDF, KML or Shapefile here</div>
                <div className="text-[10px] text-slate-400">Simulated file upload for SIH prototype demo</div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-800"
                >
                  Confirm Upload & Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
