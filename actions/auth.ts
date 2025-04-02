"use server";

import { signIn } from "@/auth";

export const login = async (formData: FormData) => {
  const username = formData.get("username");
  const password = formData.get("password");

  await signIn("credentials", {
    username: username as string,
    password: password as string,
    redirect: false,
  });
};
