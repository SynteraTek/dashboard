import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  // Wait for Clerk to finish initializing
  if (!authLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Already signed in — send to dashboard
  if (isSignedIn) return <Navigate to="/" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (!signInLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        toast({ title: "Welcome back!", description: "Redirecting to dashboard..." });
        navigate("/");
      } else if (result.status === "needs_first_factor") {
        navigate("/verify-email");
      } else {
        toast({ title: "Additional step required", description: "Please complete verification.", variant: "destructive" });
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Invalid credentials. Please try again.";
      toast({ title: "Sign in failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!signInLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || "Google sign-in failed.";
      toast({ title: "Google Sign-In Failed", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, hsl(153,55%,12%) 0%, hsl(0,0%,5%) 100%)" }}>
        <div>
          <Logo className="mb-16" />
          <h2 className="text-4xl font-medium text-hierarchy-1 font-display leading-tight mb-6">
            Unified <em className="font-serif">Integration</em><br />Intelligence
          </h2>
          <p className="text-hierarchy-3 text-lg max-w-md leading-relaxed">
            Connect, synchronize, and automate your entire business ecosystem from a single command center.
          </p>
        </div>
        <div className="space-y-4">
          {["24 Active integrations across CRM, ERP & Finance", "99.97% platform uptime with real-time monitoring", "1,847 data syncs processed today"].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-hierarchy-3 text-sm">
              <CheckCircle className="h-4 w-4 text-primary shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-primary/10" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-primary/5" />
        <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-primary/40 animate-pulse-glow" />
        <div className="absolute top-40 right-40 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse-glow" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <Logo className="lg:hidden justify-center mb-8" />

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-medium text-hierarchy-1 font-display">Welcome <em className="font-serif">back</em></h1>
            <p className="text-sm text-hierarchy-4 mt-2">Sign in to your integration platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Email</label>
              <Input
                type="email"
                placeholder="admin@synteratek.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-secondary border-border text-hierarchy-1 placeholder:text-hierarchy-4"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-secondary border-border text-hierarchy-1 pr-10 placeholder:text-hierarchy-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hierarchy-4 hover:text-hierarchy-2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`h-4 w-4 rounded border transition-colors flex items-center justify-center ${rememberMe ? "bg-primary border-primary" : "border-border"}`}
              >
                {rememberMe && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
              </button>
              <span className="text-xs text-hierarchy-4">Remember me for 30 days</span>
            </div>

            <Button type="submit" disabled={loading || !signInLoaded} className="w-full h-11 gap-2">
              {loading ? (
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-hierarchy-4">or continue with</span></div>
          </div>

          {/* Google Sign-In */}
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading || !signInLoaded}
            className="w-full h-11 border-border text-hierarchy-2 hover:bg-secondary gap-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-hierarchy-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
