import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";

interface BankConnectionSuccessProps {
  onBack: () => void;
  onGoToDashboard: () => void;
}

export default function BankConnectionSuccess({ onBack, onGoToDashboard }: BankConnectionSuccessProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 300;

    const confetti: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ["#ef4444", "#f97316", "#eab308"]; // red, orange, yellow

    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    const animate = () => {
      if (!isAnimatingRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((piece) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.rotationSpeed;
        piece.vy += 0.1; // gravity

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();

        // Reset if off screen
        if (piece.y > canvas.height + 20) {
          piece.y = -20;
          piece.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Stop animation after 3.5 seconds
    const timeoutId = setTimeout(() => {
      isAnimatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clear the canvas after animation stops
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
      isAnimatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Подключаем банк</h2>
      </div>

      <div className="relative overflow-hidden h-[300px]">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Банк успешно подключён</h2>
          <div className="flex items-start gap-2 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              На главном экране уже есть первые данные. Скорее взгляните на него
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto w-full">
        <Button
          onClick={onGoToDashboard}
          className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90"
          data-testid="button-go-to-dashboard"
        >
          Перейти на главный экран
        </Button>
      </div>
    </div>
  );
}
