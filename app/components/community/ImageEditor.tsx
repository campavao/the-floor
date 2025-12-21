"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import FloorButton from "../FloorButton";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImageBlob: Blob) => void;
  imageUrl: string;
  title: string;
}

export default function ImageEditor({
  isOpen,
  onClose,
  onSave,
  imageUrl,
  title,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [currentImageData, setCurrentImageData] = useState<ImageData | null>(null);
  const [maskData, setMaskData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Load image when modal opens
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setOriginalImage(img);
      
      // Calculate canvas size to fit container while maintaining aspect ratio
      const maxWidth = Math.min(window.innerWidth - 100, 1000);
      const maxHeight = window.innerHeight - 250;
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = width * ratio;
      }
      
      setScale(width / img.width);
      setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      console.error("Failed to load image");
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl]);

  // Draw image on canvas
  useEffect(() => {
    if (!canvasRef.current || !originalImage || isLoading) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    ctx.drawImage(originalImage, 0, 0, canvasSize.width, canvasSize.height);
    setCurrentImageData(ctx.getImageData(0, 0, canvasSize.width, canvasSize.height));
    
    // Initialize mask
    const mask = ctx.createImageData(canvasSize.width, canvasSize.height);
    setMaskData(mask);
  }, [originalImage, canvasSize, isLoading]);

  const getCanvasCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const drawBrushStroke = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx || !currentImageData || !maskData) return;

    // Update mask
    const maskCtx = document.createElement("canvas").getContext("2d");
    if (!maskCtx) return;
    
    // Draw on mask (store white where we paint)
    for (let dy = -brushSize; dy <= brushSize; dy++) {
      for (let dx = -brushSize; dx <= brushSize; dx++) {
        if (dx * dx + dy * dy <= brushSize * brushSize) {
          const px = Math.floor(x + dx);
          const py = Math.floor(y + dy);
          if (px >= 0 && px < canvasSize.width && py >= 0 && py < canvasSize.height) {
            const idx = (py * canvasSize.width + px) * 4;
            maskData.data[idx] = 255;     // R
            maskData.data[idx + 1] = 255; // G
            maskData.data[idx + 2] = 255; // B
            maskData.data[idx + 3] = 255; // A
          }
        }
      }
    }

    // Draw line if we have a previous position
    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    
    // Draw circle at current position
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fill();
    
    lastPosRef.current = { x, y };
  }, [brushSize, canvasSize, currentImageData, maskData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasCoordinates(e);
    lastPosRef.current = pos;
    drawBrushStroke(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const pos = getCanvasCoordinates(e);
    drawBrushStroke(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasCoordinates(e);
    lastPosRef.current = pos;
    drawBrushStroke(pos.x, pos.y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getCanvasCoordinates(e);
    drawBrushStroke(pos.x, pos.y);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const resetCanvas = () => {
    if (!canvasRef.current || !originalImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(originalImage, 0, 0, canvasSize.width, canvasSize.height);
    setCurrentImageData(ctx.getImageData(0, 0, canvasSize.width, canvasSize.height));
    
    // Reset mask
    const mask = ctx.createImageData(canvasSize.width, canvasSize.height);
    setMaskData(mask);
    lastPosRef.current = null;
  };

  const applyInpainting = () => {
    if (!canvasRef.current || !originalImage || !maskData || !currentImageData) return;
    
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // Simple inpainting: use surrounding pixels to fill in masked areas
    // This is a basic blur/average approach for client-side processing
    const outputData = ctx.createImageData(canvasSize.width, canvasSize.height);
    outputData.data.set(currentImageData.data);

    const radius = 5;
    
    for (let y = 0; y < canvasSize.height; y++) {
      for (let x = 0; x < canvasSize.width; x++) {
        const idx = (y * canvasSize.width + x) * 4;
        
        // Check if this pixel is masked
        if (maskData.data[idx + 3] > 0) {
          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          
          // Sample surrounding pixels that aren't masked
          for (let dy = -radius * 2; dy <= radius * 2; dy++) {
            for (let dx = -radius * 2; dx <= radius * 2; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              
              if (nx >= 0 && nx < canvasSize.width && ny >= 0 && ny < canvasSize.height) {
                const nidx = (ny * canvasSize.width + nx) * 4;
                
                // Only use unmasked pixels
                if (maskData.data[nidx + 3] === 0) {
                  sumR += currentImageData.data[nidx];
                  sumG += currentImageData.data[nidx + 1];
                  sumB += currentImageData.data[nidx + 2];
                  count++;
                }
              }
            }
          }
          
          if (count > 0) {
            outputData.data[idx] = Math.round(sumR / count);
            outputData.data[idx + 1] = Math.round(sumG / count);
            outputData.data[idx + 2] = Math.round(sumB / count);
            outputData.data[idx + 3] = 255;
          }
        }
      }
    }
    
    // Apply a smoothing pass on masked areas
    const smoothedData = ctx.createImageData(canvasSize.width, canvasSize.height);
    smoothedData.data.set(outputData.data);
    
    for (let pass = 0; pass < 3; pass++) {
      for (let y = 1; y < canvasSize.height - 1; y++) {
        for (let x = 1; x < canvasSize.width - 1; x++) {
          const idx = (y * canvasSize.width + x) * 4;
          
          if (maskData.data[idx + 3] > 0) {
            let sumR = 0, sumG = 0, sumB = 0;
            
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const nidx = ((y + dy) * canvasSize.width + (x + dx)) * 4;
                sumR += outputData.data[nidx];
                sumG += outputData.data[nidx + 1];
                sumB += outputData.data[nidx + 2];
              }
            }
            
            smoothedData.data[idx] = Math.round(sumR / 9);
            smoothedData.data[idx + 1] = Math.round(sumG / 9);
            smoothedData.data[idx + 2] = Math.round(sumB / 9);
          }
        }
      }
      outputData.data.set(smoothedData.data);
    }
    
    ctx.putImageData(smoothedData, 0, 0);
    setCurrentImageData(ctx.getImageData(0, 0, canvasSize.width, canvasSize.height));
    
    // Reset mask after applying
    const mask = ctx.createImageData(canvasSize.width, canvasSize.height);
    setMaskData(mask);
    lastPosRef.current = null;
    
    setIsProcessing(false);
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    
    // Create a full-resolution canvas for saving
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = originalImage?.width || canvasSize.width;
    outputCanvas.height = originalImage?.height || canvasSize.height;
    
    const outputCtx = outputCanvas.getContext("2d");
    if (!outputCtx) {
      setIsProcessing(false);
      return;
    }
    
    // Draw the edited canvas scaled to original size
    outputCtx.drawImage(
      canvasRef.current,
      0,
      0,
      canvasSize.width,
      canvasSize.height,
      0,
      0,
      outputCanvas.width,
      outputCanvas.height
    );
    
    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          onSave(blob);
          onClose();
        }
        setIsProcessing(false);
      },
      "image/jpeg",
      0.9
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-[#00d4ff] w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-[#00d4ff]/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
              Edit: {title}
            </h3>
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold shrink-0"
              onClick={onClose}
            >
              Cancel
            </FloorButton>
          </div>
        </div>

        {/* Tools */}
        <div className="p-3 sm:p-4 bg-gray-800/50 border-b border-[#00d4ff]/30">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="text-white text-sm">Brush:</label>
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 sm:w-32"
              />
              <span className="text-white/70 text-sm w-8">{brushSize}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <FloorButton
                variant="rectangular"
                className="text-xs sm:text-sm font-semibold"
                onClick={applyInpainting}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Apply Fix"}
              </FloorButton>
              <FloorButton
                variant="rectangular"
                className="text-xs sm:text-sm font-semibold"
                onClick={resetCanvas}
                disabled={isProcessing}
              >
                Reset
              </FloorButton>
            </div>
          </div>
          <p className="text-white/60 text-xs mt-2">
            Paint over text/areas to remove, then click "Apply Fix"
          </p>
        </div>

        {/* Canvas */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-gray-950"
        >
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-[#00d4ff] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-white/70 mt-4">Loading image...</p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="border border-gray-700 cursor-crosshair touch-none max-w-full"
              style={{ maxHeight: "calc(100vh - 300px)" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#00d4ff]/30 flex justify-end gap-3">
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={onClose}
          >
            Cancel
          </FloorButton>
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={handleSave}
            disabled={isProcessing || isLoading}
          >
            {isProcessing ? "Saving..." : "Save Changes"}
          </FloorButton>
        </div>
      </div>
    </div>
  );
}
