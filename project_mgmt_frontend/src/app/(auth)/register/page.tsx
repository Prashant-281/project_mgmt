"use client";
import { useAuth } from "@/hooks/useAuth";
import RegisterForm from "@/components/forms/registerForm";

export default function RegisterPage() {
  useAuth(false);

  return <RegisterForm />;
}
