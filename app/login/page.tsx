"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Shield, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showMfaInput, setShowMfaInput] = useState(false)
  const { signIn, verifyMfa } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      if (showMfaInput) {
        // Handle MFA verification
        const { error } = await verifyMfa(mfaCode)

        if (error) {
          setErrorMessage(error.message)
          toast({
            title: "MFA Verification Error",
            description: error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Authentication Successful",
            description: "Welcome to your Digital Twin Dashboard",
          })
          router.push("/dashboard/digital-twin-selector")
        }
      } else {
        // Handle initial login
        const { error, requiresMfa } = await signIn(email, password)

        if (error) {
          setErrorMessage(error.message)
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          })
        } else if (requiresMfa) {
          setShowMfaInput(true)
          toast({
            title: "MFA Required",
            description: "Please enter the verification code from your authenticator app",
          })
        } else {
          toast({
            title: "Authentication Successful",
            description: "Welcome to your Digital Twin Dashboard",
          })
          router.push("/dashboard/digital-twin-selector")
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      setErrorMessage(message)
      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            {showMfaInput ? <Shield className="h-12 w-12 text-primary" /> : <User className="h-12 w-12 text-primary" />}
          </div>
          <CardTitle className="text-2xl text-center">
            {showMfaInput ? "Two-Factor Authentication" : "Digital Twin Access"}
          </CardTitle>
          <CardDescription className="text-center">
            {showMfaInput
              ? "Enter the verification code from your authenticator app"
              : "Securely access your personalized digital twin"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {showMfaInput ? (
              <div className="space-y-2">
                <Label htmlFor="mfaCode">Verification Code</Label>
                <Input
                  id="mfaCode"
                  placeholder="Enter 6-digit code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Open your authenticator app to view your verification code
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : showMfaInput ? "Verify & Continue" : "Sign In to Digital Twin"}
            </Button>
            {showMfaInput && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowMfaInput(false)}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
