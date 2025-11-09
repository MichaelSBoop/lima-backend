import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Check } from "lucide-react";

interface SMSVerificationProps {
  email: string;
  onBack: () => void;
  onVerify: () => void;
}

export default function SMSVerification({ email, onBack, onVerify }: SMSVerificationProps) {
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const autoFillTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-fill code after 3 seconds
  useEffect(() => {
    autoFillTimeoutRef.current = setTimeout(() => {
      const fakeCode = "3824";
      setCode(fakeCode);
      // Auto-verify after setting the code
      setTimeout(() => {
        setIsVerified(true);
        // Call onVerify after showing success state briefly
        setTimeout(() => {
          onVerify();
        }, 500);
      }, 300);
    }, 3000);

    return () => {
      if (autoFillTimeoutRef.current) {
        clearTimeout(autoFillTimeoutRef.current);
      }
    };
  }, [onVerify]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (value.length === 4 && !isVerified) {
      setIsVerified(true);
      setTimeout(() => {
        onVerify();
      }, 500);
    }
  };

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
        <h2 className="text-lg font-semibold">Регистрация</h2>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Регистрация</h1>
          <p className="text-muted-foreground mb-1">Введите код</p>
          <p className="text-sm text-muted-foreground">
            Мы отправили его на вашу почту
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <InputOTP
            maxLength={4}
            value={code}
            onChange={handleCodeChange}
            disabled={isVerified}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          onClick={() => {
            if (code.length === 4) {
              setIsVerified(true);
              setTimeout(() => {
                onVerify();
              }, 500);
            }
          }}
          disabled={code.length !== 4 || isVerified}
          className={`w-full h-12 rounded-xl font-semibold ${
            isVerified
              ? "bg-green-600 hover:bg-green-600"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isVerified ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Подтверждено
            </>
          ) : (
            "Подтвердить"
          )}
        </Button>
      </div>
    </div>
  );
}
