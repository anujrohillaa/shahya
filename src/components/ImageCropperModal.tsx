'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Move
} from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  aspectRatio?: number; // width / height, default 16/9 = 1.777
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
  title?: string;
}

export default function ImageCropperModal({
  imageSrc,
  aspectRatio = 16 / 9,
  onCropComplete,
  onCancel,
  title = 'Crop & Frame Room Photo'
}: ImageCropperModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(0.5);
  const [maxScale, setMaxScale] = useState(4);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [rotation, setRotation] = useState(0);

  const [cropBox, setCropBox] = useState({ width: 320, height: 180 });
  const [imageSize, setImageSize] = useState({ naturalWidth: 800, naturalHeight: 600 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Compute crop box dimensions based on container
  const updateCropDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const padX = 20;
    const padY = 20;
    const availWidth = Math.max(containerWidth - padX, 160);
    const availHeight = Math.max(containerHeight - padY, 120);

    let boxWidth = availWidth;
    let boxHeight = boxWidth / aspectRatio;

    if (boxHeight > availHeight) {
      boxHeight = availHeight;
      boxWidth = boxHeight * aspectRatio;
    }

    const finalWidth = Math.round(boxWidth);
    const finalHeight = Math.round(boxHeight);
    setCropBox({ width: finalWidth, height: finalHeight });
  }, [aspectRatio]);

  // Window resize handler
  useEffect(() => {
    updateCropDimensions();
    window.addEventListener('resize', updateCropDimensions);
    return () => window.removeEventListener('resize', updateCropDimensions);
  }, [updateCropDimensions]);

  // Preload and get real natural image dimensions
  useEffect(() => {
    if (!imageSrc) return;
    setImageLoaded(false);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const nw = img.naturalWidth || 800;
      const nh = img.naturalHeight || 600;
      setImageSize({ naturalWidth: nw, naturalHeight: nh });
      setImageLoaded(true);

      // Compute initial cover scale
      if (cropBox.width > 0 && cropBox.height > 0) {
        const scaleX = cropBox.width / nw;
        const scaleY = cropBox.height / nh;
        const fitScale = Math.max(scaleX, scaleY);
        setScale(fitScale);
        setMinScale(fitScale * 0.6);
        setMaxScale(fitScale * 4);
        setOffset({ x: 0, y: 0 });
      }
    };
  }, [imageSrc, cropBox.width, cropBox.height]);

  // Handle pointer dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, minScale), maxScale));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    if (imageSize.naturalWidth > 0 && cropBox.width > 0) {
      const scaleX = cropBox.width / imageSize.naturalWidth;
      const scaleY = cropBox.height / imageSize.naturalHeight;
      setScale(Math.max(scaleX, scaleY));
    }
  };

  // Canvas Crop and Export
  const handleConfirmCrop = () => {
    if (cropBox.width === 0 || cropBox.height === 0) return;

    const img = imageElementRef.current;
    if (!img) return;

    const outputWidth = 1200;
    const outputHeight = Math.round(outputWidth / aspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const previewToOutput = outputWidth / cropBox.width;

    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(offset.x * previewToOutput, offset.y * previewToOutput);
    ctx.scale(scale * previewToOutput, scale * previewToOutput);

    ctx.drawImage(
      img,
      -imageSize.naturalWidth / 2,
      -imageSize.naturalHeight / 2,
      imageSize.naturalWidth,
      imageSize.naturalHeight
    );

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[94dvh] sm:h-auto sm:max-h-[88vh]">
        
        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Crop className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">{title}</h3>
              <p className="text-[10px] text-slate-400">
                16:9 Landscape • Drag photo to position or use zoom
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Canvas Workspace */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing min-h-0 select-none"
        >
          {/* Centered Transformable Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {imageSrc && (
              <img
                ref={imageElementRef}
                src={imageSrc}
                crossOrigin="anonymous"
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  width: `${imageSize.naturalWidth}px`,
                  height: `${imageSize.naturalHeight}px`,
                  transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                }}
                className="select-none pointer-events-none"
              />
            )}
          </div>

          {/* Darkened Mask Layer with Cutout Frame */}
          {cropBox.width > 0 && (
            <div
              className="absolute pointer-events-none"
              style={{
                width: `${cropBox.width}px`,
                height: `${cropBox.height}px`,
                boxShadow: '0 0 0 9999px rgba(10, 15, 29, 0.78)',
                border: '2px solid rgba(16, 185, 129, 0.95)',
                borderRadius: '12px',
              }}
            >
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Corner Handles */}
              <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400" />

              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-bold text-white flex items-center gap-1 border border-white/10">
                <Move className="w-2.5 h-2.5 text-emerald-400" />
                <span>Drag to pan</span>
              </div>
            </div>
          )}
        </div>

        {/* Compact Bottom Toolbar & Actions */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 space-y-2.5 flex-shrink-0">
          
          <div className="flex items-center justify-between gap-3">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <button
                type="button"
                onClick={() => setScale((prev) => Math.max(prev * 0.9, minScale))}
                className="p-1 rounded-md bg-slate-800 text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min={minScale}
                max={maxScale}
                step={(maxScale - minScale) / 100}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <button
                type="button"
                onClick={() => setScale((prev) => Math.min(prev * 1.1, maxScale))}
                className="p-1 rounded-md bg-slate-800 text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rotate & Reset */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRotate}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" />
                <span>Rotate</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmCrop}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Crop & Save</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
