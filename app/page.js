"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import apiClient from "./utils/axiosInstance";
const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("api/login", {
    Username:email,
    Password:password,
  });
  return response.data;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithGoogle = async () => {
    window.location.href = "/api/auth/google";
  };
  
  const loginWithFacebook = async () => {
    window.location.href = "/api/auth/facebook";
  };

  const mutation = useMutation({
    mutationFn:loginUser,
    onSuccess: (data) => {
      console.log("data = ",data.data)
      if (data.token) {
        setCookie("token", data.token, { path: "/" });
        setCookie("userId", data.userid , { path: "/" })
        router.push("/dashboard")
      }
      // Handle successful login (e.g., redirect, show message)
    },
    onError: (error) => {
      console.error("Login error:", error?.response)
      // Handle login error (e.g., show error message)
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="relative z-50 min-h-screen flex items-center justify-center bg-transparent px-4  sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className={`text-red-600 text-xs p-1 ${mutation.isError ? "visible" : "hidden"} `}>*Wrong Email or password</p>
            <Button type="submit" className="w-full">
            {mutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full" />
            <span className="px-2 text-gray-500">Or</span>
            <hr className="w-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={loginWithGoogle}
            >
              <FaGoogle className="mr-2" />
              Login with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={loginWithFacebook}
            >
              <FaFacebook className="mr-2" />
              Login with Facebook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
