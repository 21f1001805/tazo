import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../main"
import toast from "react-hot-toast"
import { useGoogleLogin } from "@react-oauth/google"
import {FcGoogle} from 'react-icons/fc'
import { useAppData } from "../context/AppContext"

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, setIsAuth } = useAppData();

  const responseGoogle = async (authResult: any) => {
    if (!authResult?.code) {
      toast.error("Google login failed. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(`${authService}/api/auth/login`, {
        code: authResult["code"],
      });

      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setLoading(false);
      setUser(result.data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Problem while login");
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google auth popup failed or was closed.");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: handleGoogleError,
    flow: "auth-code",
  });
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-card w-full max-w-md space-y-6 p-7">
        <div>
          <h1 className="text-center text-3xl font-extrabold tracking-tight text-[#E23744]">
            Tazo
          </h1>
          <p className="muted-text mt-2 text-center text-sm">
            Log in or sign up to continue
          </p>
        </div>

        <button
          onClick={googleLogin}
          disabled={loading}
          className="btn-soft flex w-full gap-3 py-3"
        >
          <FcGoogle size={20} />
          {loading ? "Signing in ..." : "Continue with Google"}
        </button>

        <p className="text-center text-xs text-slate-400">
          By continuing, you agree with our{" "}
          <span className="font-semibold text-[#E23744]">Terms of Service</span>{" "}
          &{" "}
          <span className="font-semibold text-[#E23744]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
