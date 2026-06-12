import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Folder, Image as ImageIcon, File, Video, UploadCloud, MoreHorizontal, Trash2, Download, Eye, FileText, X } from 'lucide-react';

interface UploadedFile {
  name: string;
  type: string;
  size: string;
  date: string;
  blob: File;
  url: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.url));
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} className="text-blue-400" />;
      case 'video': return <Video size={20} className="text-purple-400" />;
      case 'pdf': return <FileText size={20} className="text-red-400" />;
      default: return <File size={20} className="text-gray-400" />;
    }
  };

  const getFileType = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)) return 'video';
    if (ext === 'pdf') return 'pdf';
    return 'document';
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const addUploadedFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      name: f.name,
      type: getFileType(f.name),
      size: formatSize(f.size),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      blob: f,
      url: URL.createObjectURL(f),
    }));
    setFiles(prev => [...newFiles, ...prev]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addUploadedFiles(e.dataTransfer.files);
    }
  }, [addUploadedFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDelete = (index: number) => {
    URL.revokeObjectURL(files[index].url);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setActiveMenu(null);
  };

  const handleOpen = (file: UploadedFile) => {
    if (file.type === 'image' || file.type === 'video' || file.type === 'pdf') {
      setPreviewFile(file);
    } else {
      // For non-previewable files, download them
      handleDownload(file);
    }
  };

  const handleDownload = (file: UploadedFile) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setActiveMenu(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handler = () => setActiveMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 text-accent mb-2">
              <Folder size={24} />
              <h1 className="text-2xl font-bold text-text tracking-tight">Media & Files</h1>
            </div>
            <p className="text-muted">Upload and manage files shared with your AI assistant.</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-foreground/10 text-text rounded-xl font-medium hover:bg-foreground/5 transition-colors"
          >
            <UploadCloud size={18} />
            <span>Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                addUploadedFiles(e.target.files);
                e.target.value = '';
              }
            }}
          />
        </header>

        {/* Dropzone area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isDragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-foreground/10 bg-card/30 hover:bg-card/50 hover:border-primary/50'}`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragOver ? 'bg-primary/20' : 'bg-foreground/5'}`}>
            <UploadCloud size={32} className={isDragOver ? 'text-primary' : 'text-muted'} />
          </div>
          <h3 className="text-lg font-semibold text-text mb-1">
            {isDragOver ? 'Drop files here!' : 'Drag and drop files here'}
          </h3>
          <p className="text-sm text-muted">Or click to browse from your computer</p>
        </div>

        {/* File List */}
        <div className="bg-card border border-foreground/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-foreground/5 text-xs font-semibold text-muted uppercase tracking-wider">
            <div className="col-span-6">Name</div>
            <div className="col-span-3">Date Added</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-1 text-right"></div>
          </div>
          
          <div className="divide-y divide-white/5">
            {files.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                  <Folder size={28} className="text-muted/50" />
                </div>
                <p className="text-muted text-sm font-medium mb-1">No files uploaded yet</p>
                <p className="text-muted/60 text-xs">Drag and drop files above or click Upload to get started</p>
              </div>
            ) : (
              files.map((file, i) => (
                <div
                  key={i}
                  onClick={() => handleOpen(file)}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-foreground/5 transition-colors group cursor-pointer relative"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    {/* Thumbnail for images */}
                    {file.type === 'image' ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-foreground/5 flex-shrink-0">
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-foreground/5 flex-shrink-0">
                        {getIcon(file.type)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-text block truncate">{file.name}</span>
                      <span className="text-[10px] text-muted uppercase">{file.type}</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-sm text-muted">{file.date}</div>
                  <div className="col-span-2 text-sm text-muted">{file.size}</div>
                  <div className="col-span-1 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === i ? null : i);
                      }}
                      className="p-2 text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {activeMenu === i && (
                      <div className="absolute right-0 top-10 w-40 bg-card border border-foreground/5 rounded-xl shadow-lg z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(file);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-text hover:bg-foreground/5 transition-colors flex items-center gap-2"
                        >
                          <Eye size={14} className="text-accent" />
                          Open
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-text hover:bg-foreground/5 transition-colors flex items-center gap-2"
                        >
                          <Download size={14} className="text-blue-400" />
                          Download
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(i);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* File count footer */}
          {files.length > 0 && (
            <div className="p-3 border-t border-foreground/5 text-xs text-muted text-center">
              {files.length} file{files.length !== 1 ? 's' : ''} uploaded
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-card border border-foreground/10 rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-foreground/5">
              <div className="flex items-center gap-3">
                {getIcon(previewFile.type)}
                <div>
                  <h3 className="text-sm font-semibold text-text">{previewFile.name}</h3>
                  <p className="text-[10px] text-muted">{previewFile.size} · {previewFile.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewFile)}
                  className="p-2 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
                  title="Download"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6 flex items-center justify-center overflow-auto max-h-[calc(90vh-80px)]">
              {previewFile.type === 'image' && (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              )}
              {previewFile.type === 'video' && (
                <video
                  src={previewFile.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[70vh] rounded-lg"
                />
              )}
              {previewFile.type === 'pdf' && (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[70vh] rounded-lg border-0"
                  title={previewFile.name}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
