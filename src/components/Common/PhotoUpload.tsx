import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoSelected: (dataUrl: string) => void;
  onRemovePhoto?: () => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoSelected,
  onRemovePhoto,
  size = 'md',
  label = 'Profile Photo',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      // Optimize image resolution in browser using canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          onPhotoSelected(compressed);
        } else {
          onPhotoSelected(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32',
  }[size];

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Avatar Display & Hover overlay */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative ${sizeClasses} rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0 transition-all border-2 ${
            isDragging
              ? 'border-sky-400 ring-4 ring-sky-400/30 scale-105'
              : 'border-[#1C2C4E] hover:border-sky-400'
          } shadow-xl bg-[#0E1626]`}
          title="Click or drag image to upload"
        >
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111A2E] to-[#0B1120] text-slate-400">
              <Camera className="w-7 h-7 text-sky-400 mb-1" />
              <span className="text-[10px] text-slate-400 font-medium">Add Photo</span>
            </div>
          )}

          {/* Interactive Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
            <Camera className="w-6 h-6 text-sky-300 mb-0.5" />
            <span className="text-[10px] font-bold text-center leading-tight">Change Photo</span>
          </div>

          {/* Dragging highlight */}
          {isDragging && (
            <div className="absolute inset-0 bg-sky-500/30 backdrop-blur-xs flex items-center justify-center">
              <Upload className="w-8 h-8 text-white animate-bounce" />
            </div>
          )}
        </div>

        {/* Upload Buttons and helper text */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-md shadow-sky-950/30 flex items-center space-x-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Upload Photo</span>
            </button>

            {currentPhotoUrl && onRemovePhoto && (
              <button
                type="button"
                onClick={onRemovePhoto}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#111A2E] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#1C2C4E] hover:border-rose-500/40 flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Drag and drop or browse from your device. JPG, PNG or WebP up to 5MB. Photo is automatically optimized for your Chirro handle.
          </p>

          {errorMsg && (
            <div className="flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/40 px-2.5 py-1 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
