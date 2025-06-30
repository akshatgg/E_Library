import { LoginForm } from "@/components/auth/login-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "E-Library - Login",
  description: "Log in to access your E-Library account",
}

export default async function LoginPage() {
  const session = await getSession()

  // Redirect if already logged in
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
