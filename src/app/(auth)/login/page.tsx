import AuthCard from "@/features/auth/components/AuthCard";
import AuthGate from "@/features/auth/components/AuthGate";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthGate mode="guest">
      <AuthCard title="Welcome back" subtitle="Sign in to SupportDesk Agent">
        <LoginForm />
      </AuthCard>
    </AuthGate>
  );
}