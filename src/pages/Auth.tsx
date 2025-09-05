import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check URL parameters for pre-filled email and mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    const modeParam = urlParams.get("mode");

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    if (modeParam === "login") {
      setIsLogin(true);
    } else if (modeParam === "signup") {
      setIsLogin(false);
    }
  }, []);

  // Listen for auth state changes to handle Google OAuth redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          toast({
            title: "Welcome!",
            description: "You've been logged in successfully.",
          });
          
          // Redirect to app after successful authentication
          setTimeout(() => {
            navigate("/app");
          }, 1000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const checkUserExists = async (email: string) => {
    try {
      await supabase.auth.signInWithPassword({
        email,
        password: "dummy_password",
      });
      return false;
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        return true;
      }
      return false;
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          localStorage.setItem("supabase-session", JSON.stringify(data.session));
          localStorage.setItem("supabase-user", JSON.stringify(data.user));
        }

        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });

        setTimeout(() => {
          window.location.href = "/app";
        }, 1000);
      } else {
        const userExists = await checkUserExists(email);

        if (userExists) {
          toast({
            title: "User already exists",
            description:
              "An account with this email already exists. Please login instead.",
            variant: "destructive",
          });
          setIsLogin(true);
          return;
        }

        const redirectUrl = `${window.location.origin}/app`;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              title: "User already exists",
              description:
                "An account with this email already exists. Please login instead.",
              variant: "destructive",
            });
            setIsLogin(true);
            return;
          }
          throw error;
        }

        if (data.user && !data.session) {
          toast({
            title: "Check your email!",
            description:
              "We've sent you a confirmation link to complete your registration.",
          });
        } else if (data.session) {
          localStorage.setItem("supabase-session", JSON.stringify(data.session));
          localStorage.setItem("supabase-user", JSON.stringify(data.user));

          toast({
            title: "Account created!",
            description: "Welcome to GlamFlow!",
          });

          setTimeout(() => {
            window.location.href = "/app";
          }, 1000);
        }
      }
    } catch (error: any) {
      let errorMessage = error.message;

      if (error.message.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.message.includes("User already registered")) {
        errorMessage =
          "An account with this email already exists. Please sign in instead.";
        setIsLogin(true);
      } else if (error.message.includes("Password should be")) {
        errorMessage = "Password must be at least 6 characters long.";
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth → redirect to /app
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  
    if (error) {
      toast({
        title: "Google Login Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            Enter your email below to {isLogin ? "login to" : "create"} your
            account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Normal Auth Button */}
            <Button onClick={handleAuth} disabled={loading} className="w-full">
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleGoogleAuth} 
              disabled={googleLoading}
              className="w-full"
            >
              {googleLoading ? "Loading..." : "Continue with Google"}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Button>

            {/* Google Auth Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
