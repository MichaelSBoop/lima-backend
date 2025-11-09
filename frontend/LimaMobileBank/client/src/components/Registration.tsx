import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface RegistrationProps {
  onBack: () => void;
  onNext: (email: string) => void;
}

export default function Registration({ onBack, onNext }: RegistrationProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onNext(email);
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
        <h2 className="text-lg font-semibold">Зарегистрируйтесь</h2>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Зарегистрируйтесь</h1>
          <p className="text-muted-foreground">Получите все преимущества Lima</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 mt-6"
            disabled={!email || !password}
          >
            Регистрация
          </Button>
        </form>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            onClick={() => {/* Yandex login */}}
          >
            <span className="text-sm">Yandex</span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            onClick={() => {/* VK ID login */}}
          >
            <span className="text-sm">VK ID</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
