"use client";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/forms/loginForm";

export default function LoginPage() {
  useAuth(false);

  return <LoginForm />;
}
