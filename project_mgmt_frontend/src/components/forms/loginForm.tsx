"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { LoginFormInputs } from "@/types";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await loginUser(data.email, data.password);
       localStorage.setItem("token", response.token);
       const { name, email } = response.user;
       localStorage.setItem("user", JSON.stringify({ name, email }));
       toast.info('Redirecting...' ,{autoClose:1000})
       router.push("/dashboard");
       toast.success(`Welcome back ${name}`, {autoClose:1000})
    } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    } else {
      setErrorMessage("Something went wrong");
    }
  }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

        
          {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}

         
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          >
            Login
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Not a user?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Register here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
