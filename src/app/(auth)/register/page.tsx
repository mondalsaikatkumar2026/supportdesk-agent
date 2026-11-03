import AuthGate from "@/features/auth/components/AuthGate";
import AuthShell from "@/features/auth/components/AuthShell";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthGate mode="guest">
      <AuthShell
        title="Create your account"
        subtitle="Start triaging tickets with AI"
        image="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Team working together in a modern office"
        heading="Start triaging smarter today"
        text="Create your free account and let AI sort, prioritize and route every customer ticket."
      >
        <RegisterForm />
      </AuthShell>
    </AuthGate>
  );
}