import React, { useCallback, useState } from 'react';
import { convertImage } from '@/utils/imageConverter';

interface DropzoneProps {
  onFileConverted: (blob: Blob, originalName: string, targetFormat: string) => void;
  sourceFormat: string;
  targetFormat: string;
}

export default function Dropzone({ onFileConverted, sourceFormat, targetFormat }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0]; // Process single file for now
    
    setIsConverting(true);
    setError('');
    
    try {
      const blob = await convertImage(file, targetFormat);
      onFileConverted(blob, file.name, targetFormat);
    } catch (err: any) {
      setError(err.message || 'Conversion failed. This format might not be supported yet.');
    } finally {
      setIsConverting(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          w-full border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
          flex flex-col items-center justify-center
          ${isDragging ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]/5 scale-[1.02]' : 'border-[var(--border-medium)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]'}
        `}
      >
        <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${isDragging ? 'bg-[var(--neon-purple)]/20 text-[var(--neon-purple)]' : 'bg-white/5 text-[var(--text-secondary)]'}`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        
        {isConverting ? (
          <p className="text-lg font-bold text-[var(--neon-purple)] animate-pulse">Converting image...</p>
        ) : (
          <>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Drop {sourceFormat.toUpperCase()} here to convert to {targetFormat.toUpperCase()}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Lightning fast client-side {sourceFormat} to {targetFormat} conversion
            </p>
            <label className="px-6 py-2.5 rounded-xl bg-[var(--neon-purple)]/10 text-[var(--neon-purple)] font-semibold border border-[var(--neon-purple)]/30 hover:bg-[var(--neon-purple)]/20 transition-colors cursor-pointer">
              Browse Files
              <input type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </label>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
          {error}
        </div>
      )}
    </div>
  );
}
