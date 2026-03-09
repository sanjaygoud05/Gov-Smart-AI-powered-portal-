
import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ChevronLeft, Eye, EyeOff, UserCircle, CheckCircle2, Send, KeyRound } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  AuthError
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the intended page or default to home
  const from = location.state?.from?.pathname || "/";

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isForgotPassword) {
      handleForgotPassword();
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Firebase Login
        try {
          const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const user = userCredential.user;
          
          if (!user.emailVerified) {
            await sendEmailVerification(user);
            setVerificationEmail(user.email);
            await signOut(auth);
            setLoading(false);
            return;
          }

          const userData = {
            email: user.email,
            username: user.displayName || user.email?.split('@')[0],
            id: user.uid
          };
          
          localStorage.setItem('gov_smart_user', JSON.stringify(userData));
          window.dispatchEvent(new Event('storage'));
          
          // SUCCESS: Redirect back to the intended protected page
          navigate(from, { replace: true });
        } catch (err: any) {
          const authError = err as AuthError;
          if (authError.code === 'auth/invalid-credential' || authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
            setError("Password or Email Incorrect");
          } else if (authError.code === 'auth/too-many-requests') {
            setError("Too many failed login attempts. Please try again later.");
          } else {
            setError(authError.message || "An error occurred during sign in. Please try again.");
          }
          setLoading(false);
        }
      } else {
        // Firebase Register
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          const user = userCredential.user;

          if (formData.username) {
            await updateProfile(user, { displayName: formData.username });
          }

          const path = `profiles/${user.uid}`;
          try {
            await setDoc(doc(db, "profiles", user.uid), {
              first_name: formData.username || user.email?.split('@')[0],
              last_name: '',
              email: user.email,
              age: '',
              gender: 'Other',
              state: '',
              occupation: '',
              income: '',
              category: 'General',
              created_at: new Date().toISOString()
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, path);
          }

          await sendEmailVerification(user);
          setVerificationEmail(user.email);
          await signOut(auth);
          setLoading(false);
        } catch (err: any) {
          const authError = err as AuthError;
          if (authError.code === 'auth/email-already-in-use') {
            setError('User already exists. Sign in?');
          } else if (authError.code === 'auth/operation-not-allowed') {
            setError('Email/Password sign-in is not enabled. Please contact support or try again later.');
          } else {
            // Check if it's a JSON error from handleFirestoreError
            try {
              const parsed = JSON.parse(err.message);
              setError(`Database Error: ${parsed.error}`);
            } catch {
              setError(authError.message || 'An error occurred during registration.');
            }
          }
          setLoading(false);
        }
      }
    } catch (err: any) {
      // Check if it's a JSON error from handleFirestoreError
      try {
        const parsed = JSON.parse(err.message);
        setError(`Database Error: ${parsed.error}`);
      } catch {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetEmailSent(formData.email);
      setLoading(false);
    } catch (err: any) {
      const authError = err as AuthError;
      if (authError.code === 'auth/user-not-found') {
        setError("No user found with this email address.");
      } else {
        setError("Failed to send reset link. Please try again later.");
      }
      setLoading(false);
    }
  };

  const labelClass = "text-[14px] font-bold text-[#1e293b]";
  const commonInputClass = "w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 focus:outline-none bg-white text-[15px] text-[#1e293b] font-medium placeholder:text-gray-400 transition-all";

  if (resetEmailSent) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center pt-8 pb-24 px-4 font-sans">
        <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-navy/5 border border-gray-100 p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 mt-20">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 text-orange-500">
            <Mail size={40} />
          </div>
          <h1 className="text-2xl font-black text-[#1e293b] mb-4">Reset Link Sent</h1>
          <p className="text-gray-500 leading-relaxed mb-10">
            We sent you a password change link to <span className="text-navy font-bold">{resetEmailSent}</span>.
          </p>
          <button 
            onClick={() => {
              setResetEmailSent(null);
              setIsForgotPassword(false);
              setIsLogin(true);
            }}
            className="w-full py-4 bg-[#1e293b] hover:bg-orange-primary text-white font-bold rounded-2xl shadow-xl shadow-navy/10 transition-all flex items-center justify-center text-[16px]"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (verificationEmail) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center pt-8 pb-24 px-4 font-sans">
        <div className="w-full max-w-[460px] mb-8">
          <button 
            onClick={() => setVerificationEmail(null)}
            className="inline-flex items-center gap-2 text-[15px] font-bold text-gray-400 hover:text-[#1e293b] transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow transition-all">
              <ChevronLeft size={18} />
            </div>
            <span>Back to Login</span>
          </button>
        </div>

        <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-navy/5 border border-gray-100 p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 text-orange-500">
            <Send size={40} className="ml-1" />
          </div>
          <h1 className="text-2xl font-black text-[#1e293b] mb-4">Verify Your Email</h1>
          <p className="text-gray-500 leading-relaxed mb-10">
            We have sent you a verification email to <span className="text-navy font-bold">{verificationEmail}</span>. Verify it and log in.
          </p>
          <button 
            onClick={() => {
              setVerificationEmail(null);
              setIsLogin(true);
            }}
            className="w-full py-4 bg-[#1e293b] hover:bg-orange-primary text-white font-bold rounded-2xl shadow-xl shadow-navy/10 transition-all flex items-center justify-center text-[16px]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center pt-8 pb-24 px-4 font-sans">
      <div className="w-full max-w-[460px] mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[15px] font-bold text-gray-400 hover:text-[#1e293b] transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow transition-all">
            <ChevronLeft size={18} />
          </div>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-[460px]">
        <div className="text-center mb-8 flex flex-col items-center">
            <div className="bg-[#1e293b] w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <Sparkles className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-[#1e293b] tracking-tight">Gov-Smart</h1>
            <p className="text-gray-500 text-[15px] mt-1">AI-Powered Schemes Portal</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-navy/5 border border-gray-100 w-full overflow-hidden">
          {!isForgotPassword && (
            <div className="flex p-1.5 bg-gray-50/80 m-6 rounded-2xl border border-gray-100">
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
                className={`flex-1 py-3 text-[15px] font-bold transition-all rounded-xl ${
                  isLogin 
                  ? 'bg-white text-[#1e293b] shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
                className={`flex-1 py-3 text-[15px] font-bold transition-all rounded-xl ${
                  !isLogin 
                  ? 'bg-white text-[#1e293b] shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          <form onSubmit={handleAuthAction} className="px-8 md:px-12 pb-12 pt-4">
            {isForgotPassword && (
              <div className="mb-6 flex items-center gap-3 text-navy font-black text-xl border-b border-gray-50 pb-4">
                <KeyRound className="text-orange-500" size={24} />
                Forgot Password
              </div>
            )}

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold animate-in fade-in slide-in-from-top-2 flex justify-between items-center">
                <span>{error}</span>
                {error === 'User already exists. Sign in?' && (
                  <button 
                    type="button" 
                    onClick={() => { setIsLogin(true); setError(null); }}
                    className="ml-2 underline text-red-800"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}

            {success && (
              <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-2xl font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            <div className="space-y-6">
              {!isLogin && !isForgotPassword && (
                <div className="space-y-2">
                  <label className={labelClass}>Username</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" name="username" required placeholder="yourname"
                      value={formData.username} onChange={handleChange} className={commonInputClass}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" name="email" required placeholder="name@example.com"
                    value={formData.email} onChange={handleChange} className={commonInputClass}
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className={labelClass}>Password</label>
                    {isLogin && (
                      <button 
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError(null);
                        }}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••"
                      value={formData.password} onChange={handleChange} className={commonInputClass}
                    />
                    <button 
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e293b]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {!isLogin && !isForgotPassword && (
                <div className="space-y-2">
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} name="confirmPassword" required placeholder="••••••••"
                      value={formData.confirmPassword} onChange={handleChange} className={commonInputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1e293b] hover:bg-orange-primary text-white font-bold rounded-2xl shadow-xl shadow-navy/10 transition-all flex items-center justify-center mt-10 text-[16px] disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isForgotPassword ? 'Get Reset Link' : (isLogin ? 'Sign In' : 'Create Account'))}
            </button>

            {isForgotPassword && (
              <button 
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError(null);
                }}
                className="w-full mt-4 py-2 text-sm font-bold text-gray-400 hover:text-navy transition-colors flex items-center justify-center gap-1"
              >
                <ChevronLeft size={14} /> Back to Sign In
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
