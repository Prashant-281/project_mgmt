"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (requireAuth && !token) {
      router.push("/login");
    }

    if (!requireAuth && token) {
      router.push("/dashboard");
    }
  }, [requireAuth, router]);
}
