import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSignUp, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Logo } from "@/components/ui/logo";

export default function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  // Wait for Clerk to finish initializing
  if (!authLoaded || !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Already signed in — send to dashboard
  if (isSignedIn) return <Navigate to="/" replace />;

  // No sign up in progress — send back to register
  if (!signUp) return <Navigate to="/register" replace />;

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);
    // Focus the last filled input
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the full 6-digit code.", variant: "destructive" });
      return;
    }
    if (!isLoaded || !signUp) return;

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: fullCode });
      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        setVerified(true);
        toast({ title: "Email verified!", description: "Welcome to SynteraTek. Redirecting to dashboard..." });
        setTimeout(() => navigate("/"), 1200);
      } else {
        toast({ title: "Verification incomplete", description: "Please try again or request a new code.", variant: "destructive" });
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Invalid code. Please try again.";
      toast({ title: "Verification failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signUp) return;
    setResending(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast({ title: "Code resent!", description: "Check your inbox for a new verification code." });
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || "Failed to resend code.";
      toast({ title: "Resend failed", description: msg, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const email = signUp?.emailAddress || "";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, hsl(153,55%,12%) 0%, hsl(0,0%,5%) 100%)" }}
      >
        <div>
          <Logo className="mb-16" />
          <h2 className="text-4xl font-medium text-hierarchy-1 font-display leading-tight mb-6">
            One step <em className="font-serif">closer</em><br />to the platform
          </h2>
          <p className="text-hierarchy-3 text-lg max-w-md leading-relaxed">
            Verify your email to unlock full access to the SynteraTek integration platform.
          </p>
        </div>

        <div className="space-y-4">
          {[
            "Enterprise-grade security and encryption",
            "Verified accounts get priority support",
            "Unlock all integrations immediately after verification"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-hierarchy-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-primary/10" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-primary/5" />
        <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
        <div className="absolute top-40 right-40 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <Logo className="lg:hidden justify-center mb-8" />

          {verified ? (
            /* Success state */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-medium text-hierarchy-1 font-display mb-2">
                  Email <em className="font-serif">verified!</em>
                </h1>
                <p className="text-sm text-hierarchy-4">
                  Redirecting you to the dashboard...
                </p>
              </div>
              <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            /* Verification form */
            <>
              {/* Mail icon */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-medium text-hierarchy-1 font-display">
                  Verify your <em className="font-serif">email</em>
                </h1>
                <p className="text-sm text-hierarchy-4 mt-2 leading-relaxed">
                  We sent a 6-digit code to{" "}
                  {email && (
                    <span className="text-hierarchy-2 font-medium">{email}</span>
                  )}
                  {!email && "your email address"}. Enter it below to verify your account.
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-4">
                <label className="text-xs text-hierarchy-3 font-medium uppercase tracking-wider">
                  Verification Code
                </label>
                <div className="flex gap-3 justify-center lg:justify-start" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`
                        h-14 w-12 text-center text-xl font-medium rounded-lg border transition-all duration-200
                        bg-secondary text-hierarchy-1 outline-none
                        ${digit
                          ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                          : "border-border hover:border-primary/40 focus:border-primary focus:shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleVerify}
                disabled={loading || !isLoaded || code.join("").length !== 6}
                className="w-full h-11 gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>Verify Email <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>

              {/* Resend code */}
              <div className="text-center space-y-2">
                <p className="text-sm text-hierarchy-4">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-primary hover:underline font-medium flex items-center gap-1.5 mx-auto transition-opacity disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
                  {resending ? "Sending..." : "Resend verification code"}
                </button>
              </div>

              {/* Help note */}
              <div className="glass-card p-4 rounded-lg space-y-1">
                <p className="text-xs text-hierarchy-4 text-center leading-relaxed">
                  Check your spam folder if you don't see the email.
                  The code expires in <span className="text-hierarchy-3">10 minutes</span>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
