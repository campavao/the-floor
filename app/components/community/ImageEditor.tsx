"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { eraseRegion } from "@/lib/community/inpaint";

import FloorButton from "../FloorButton";

/**
 * Crop and erase, working on the copy we already stored.
 *
 * Editing our own image rather than the original search result is what makes
 * this possible at all: a canvas that has drawn a cross-origin image without
 * CORS headers is tainted, and `toBlob` throws. Our bucket sends the headers,
 * so the pixels stay readable.
 *
 * Erase runs the inpainting in `lib/community/inpaint.ts` -- it rebuilds the
 * painted area from its surroundings rather than blurring it, which is the
 * difference between a watermark going away and a watermark turning into a
 * grey smudge.
 */

type Tool = "erase" | "crop";

const MAX_UNDO = 8;

export default function ImageEditor({
  src,
  itemName,
  onSave,
  onClose,
}: {
  src: string;
  itemName: string;
  onSave: (blob: Blob) => Promise<void> | void;
  onClose: () => void;
}) {
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8Array | null>(null);
  const undoRef = useRef<ImageData[]>([]);

  const [tool, setTool] = useState<Tool>("erase");
  const [brush, setBrush] = useState(28);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hasMask, setHasMask] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [crop, setCrop] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const drawing = useRef(false);
  const cropStart = useRef<{ x: number; y: number } | null>(null);

  /** Repaints the visible canvas: real pixels, plus whatever is pending. */
  const redraw = useCallback(() => {
    const base = baseRef.current;
    const view = viewRef.current;
    if (!base || !view) return;

    const context = view.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, view.width, view.height);
    context.drawImage(base, 0, 0);

    const mask = maskRef.current;
    if (mask) {
      const overlay = context.getImageData(0, 0, view.width, view.height);
      for (let i = 0; i < mask.length; i += 1) {
        if (!mask[i]) continue;
        // Tint painted pixels so the region being erased is obvious.
        overlay.data[i * 4] = Math.min(255, overlay.data[i * 4] * 0.3 + 220);
        overlay.data[i * 4 + 1] *= 0.3;
        overlay.data[i * 4 + 2] *= 0.3;
      }
      context.putImageData(overlay, 0, 0);
    }

    if (crop) {
      context.save();
      context.fillStyle = "rgba(0, 0, 0, 0.55)";
      context.beginPath();
      context.rect(0, 0, view.width, view.height);
      context.rect(crop.x, crop.y, crop.w, crop.h);
      context.fill("evenodd");
      context.strokeStyle = "#00d4ff";
      context.lineWidth = Math.max(2, view.width / 400);
      context.strokeRect(crop.x, crop.y, crop.w, crop.h);
      context.restore();
    }
  }, [crop]);

  useEffect(() => {
    const image = new Image();
    // Our own bucket, which is configured to allow this. Without it the canvas
    // would taint and saving would fail.
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const base = document.createElement("canvas");
      base.width = image.naturalWidth;
      base.height = image.naturalHeight;
      base.getContext("2d")?.drawImage(image, 0, 0);
      baseRef.current = base;

      const view = viewRef.current;
      if (view) {
        view.width = base.width;
        view.height = base.height;
      }

      maskRef.current = new Uint8Array(base.width * base.height);
      setReady(true);
    };

    image.onerror = () =>
      setError(
        "Couldn't load that image for editing. If it was just uploaded, give it a moment and try again."
      );

    image.src = src;
  }, [src]);

  useEffect(() => {
    if (ready) redraw();
  }, [ready, redraw]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /** Screen coordinates to image pixel coordinates. */
  const toImageSpace = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const view = viewRef.current;
    if (!view) return { x: 0, y: 0 };

    const rect = view.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * view.width,
      y: ((event.clientY - rect.top) / rect.height) * view.height,
    };
  };

  const paintAt = (x: number, y: number) => {
    const view = viewRef.current;
    const mask = maskRef.current;
    if (!view || !mask) return;

    const radius = brush;
    const minX = Math.max(0, Math.floor(x - radius));
    const maxX = Math.min(view.width - 1, Math.ceil(x + radius));
    const minY = Math.max(0, Math.floor(y - radius));
    const maxY = Math.min(view.height - 1, Math.ceil(y + radius));

    for (let py = minY; py <= maxY; py += 1) {
      for (let px = minX; px <= maxX; px += 1) {
        const dx = px - x;
        const dy = py - y;
        if (dx * dx + dy * dy <= radius * radius) {
          mask[py * view.width + px] = 1;
        }
      }
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ready || busy) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;

    const point = toImageSpace(event);
    if (tool === "erase") {
      paintAt(point.x, point.y);
      setHasMask(true);
      redraw();
    } else {
      cropStart.current = point;
      setCrop({ x: point.x, y: point.y, w: 0, h: 0 });
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const point = toImageSpace(event);

    if (tool === "erase") {
      paintAt(point.x, point.y);
      redraw();
      return;
    }

    const start = cropStart.current;
    if (!start) return;
    setCrop({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      w: Math.abs(point.x - start.x),
      h: Math.abs(point.y - start.y),
    });
  };

  const onPointerUp = () => {
    drawing.current = false;
    cropStart.current = null;
  };

  const pushUndo = () => {
    const base = baseRef.current;
    const context = base?.getContext("2d");
    if (!base || !context) return;

    undoRef.current.push(context.getImageData(0, 0, base.width, base.height));
    if (undoRef.current.length > MAX_UNDO) undoRef.current.shift();
    setCanUndo(true);
  };

  const applyErase = () => {
    const base = baseRef.current;
    const mask = maskRef.current;
    const context = base?.getContext("2d");
    if (!base || !mask || !context) return;

    setBusy(true);
    // Let the button's disabled state paint before we block the thread.
    requestAnimationFrame(() => {
      try {
        pushUndo();

        const imageData = context.getImageData(0, 0, base.width, base.height);
        eraseRegion(imageData.data, mask, base.width, base.height);
        context.putImageData(imageData, 0, 0);

        maskRef.current = new Uint8Array(base.width * base.height);
        setHasMask(false);
        redraw();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Erase failed.");
      } finally {
        setBusy(false);
      }
    });
  };

  const applyCrop = () => {
    const base = baseRef.current;
    const view = viewRef.current;
    if (!base || !view || !crop || crop.w < 8 || crop.h < 8) return;

    pushUndo();

    const next = document.createElement("canvas");
    next.width = Math.round(crop.w);
    next.height = Math.round(crop.h);
    next
      .getContext("2d")
      ?.drawImage(
        base,
        Math.round(crop.x),
        Math.round(crop.y),
        next.width,
        next.height,
        0,
        0,
        next.width,
        next.height
      );

    baseRef.current = next;
    view.width = next.width;
    view.height = next.height;
    maskRef.current = new Uint8Array(next.width * next.height);

    setCrop(null);
    setHasMask(false);
    redraw();
  };

  const undo = () => {
    const previous = undoRef.current.pop();
    if (!previous) return;

    const base = document.createElement("canvas");
    base.width = previous.width;
    base.height = previous.height;
    base.getContext("2d")?.putImageData(previous, 0, 0);
    baseRef.current = base;

    const view = viewRef.current;
    if (view) {
      view.width = base.width;
      view.height = base.height;
    }

    maskRef.current = new Uint8Array(base.width * base.height);
    setHasMask(false);
    setCrop(null);
    setCanUndo(undoRef.current.length > 0);
    redraw();
  };

  const save = async () => {
    const base = baseRef.current;
    if (!base) return;

    setBusy(true);
    setError("");

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        base.toBlob(resolve, "image/webp", 0.92)
      );
      if (!blob) throw new Error("Couldn't read the edited image back.");
      await onSave(blob);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Save failed.");
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border-2 border-[#00d4ff] rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4 border-b border-[#00d4ff]/40 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold" style={{ color: "#00d4ff" }}>
            Editing “{itemName}”
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl leading-none px-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[320px]">
          {error && !ready ? (
            <p className="text-red-300 text-center">{error}</p>
          ) : (
            <>
              {/* Stays mounted while loading: the image's onload writes
                  straight to this canvas, so the ref has to already exist. */}
              {!ready && (
                <p className="text-[#00d4ff] animate-pulse absolute">
                  Loading image…
                </p>
              )}
              <canvas
                ref={viewRef}
                data-ready={ready ? "true" : "false"}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="max-w-full max-h-[55vh] object-contain touch-none"
                style={{ cursor: tool === "erase" ? "crosshair" : "cell" }}
              />
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#00d4ff]/40 flex flex-col gap-3">
          {error && ready && <p className="text-red-300 text-sm">{error}</p>}

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded overflow-hidden border border-[#00d4ff]/60">
              {(["erase", "crop"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setTool(option);
                    setCrop(null);
                  }}
                  className={`px-4 py-2 text-sm font-semibold capitalize ${
                    tool === option
                      ? "bg-[#00d4ff] text-black"
                      : "bg-gray-800 text-white/80"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {tool === "erase" && (
              <label className="flex items-center gap-2 text-sm text-white/80">
                Brush
                <input
                  type="range"
                  min={6}
                  max={90}
                  value={brush}
                  onChange={(event) => setBrush(Number(event.target.value))}
                />
              </label>
            )}

            <div className="flex-1" />

            {tool === "erase" ? (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                disabled={!hasMask || busy}
                onClick={applyErase}
              >
                {busy ? "Erasing…" : "Erase painted area"}
              </FloorButton>
            ) : (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                disabled={!crop || crop.w < 8 || busy}
                onClick={applyCrop}
              >
                Apply crop
              </FloorButton>
            )}

            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              disabled={!canUndo || busy}
              onClick={undo}
            >
              Undo
            </FloorButton>

            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              disabled={!ready || busy}
              onClick={save}
            >
              {busy ? "Saving…" : "Save"}
            </FloorButton>
          </div>

          <p className="text-xs text-white/50">
            {tool === "erase"
              ? "Paint over text, logos or watermarks, then Erase. Works best on plain backgrounds like sky or blur — across a hard edge, Crop is usually the better fix."
              : "Drag a box to keep. Everything outside it is discarded."}
          </p>
        </div>
      </div>
    </div>
  );
}
