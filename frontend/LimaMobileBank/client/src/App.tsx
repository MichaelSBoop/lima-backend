import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingStories from "@/components/OnboardingStories";
import Registration from "@/components/Registration";
import SMSVerification from "@/components/SMSVerification";
import RegistrationSuccess from "@/components/RegistrationSuccess";
import FinancialGoalsSelection from "@/components/FinancialGoalsSelection";
import BankSelection from "@/components/BankSelection";
import BankPermissions from "@/components/BankPermissions";
import BankConnecting from "@/components/BankConnecting";
import BankConnectionSuccess from "@/components/BankConnectionSuccess";
import BankConnectionError from "@/components/BankConnectionError";
import Dashboard from "@/components/Dashboard";
import Transactions from "@/components/Transactions";
import SetBudget from "@/components/SetBudget";
import CreateGoal from "@/components/CreateGoal";

type Screen = "welcome" | "onboarding-stories" | "registration" | "sms-verification" | "registration-success" | "goals" | "banks" | "bank-permissions" | "bank-connecting" | "bank-success" | "bank-error" | "dashboard" | "transactions" | "set-budget" | "create-goal";

interface Budget {
  id: string;
  category: string;
  startDate: Date;
  endDate: Date;
  amount: number;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  startDate: Date;
  endDate: Date;
  autoReplenishment: string;
}

interface Bank {
  id: string;
  name: string;
  color: string;
}

const banks: Bank[] = [
  { id: "ozon", name: "Озон банк", color: "bg-blue-600" },
  { id: "tbank", name: "Т-Банк", color: "bg-yellow-500" },
  { id: "vtb", name: "ВТБ", color: "bg-blue-700" },
  { id: "alfa", name: "Альфа-Банк", color: "bg-red-600" },
  { id: "sber", name: "Сбер", color: "bg-green-600" },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [email, setEmail] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [cameFromDashboard, setCameFromDashboard] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const selectedBank = banks.find(b => b.id === selectedBankId);

  const handleWelcomeNext = () => {
    setCurrentScreen("onboarding-stories");
  };

  const handleOnboardingStoriesNext = () => {
    setCurrentScreen("registration");
  };

  const handleRegistrationBack = () => {
    setCurrentScreen("onboarding-stories");
  };

  const handleRegistrationNext = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentScreen("sms-verification");
  };

  const handleSMSVerificationBack = () => {
    setCurrentScreen("registration");
  };

  const handleSMSVerificationComplete = () => {
    setCurrentScreen("registration-success");
  };

  const handleRegistrationSuccessBack = () => {
    setCurrentScreen("registration");
  };

  const handleRegistrationSuccessContinue = () => {
    setCurrentScreen("goals");
  };

  const handleGoalsBack = () => {
    setCurrentScreen("registration-success");
  };

  const handleGoalsNext = (goals: string[]) => {
    setSelectedGoals(goals);
    setCurrentScreen("banks");
  };

  const handleBanksBack = () => {
    // Reset bank selection state when going back
    setSelectedBankId("");
    setIsConnecting(false);
    if (cameFromDashboard) {
      setCameFromDashboard(false);
      setCurrentScreen("dashboard");
    } else {
      setCurrentScreen("goals");
    }
  };

  const handleDashboardAddBank = () => {
    // Reset state before navigating to bank selection
    setSelectedBankId("");
    setIsConnecting(false);
    setCameFromDashboard(true);
    setCurrentScreen("banks");
  };

  const handleBankSelected = (bankId: string) => {
    setSelectedBankId(bankId);
    setCurrentScreen("bank-permissions");
  };

  const handlePermissionsBack = () => {
    setCurrentScreen("banks");
  };

  const handlePermissionsConnect = () => {
    setIsConnecting(true);
    setCurrentScreen("bank-connecting");
  };

  const handleConnectingComplete = () => {
    setIsConnecting(false);
    setCurrentScreen("bank-success");
  };

  const handleConnectingError = () => {
    setIsConnecting(false);
    setCurrentScreen("bank-error");
  };

  const handleSuccessBack = () => {
    // Reset state and go back to banks
    setSelectedBankId("");
    setCurrentScreen("banks");
  };

  const handleSuccessGoToDashboard = () => {
    // Reset all bank connection state
    setSelectedBankId("");
    setIsConnecting(false);
    setCameFromDashboard(false);
    setCurrentScreen("dashboard");
  };

  const handleErrorBack = () => {
    // Reset state and go back to banks
    setSelectedBankId("");
    setIsConnecting(false);
    setCurrentScreen("banks");
  };

  const handleErrorRetry = () => {
    setIsConnecting(true);
    setCurrentScreen("bank-connecting");
  };

  const handleDashboardViewTransactions = () => {
    setCurrentScreen("transactions");
  };

  const handleTransactionsBack = () => {
    setCurrentScreen("dashboard");
  };

  const handleDashboardSetBudget = () => {
    setCurrentScreen("set-budget");
  };

  const handleSetBudgetBack = () => {
    setCurrentScreen("dashboard");
  };

  const handleSetBudgetSave = (budgetData: {
    category: string;
    startDate: Date;
    endDate: Date;
    amount: number;
  }) => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      ...budgetData,
    };
    setBudgets(prev => [...prev, newBudget]);
    setCurrentScreen("dashboard");
  };

  const handleDashboardCreateGoal = () => {
    setCurrentScreen("create-goal");
  };

  const handleCreateGoalBack = () => {
    setCurrentScreen("dashboard");
  };

  const handleCreateGoalSave = (goalData: {
    name: string;
    target: number;
    startDate: Date;
    endDate: Date;
    autoReplenishment: string;
  }) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      ...goalData,
      current: 0, // Start with 0 progress
    };
    setGoals(prev => [...prev, newGoal]);
    setCurrentScreen("dashboard");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {currentScreen === "welcome" && (
            <WelcomeScreen onNext={handleWelcomeNext} />
          )}
          {currentScreen === "onboarding-stories" && (
            <OnboardingStories onNext={handleOnboardingStoriesNext} />
          )}
          {currentScreen === "registration" && (
            <Registration
              onBack={handleRegistrationBack}
              onNext={handleRegistrationNext}
            />
          )}
          {currentScreen === "sms-verification" && (
            <SMSVerification
              email={email}
              onBack={handleSMSVerificationBack}
              onVerify={handleSMSVerificationComplete}
            />
          )}
          {currentScreen === "registration-success" && (
            <RegistrationSuccess
              onBack={handleRegistrationSuccessBack}
              onContinue={handleRegistrationSuccessContinue}
            />
          )}
          {currentScreen === "goals" && (
            <FinancialGoalsSelection 
              onBack={handleGoalsBack}
              onNext={handleGoalsNext}
            />
          )}
          {currentScreen === "banks" && (
            <BankSelection 
              onBack={handleBanksBack}
              onNext={handleBankSelected}
            />
          )}
          {currentScreen === "bank-permissions" && selectedBank && (
            <BankPermissions
              bank={selectedBank}
              onBack={handlePermissionsBack}
              onConnect={handlePermissionsConnect}
              isConnecting={isConnecting}
            />
          )}
          {currentScreen === "bank-connecting" && (
            <BankConnecting
              onComplete={handleConnectingComplete}
              onError={handleConnectingError}
            />
          )}
          {currentScreen === "bank-success" && (
            <BankConnectionSuccess
              onBack={handleSuccessBack}
              onGoToDashboard={handleSuccessGoToDashboard}
            />
          )}
          {currentScreen === "bank-error" && (
            <BankConnectionError
              onBack={handleErrorBack}
              onRetry={handleErrorRetry}
            />
          )}
          {currentScreen === "dashboard" && (
            <Dashboard 
              onAddBank={handleDashboardAddBank}
              onViewTransactions={handleDashboardViewTransactions}
              onSetBudget={handleDashboardSetBudget}
              onCreateGoal={handleDashboardCreateGoal}
              budgets={budgets}
              goals={goals}
            />
          )}
          {currentScreen === "transactions" && (
            <Transactions onBack={handleTransactionsBack} />
          )}
          {currentScreen === "set-budget" && (
            <SetBudget
              onBack={handleSetBudgetBack}
              onSave={handleSetBudgetSave}
            />
          )}
          {currentScreen === "create-goal" && (
            <CreateGoal
              onBack={handleCreateGoalBack}
              onSave={handleCreateGoalSave}
            />
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
