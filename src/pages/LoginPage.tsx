import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  Users,
  BookOpen,
  FileText,
  Loader2 } from
'lucide-react';
import { useAuth } from '../lib/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, role } = useAuth();

  useEffect(() => {
    if (roleParam) {
      setEmail(`${roleParam}@school.edu`);
    }
  }, [roleParam]);

  useEffect(() => {
    if (user && role) {
      navigate(`/${role}`);
    }
  }, [user, role, navigate]);

  const handleQuickLogin = async (role: 'admin' | 'teacher' | 'parent') => {
    setEmail(`${role}@school.edu`);
    setPassword('password123'); // Default password for demo
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userRole = docSnap.data().role;
        navigate(`/${userRole}`);
      } else {
        setError("User role not found. Please contact administrator.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background">
      <Button
        variant="ghost"
        className="absolute right-4 top-4 md:right-8 md:top-8 z-20"
        onClick={() => navigate('/')}>
        Back to Home
      </Button>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
            'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000)'
          }} />
        <div className="absolute inset-0 bg-zinc-900/70" />
        <div className="relative z-20 flex items-center gap-3 font-bold text-xl tracking-tight">
          <img
            src="/pasted-image.jpg"
            alt="Sta. Maria Logo"
            className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/10" />
          <span>Sta. Maria Enrollment</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl font-medium tracking-wide">
              "Believe, Educate, and Transform."
            </p>
            <footer className="text-sm text-zinc-300">
              Founded Since 1920
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="p-8 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex items-center justify-center gap-2 font-bold text-lg tracking-tight lg:hidden mb-4">
            <img
              src="/pasted-image.jpg"
              alt="Sta. Maria Logo"
              className="w-8 h-8 rounded-full object-cover" />
            <span>Sta. Maria Enrollment</span>
          </div>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10" />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10" />
                </div>

                {error && (
                  <div className="text-sm font-medium text-destructive text-center bg-destructive/10 p-2 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full mt-2" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with demo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                type="button"
                className="text-xs w-full"
                onClick={() => handleQuickLogin('admin')}>
                <Users className="mr-2 h-4 w-4" />
                Admin
              </Button>
              <Button
                variant="outline"
                type="button"
                className="text-xs w-full"
                onClick={() => handleQuickLogin('teacher')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Teacher
              </Button>
              <Button
                variant="outline"
                type="button"
                className="text-xs w-full"
                onClick={() => handleQuickLogin('parent')}>
                <FileText className="mr-2 h-4 w-4" />
                Parent
              </Button>
            </div>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}