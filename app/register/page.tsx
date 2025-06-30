import { RegisterForm } from "@/components/auth/register-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "E-Library - Register",
  description: "Create a new account for E-Library",
}

export default async function RegisterPage() {
  const session = await getSession()

  // Redirect if already logged in
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}
