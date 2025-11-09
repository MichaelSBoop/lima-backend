import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface CreateGoalProps {
  onBack: () => void;
  onSave: (goal: {
    name: string;
    target: number;
    startDate: Date;
    endDate: Date;
    autoReplenishment: string;
  }) => void;
}

const autoReplenishmentOptions = [
  { value: "percent", label: "% от дохода" },
  { value: "fixed", label: "Фиксированная сумма" },
  { value: "none", label: "Без автопополнения" },
];

export default function CreateGoal({ onBack, onSave }: CreateGoalProps) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [autoReplenishment, setAutoReplenishment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && target && startDate && endDate && autoReplenishment) {
      onSave({
        name,
        target: parseFloat(target.replace(/\s/g, "").replace(",", ".")),
        startDate,
        endDate,
        autoReplenishment,
      });
    }
  };

  const formatAmount = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, "");
    // Add space separators for thousands
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setTarget(formatted);
  };

  const isFormValid = name && target && startDate && endDate && autoReplenishment;

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
        <h2 className="text-lg font-semibold">Создать цель</h2>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Создать цель</h1>
          <p className="text-muted-foreground">Заполни информацию о цели</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              type="text"
              placeholder="Отпуск в Сочи"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Цель</Label>
            <div className="relative">
              <Input
                id="target"
                type="text"
                placeholder="100 000"
                value={target}
                onChange={handleTargetChange}
                className="h-12 pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₽
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">Начало</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "dd.MM.yyyy")
                  ) : (
                    <span className="text-muted-foreground">Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Конец</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "dd.MM.yyyy")
                  ) : (
                    <span className="text-muted-foreground">Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auto-replenishment">Автопополнение</Label>
            <Select value={autoReplenishment} onValueChange={setAutoReplenishment}>
              <SelectTrigger id="auto-replenishment" className="h-12">
                <SelectValue placeholder="Выберите тип автопополнения" />
              </SelectTrigger>
              <SelectContent>
                {autoReplenishmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 rounded-xl font-semibold mt-6 ${
              isFormValid
                ? "bg-primary hover:bg-primary/90"
                : "bg-primary/50 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Создать
          </Button>
        </form>
      </div>
    </div>
  );
}
