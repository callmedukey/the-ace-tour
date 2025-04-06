"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="min-h-[min(50rem,80vh)] flex items-center justify-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await signIn("credentials", {
            username,
            password,
            redirect: true,
            redirectTo: "/en/admin",
          }).catch((error) => {
            setError(error.message);
          });
        }}
        className="flex flex-col gap-4 lg:gap-8 rounded-xl p-4 border-2 min-w-[30rem] lg:p-12"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <Label>
          Username
          <Input
            type="text"
            name="username"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Label>
        <Label>
          Password
          <Input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Label>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
