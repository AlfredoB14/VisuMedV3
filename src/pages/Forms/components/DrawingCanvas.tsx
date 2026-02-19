import React, { useEffect, useRef, useState } from 'react';

interface DrawingCanvasProps {
  imageUrl: string;
  onSave: (canvas: HTMLCanvasElement) => void;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface Annotation {
  type: 'draw' | 'text';
  points?: Position[];
  text?: string;
  position?: Position;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ imageUrl, onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'text'>('draw');
  const [text, setText] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentPath, setCurrentPath] = useState<Position[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Load and draw the base image
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      redrawAnnotations();
    };
  }, [imageUrl]);

  const redrawAnnotations = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;

    // Clear canvas and redraw image
    const image = new Image();
    image.src = imageUrl;
    if (canvas) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    // Set drawing style
    context.strokeStyle = '#FFEB3B';
    context.fillStyle = '#FFEB3B';
    context.lineWidth = 2;
    context.font = '16px Arial';

    // Redraw all annotations
    annotations.forEach(annotation => {
      if (annotation.type === 'draw' && annotation.points) {
        context.beginPath();
        context.moveTo(annotation.points[0].x, annotation.points[0].y);
        annotation.points.forEach(point => {
          context.lineTo(point.x, point.y);
        });
        context.stroke();
      } else if (annotation.type === 'text' && annotation.text && annotation.position) {
        context.fillText(annotation.text, annotation.position.x, annotation.position.y);
      }
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'draw') return;
    
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e.clientX - rect!.left;
    const y = e.clientY - rect!.top;
    
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== 'draw') return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const rect = canvas?.getBoundingClientRect();
    
    if (!context || !rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPath(prev => [...prev, { x, y }]);

    // Draw the current stroke
    context.strokeStyle = '#FFEB3B';
    context.lineWidth = 2;
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing || mode !== 'draw') return;

    setIsDrawing(false);
    if (currentPath.length > 0) {
      setAnnotations(prev => [...prev, { type: 'draw', points: currentPath }]);
    }
    setCurrentPath([]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'text' || !text) return;

    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e.clientX - rect!.left;
    const y = e.clientY - rect!.top;

    const newAnnotation: Annotation = {
      type: 'text',
      text,
      position: { x, y }
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setText('');
    redrawAnnotations();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-4 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            <button
              className={`px-4 py-2 rounded ${mode === 'draw' ? 'bg-emerald-600' : 'bg-gray-700'}`}
              onClick={() => setMode('draw')}
            >
              Dibujar
            </button>
            <button
              className={`px-4 py-2 rounded ${mode === 'text' ? 'bg-emerald-600' : 'bg-gray-700'}`}
              onClick={() => setMode('text')}
            >
              Texto
            </button>
          </div>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-emerald-600 rounded"
              onClick={() => onSave(canvasRef.current!)}
            >
              Guardar
            </button>
            <button
              className="px-4 py-2 bg-gray-700 rounded"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>

        {mode === 'text' && (
          <div className="mb-4">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ingrese el texto y haga clic donde desea colocarlo"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded"
            />
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onClick={handleCanvasClick}
          className="w-full h-[600px] border border-gray-700 rounded cursor-crosshair bg-black"
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;