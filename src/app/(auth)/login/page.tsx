import AuthGate from "@/features/auth/components/AuthGate";
import AuthShell from "@/features/auth/components/AuthShell";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthGate mode="guest">
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to SupportDesk Agent"
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Support team collaborating around a table"
        heading="Resolve tickets faster with AI triage"
        text="Pick up right where you left off. Your queue, your insights, all in one place."
      >
        <LoginForm />
      </AuthShell>
    </AuthGate>
  );
}