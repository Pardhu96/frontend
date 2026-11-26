import React, { useEffect, useRef } from 'react';

export function ConfusionMatrixHeatmap({ matrix, classes, normalized }) {
  if (!matrix || !classes) return null;

  const maxVal = normalized
    ? 1.0
    : Math.max(...matrix.flat(), 1);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid gap-1" style={{ gridTemplateColumns: `90px repeat(${classes.length}, minmax(54px, 1fr))` }}>
          {/* Header Row */}
          <div className="text-[11px] font-semibold text-slate-400 flex items-end justify-end pr-2 pb-1">
            True \ Pred
          </div>
          {classes.map((cls) => (
            <div
              key={cls}
              className="text-[11px] font-semibold text-slate-300 text-center pb-1 capitalize truncate"
              title={cls}
            >
              {cls}
            </div>
          ))}

          {/* Matrix Rows */}
          {matrix.map((row, rIdx) => (
            <React.Fragment key={classes[rIdx]}>
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-end pr-2 capitalize">
                {classes[rIdx]}
              </div>
              {row.map((val, cIdx) => {
                const intensity = Math.min(1, val / maxVal);
                const isDiag = rIdx === cIdx;
                const bg = isDiag
                  ? `rgba(99, 102, 241, ${0.15 + intensity * 0.75})`
                  : `rgba(51, 65, 85, ${0.25 + intensity * 0.65})`;
                const display = normalized ? `${(val * 100).toFixed(0)}%` : val;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{ backgroundColor: bg }}
                    className={`h-11 rounded-md flex items-center justify-center text-xs font-medium border ${
                      isDiag ? 'border-indigo-500/40 text-white font-bold' : 'border-slate-800/60 text-slate-200'
                    }`}
                    title={`True: ${classes[rIdx]} | Predicted: ${classes[cIdx]} | Value: ${display}`}
                  >
                    {display}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a 2D numerical matrix (Mel Spectrogram or MFCCs) onto a responsive HTML5 Canvas.
 */
export function MatrixCanvas({ matrix, colorScheme = 'viridis', height = 240 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !matrix || matrix.length === 0) return;

    const rows = matrix.length;
    const cols = matrix[0].length;
    canvas.width = cols;
    canvas.height = rows;

    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(cols, rows);

    let min = Infinity;
    let max = -Infinity;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = matrix[r][c];
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    const range = max - min || 1;

    for (let r = 0; r < rows; r++) {
      // Flip vertically so low frequencies / lower indices are at bottom
      const srcRow = rows - 1 - r;
      for (let c = 0; c < cols; c++) {
        const norm = (matrix[srcRow][c] - min) / range;
        const idx = (r * cols + c) * 4;

        let red, green, blue;
        if (colorScheme === 'viridis') {
          red = Math.round(68 + norm * (253 - 68));
          green = Math.round(1 + norm * (231 - 1));
          blue = Math.round(84 + Math.sin(norm * Math.PI) * 120);
        } else {
          // Cool-Warm (Blue -> Slate -> Rose)
          if (norm < 0.5) {
            const t = norm * 2;
            red = Math.round(59 + t * (226 - 59));
            green = Math.round(130 + t * (232 - 130));
            blue = Math.round(246 + t * (240 - 246));
          } else {
            const t = (norm - 0.5) * 2;
            red = Math.round(226 + t * (239 - 226));
            green = Math.round(232 - t * (232 - 68));
            blue = Math.round(240 - t * (240 - 68));
          }
        }

        imgData.data[idx] = red;
        imgData.data[idx + 1] = green;
        imgData.data[idx + 2] = blue;
        imgData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [matrix, colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height: `${height}px` }}
      className="w-full rounded-xl border border-slate-800 bg-slate-950"
    />
  );
}
