import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { Zap } from "lucide-react";

export default function SsoCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    handleRedirectCallback({
      afterSignInUrl: "/",
      afterSignUpUrl: "/",
    }).catch(() => {
      navigate("/login");
    });
  }, [handleRedirectCallback, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-hierarchy-1 font-medium font-display">Signing you in...</p>
          <p className="text-sm text-hierarchy-4">Please wait while we complete authentication.</p>
        </div>
        <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  );
}
