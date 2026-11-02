import AuthCard from "@/features/auth/components/AuthCard";
import AuthGate from "@/features/auth/components/AuthGate";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthGate mode="guest">
      <AuthCard title="Create your account" subtitle="Start triaging tickets with AI">
        <RegisterForm />
      </AuthCard>
    </AuthGate>
  );
}