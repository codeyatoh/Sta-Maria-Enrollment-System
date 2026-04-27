import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/Select';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  Lock,
  ArrowLeft
} from 'lucide-react';

import { useAuth } from '../../lib/AuthContext';

export function SignUpPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    if (user && role) {
      navigate(`/${role}`);
    }
  }, [user, role, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: 'None',
    relationship: 'Father',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Contact number validation (11 digits only)
    if (id === 'contactNumber') {
      const cleaned = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [id]: cleaned }));
      return;
    }

    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.contactNumber.length !== 11) {
      setError("Contact number must be exactly 11 digits.");
      return;
    }

    setIsRegistering(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffix: formData.suffix,
        relationship: formData.relationship,
        contactNumber: formData.contactNumber,
        email: formData.email,
        role: 'parent', // Default role for sign-ups
        createdAt: new Date().toISOString()
      });

      // Redirect to parent portal
      navigate('/parent');
    } catch (err: any) {
      console.error(err);
      let message = "Failed to create account. Please try again.";
      
      if (err.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please use another or sign in.";
      } else if (err.code === 'auth/invalid-email') {
        message = "Invalid email address format.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password is too weak. Please use at least 6 characters.";
      } else if (err.code === 'auth/network-request-failed') {
        message = "Connection error. Please check your internet.";
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background overflow-hidden">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
            'url(https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000)'
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
              "Building the foundation for your child's future, together."
            </p>
            <footer className="text-sm text-zinc-300">
              Join our community of parents and educators.
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="p-4 lg:p-8 h-full flex items-center overflow-y-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] py-10">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Join the Sta. Maria community as a parent/guardian
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <User className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    placeholder="Enter middle name"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="h-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Suffix</Label>
                  <Select
                    value={formData.suffix}
                    onValueChange={(v) => handleSelectChange('suffix', v)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select suffix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Jr.">Jr.</SelectItem>
                      <SelectItem value="Sr.">Sr.</SelectItem>
                      <SelectItem value="II">II</SelectItem>
                      <SelectItem value="III">III</SelectItem>
                      <SelectItem value="IV">IV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Relationship with Student</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(v) => handleSelectChange('relationship', v)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="contactNumber"
                      placeholder="09123456789"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="h-10 pl-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Account Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-10 pl-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-10 pr-10" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="h-10 pr-10" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive text-center bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-in fade-in zoom-in duration-200">
                {error}
              </div>
            )}

            <div className="pt-2 space-y-4">
              <Button type="submit" className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={isRegistering}>
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <Button
                variant="ghost"
                type="button"
                className="w-full h-11 rounded-xl text-slate-500 hover:text-primary transition-colors"
                onClick={() => navigate('/login')}>
                Already have an account? Sign In
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary font-medium">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
