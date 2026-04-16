import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useSignUp, useAuth } from "@clerk/clerk-react";
import { Logo } from "@/components/ui/logo";

function getPasswordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score += 25;
  if (/[A-Z]/.test(pw)) score += 25;
  if (/[0-9]/.test(pw)) score += 25;
  if (/[^A-Za-z0-9]/.test(pw)) score += 25;
  const label = score <= 25 ? "Weak" : score <= 50 ? "Fair" : score <= 75 ? "Good" : "Strong";
  return { score, label };
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
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

  const pwStrength = getPasswordStrength(password);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Weak password", description: "Use at least 8 characters", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Terms required", description: "Please agree to the terms", variant: "destructive" });
      return;
    }
    if (!signUpLoaded) return;

    setLoading(true);
    try {
      // Create the user with Clerk
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" ") || undefined,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      toast({ title: "Almost there!", description: "Check your email for a verification code." });
      navigate("/verify-email");
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Registration failed. Please try again.";
      toast({ title: "Registration failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!signUpLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || "Google sign-up failed.";
      toast({ title: "Google Sign-Up Failed", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <Logo className="justify-center" />

        {/* Progress steps */}
        <div className="flex items-center gap-3 justify-center">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-hierarchy-4"}`}>
                {step > s ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              <span className={`text-xs hidden sm:block ${step >= s ? "text-hierarchy-2" : "text-hierarchy-4"}`}>
                {s === 1 ? "Account" : "Organization"}
              </span>
              {s === 1 && <div className={`w-12 h-0.5 ${step > 1 ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
            {step === 1 ? <>Create your <em className="font-serif">account</em></> : <>Setup your <em className="font-serif">organization</em></>}
          </h1>
          <p className="text-sm text-hierarchy-4 mt-2">
            {step === 1 ? "Start with your personal details" : "Tell us about your company"}
          </p>
        </div>

        {step === 1 ? (
          <>
            <form onSubmit={handleStep1} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hierarchy-4" />
                  <Input
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 bg-secondary border-border text-hierarchy-1 pl-10 placeholder:text-hierarchy-4"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Work Email</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-secondary border-border text-hierarchy-1 placeholder:text-hierarchy-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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
                {password && (
                  <div className="space-y-1.5">
                    <Progress value={pwStrength.score} className={`h-1.5 bg-secondary ${pwStrength.score <= 25 ? "[&>div]:bg-destructive" : pwStrength.score <= 50 ? "[&>div]:bg-warning" : "[&>div]:bg-primary"}`} />
                    <p className={`text-[10px] ${pwStrength.score <= 25 ? "text-destructive" : pwStrength.score <= 50 ? "text-warning" : "text-primary"}`}>{pwStrength.label}</p>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full h-11 gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-hierarchy-4">or sign up with</span></div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={!signUpLoaded}
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
          </>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hierarchy-4" />
                <Input
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-11 bg-secondary border-border text-hierarchy-1 pl-10 placeholder:text-hierarchy-4"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Company Size</label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className="h-11 bg-secondary border-border text-hierarchy-2"><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                  <SelectItem value="1000+">1,000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="h-11 bg-secondary border-border text-hierarchy-2"><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance & Banking</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail & E-commerce</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className={`h-4 w-4 rounded border transition-colors flex items-center justify-center mt-0.5 shrink-0 ${agreed ? "bg-primary border-primary" : "border-border"}`}
              >
                {agreed && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
              </button>
              <span className="text-xs text-hierarchy-4 leading-relaxed">
                I agree to the <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
              </span>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">
                Back
              </Button>
              <Button type="submit" disabled={loading || !signUpLoaded} className="flex-1 h-11 gap-2">
                {loading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-hierarchy-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
