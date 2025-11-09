import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Wallet, Phone, CreditCard, TrendingUp, Check, type LucideIcon } from "lucide-react";

interface OnboardingStoriesProps {
  onNext: () => void;
}

interface Story {
  icon: LucideIcon;
  iconSecondary?: LucideIcon;
  text: string;
  checkmark: boolean;
}

const stories: Story[] = [
  {
    icon: Wallet,
    text: "Наведи порядок в финансах",
    checkmark: true,
  },
  {
    icon: Phone,
    iconSecondary: CreditCard,
    text: "Подключи банк и следи за деньгами",
    checkmark: false,
  },
  {
    icon: TrendingUp,
    text: "Достигай целей",
    checkmark: false,
  },
];

export default function OnboardingStories({ onNext }: OnboardingStoriesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Indicator */}
      <div className="p-6 pb-4">
        <div className="flex gap-2 justify-center">
          {stories.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all ${
                index <= current ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="flex-1 flex items-center">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {stories.map((story, index) => {
              const Icon = story.icon;
              const IconSecondary = story.iconSecondary;
              return (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                    <div className="mb-8 flex items-center justify-center">
                      <div className="relative">
                        <div className="p-8 rounded-full bg-primary/10">
                          <Icon className="h-16 w-16 text-primary" />
                          {IconSecondary && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <IconSecondary className="h-8 w-8 text-primary" />
                            </div>
                          )}
                        </div>
                        {story.checkmark && (
                          <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary">
                            <Check className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-center max-w-sm">
                      {story.text}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Bottom indicator and button */}
      <div className="p-6 pb-8">
        <div className="mb-4 h-1 bg-muted rounded-full max-w-md mx-auto" />
        {current === stories.length - 1 ? (
          <Button
            onClick={onNext}
            className="w-full max-w-md mx-auto h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90"
          >
            Продолжить
          </Button>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Смахните для продолжения
          </div>
        )}
      </div>
    </div>
  );
}
