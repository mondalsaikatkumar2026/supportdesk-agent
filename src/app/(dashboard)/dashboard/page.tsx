import AuthGate from "@/features/auth/components/AuthGate";
import DashboardView from "@/features/tickets/components/DashboardView";

export default function DashboardPage() {
  return (
    <AuthGate mode="protected">
      <DashboardView />
    </AuthGate>
  );
}