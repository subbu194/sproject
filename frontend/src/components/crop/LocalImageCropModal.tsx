import React, { useState, useCallback, useRef } from 'react';
import { Cropper, CircleStencil, RectangleStencil } from 'react-advanced-cropper';
import type { CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Upload, Check, Scissors } from 'lucide-react';

export interface LocalImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void;
  /** Also called when admin wants to use the image as-is without cropping */
  onSkipCrop?: (file: File) => void;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  CircularCrop?: boolean;
  /** Output MIME type for the cropped image. Use 'image/png' to preserve transparency. Defaults to 'image/jpeg'. */
  outputMimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
  /** Title shown in the modal header */
  title?: string;
}

const LocalImageCropModal: React.FC<LocalImageCropModalProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  onSkipCrop,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  CircularCrop = false,
  outputMimeType = 'image/jpeg',
  title = 'Crop Image',
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!acceptedFileTypes.includes(file.type)) {
      setError('Invalid file type. Please select JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`);
      return;
    }

    try {
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCurrentFile(file);
    } catch {
      setError('Failed to read the image. Please try again.');
    }
  };

  const handleCrop = useCallback(() => {
    if (!cropperRef.current) return;
    setIsProcessing(true);
    setError(null);

    try {
      const canvas = cropperRef.current.getCanvas();
      if (!canvas) {
        setError('Failed to process the image. Please try again.');
        setIsProcessing(false);
        return;
      }

      canvas.toBlob(
        (blob: Blob | null) => {
          setIsProcessing(false);
          if (!blob) {
            setError('Failed to process the image. Please try again.');
            return;
          }
          const croppedImageUrl = URL.createObjectURL(blob);
          onCropComplete(blob, croppedImageUrl);
          resetAndClose();
        },
        outputMimeType,
        outputMimeType === 'image/png' ? undefined : 0.9
      );
    } catch {
      setError('Failed to crop the image. Please try again.');
      setIsProcessing(false);
    }
  }, [onCropComplete, outputMimeType]);

  const handleSkip = () => {
    if (currentFile && onSkipCrop) {
      onSkipCrop(currentFile);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setImageSrc(null);
    setCurrentFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const handleZoomIn = () => cropperRef.current?.zoomImage(1.1);
  const handleZoomOut = () => cropperRef.current?.zoomImage(0.9);
  const handleRotate = () => cropperRef.current?.rotateImage(90);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44, 26, 14, 0.7)', backdropFilter: 'blur(6px)' }}
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl"
            style={{
              backgroundColor: 'var(--warm-white)',
              border: '1px solid rgba(200,150,42,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-8 py-6"
              style={{ borderBottom: '1px solid rgba(44,26,14,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                    boxShadow: '0 4px 12px rgba(200,150,42,0.25)',
                  }}
                >
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(200,150,42,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              {!imageSrc ? (
                // Upload area
                <div className="flex flex-col items-center justify-center py-16">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className="flex h-28 w-28 items-center justify-center rounded-3xl transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(200,150,42,0.08) 0%, rgba(232,184,75,0.12) 100%)',
                        border: '2px dashed rgba(200,150,42,0.35)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)';
                        (e.currentTarget as HTMLDivElement).style.background =
                          'linear-gradient(135deg, rgba(200,150,42,0.15) 0%, rgba(232,184,75,0.2) 100%)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,150,42,0.35)';
                        (e.currentTarget as HTMLDivElement).style.background =
                          'linear-gradient(135deg, rgba(200,150,42,0.08) 0%, rgba(232,184,75,0.12) 100%)';
                      }}
                    >
                      <Upload
                        className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: 'var(--gold)' }}
                      />
                    </div>
                    <h3
                      className="mt-6 text-xl font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}
                    >
                      Upload an image
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                      JPEG, PNG, WebP — up to {Math.round(maxFileSize / (1024 * 1024))}MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-7 inline-flex items-center gap-2 rounded-2xl px-7 py-3 text-sm font-bold text-white transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                      boxShadow: '0 4px 16px rgba(200,150,42,0.3)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                        '0 8px 24px rgba(200,150,42,0.45)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                        '0 4px 16px rgba(200,150,42,0.3)')
                    }
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFileTypes.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                // Cropper area
                <div>
                  {/* Cropper canvas */}
                  <div
                    className="relative overflow-hidden rounded-2xl"
                    style={{ height: '320px', backgroundColor: '#1a0f07' }}
                  >
                    <Cropper
                      ref={cropperRef}
                      src={imageSrc}
                      stencilComponent={CircularCrop ? CircleStencil : RectangleStencil}
                      stencilProps={{ movable: true, resizable: true, lines: true, grid: true }}
                      className="h-full w-full"
                      backgroundClassName="bg-[#1a0f07]"
                    />
                  </div>

                  <p className="mt-3 text-center text-xs" style={{ color: 'var(--muted)' }}>
                    Drag edges / corners to resize • Drag inside to reposition
                  </p>

                  {/* Controls */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <div
                      className="flex items-center gap-1 rounded-xl px-2 py-1.5"
                      style={{ backgroundColor: 'var(--cream)' }}
                    >
                      <ControlBtn onClick={handleZoomOut} title="Zoom out">
                        <ZoomOut className="h-4 w-4" />
                      </ControlBtn>
                      <span className="px-2 text-xs font-bold" style={{ color: 'var(--muted)' }}>
                        Zoom
                      </span>
                      <ControlBtn onClick={handleZoomIn} title="Zoom in">
                        <ZoomIn className="h-4 w-4" />
                      </ControlBtn>
                    </div>

                    <ControlBtnWide onClick={handleRotate}>
                      <RotateCw className="h-4 w-4" />
                      Rotate 90°
                    </ControlBtnWide>

                    <ControlBtnWide
                      onClick={() => {
                        setImageSrc(null);
                        setCurrentFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Choose Different
                    </ControlBtnWide>
                  </div>

                  {/* Action buttons */}
                  <div
                    className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-6"
                    style={{ borderTop: '1px solid rgba(44,26,14,0.06)' }}
                  >
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200"
                      style={{ color: 'var(--muted)' }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--cream)')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent')
                      }
                    >
                      Cancel
                    </button>

                    {onSkipCrop && (
                      <button
                        type="button"
                        onClick={handleSkip}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 disabled:opacity-50"
                        style={{
                          backgroundColor: 'var(--cream)',
                          color: 'var(--brown)',
                          border: '1px solid rgba(44,26,14,0.12)',
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)')
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(44,26,14,0.12)')
                        }
                      >
                        Use As-Is
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleCrop}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                        boxShadow: '0 4px 14px rgba(200,150,42,0.35)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isProcessing)
                          (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            '0 6px 20px rgba(200,150,42,0.5)';
                      }}
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                          '0 4px 14px rgba(200,150,42,0.35)')
                      }
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Crop &amp; Apply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-4 rounded-2xl p-4 text-sm font-medium"
                    style={{
                      backgroundColor: 'rgba(220,38,38,0.06)',
                      border: '1px solid rgba(220,38,38,0.2)',
                      color: '#dc2626',
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Small helpers ── */
function ControlBtn({
  onClick,
  children,
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
      style={{ color: 'var(--brown)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(200,150,42,0.12)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--brown)';
      }}
    >
      {children}
    </button>
  );
}

function ControlBtnWide({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200"
      style={{ backgroundColor: 'var(--cream)', color: 'var(--brown)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(200,150,42,0.12)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--cream)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--brown)';
      }}
    >
      {children}
    </button>
  );
}

export default LocalImageCropModal;
