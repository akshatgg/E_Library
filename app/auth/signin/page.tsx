"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"

// Zod Schemas
const SignInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const SignUpSchema = SignInSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
})

type SignInForm = z.infer<typeof SignInSchema>
type SignUpForm = z.infer<typeof SignUpSchema>

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState("signin")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const {
    register: signInRegister,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors, isSubmitting: isSigningIn },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
  })

  const {
    register: signUpRegister,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors, isSubmitting: isSigningUp },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
  })

  const { signIn, signUp, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleEmailSignIn = async (data: SignInForm) => {
    setError("")
    try {
      await signIn(data.email, data.password)
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEmailSignUp = async (data: SignUpForm) => {
    setError("")
    try {
      await signUp(data.email, data.password, data.displayName)
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                E-Library
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">by iTax Easy</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Access your legal research platform</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-white/20 dark:border-gray-700/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Sign In to Continue</CardTitle>
            <CardDescription className="text-center">Access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In */}
              <TabsContent value="signin">
                <form onSubmit={handleSignInSubmit(handleEmailSignIn)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...signInRegister("email")}
                      />
                    </div>
                    {signInErrors.email && <p className="text-red-500 text-sm">{signInErrors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        {...signInRegister("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signInErrors.password && <p className="text-red-500 text-sm">{signInErrors.password.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSigningIn}>
                    {isSigningIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUpSubmit(handleEmailSignUp)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      {...signUpRegister("displayName")}
                    />
                    {signUpErrors.displayName && (
                      <p className="text-red-500 text-sm">{signUpErrors.displayName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...signUpRegister("email")}
                      />
                    </div>
                    {signUpErrors.email && <p className="text-red-500 text-sm">{signUpErrors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        {...signUpRegister("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpErrors.password && <p className="text-red-500 text-sm">{signUpErrors.password.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 iTax Easy Private Limited. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
