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

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Check URL parameters for pre-filled email and mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const modeParam = urlParams.get('mode');
    
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    if (modeParam === 'login') {
      setIsLogin(true);
    } else if (modeParam === 'signup') {
      setIsLogin(false);
    }
  }, []);

  const checkUserExists = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy_password' // This will fail but tell us if user exists
      });
      return false; // If no error, user doesn't exist (shouldn't happen with dummy password)
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        return true; // User exists but wrong password
      }
      return false; // User doesn't exist
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
        
        // Store credentials securely for persistence
        if (data.session) {
          localStorage.setItem('supabase-session', JSON.stringify(data.session));
          localStorage.setItem('supabase-user', JSON.stringify(data.user));
        }
        
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
        
        // Use navigate instead of window.location for better UX
        setTimeout(() => {
          window.location.href = "/app";
        }, 1000);
      } else {
        // Check if user already exists before signup
        const userExists = await checkUserExists(email);
        
        if (userExists) {
          toast({
            title: "User already exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive",
          });
          setIsLogin(true); // Switch to login mode
          return;
        }
        
        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "User already exists",
              description: "An account with this email already exists. Please login instead.",
              variant: "destructive",
            });
            setIsLogin(true); // Switch to login mode
            return;
          }
          throw error;
        }
        
        if (data.user && !data.session) {
          toast({
            title: "Check your email!",
            description: "We've sent you a confirmation link to complete your registration.",
          });
        } else if (data.session) {
          // Auto-login after signup
          localStorage.setItem('supabase-session', JSON.stringify(data.session));
          localStorage.setItem('supabase-user', JSON.stringify(data.user));
          
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
      
      // Handle specific auth errors
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
        setIsLogin(true); // Switch to login mode
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'Password must be at least 6 characters long.';
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleAuth} disabled={loading} className="w-full">
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
