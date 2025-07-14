'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle, CheckCircle, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/cart-context';

export default function SignUpPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const emailFromUrl = searchParams.get('email') || '';
  const redirect = searchParams.get('redirect') || '/wellness-hub';
  const requireAccount = searchParams.get('requireAccount') === 'true';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [intendedProduct, setIntendedProduct] = useState<any>(null);
  const [intendedPackage, setIntendedPackage] = useState<any>(null);
  
  const { signUp } = useAuth();

  // Check for intended products/packages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const product = sessionStorage.getItem('intendedProduct');
      const pkg = sessionStorage.getItem('intendedPackage');
      
      if (product) {
        setIntendedProduct(JSON.parse(product));
      }
      if (pkg) {
        setIntendedPackage(JSON.parse(pkg));
      }
    }
  }, []);

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    const allRequirementsMet = passwordRequirements.every(req => req.met);
    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      
      // Add intended product to cart if present
      if (intendedProduct) {
        addItem({
          id: `course-${intendedProduct.courseId}`,
          type: 'course',
          productId: intendedProduct.courseId,
          name: intendedProduct.courseName,
          description: intendedProduct.description,
          price: intendedProduct.price / 100,
          quantity: 1,
          image: intendedProduct.image,
          metadata: {
            courseId: intendedProduct.courseId
          }
        });
        sessionStorage.removeItem('intendedProduct');
      }
      
      // Clear intended package (would need to navigate to packages page)
      if (intendedPackage) {
        sessionStorage.removeItem('intendedPackage');
      }
      
      // Clear checkout redirect flag
      if (sessionStorage.getItem('checkout_redirect')) {
        sessionStorage.removeItem('checkout_redirect');
      }
      
      // Redirect to intended page
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/Logo/BLOOM-LOGO.png"
                alt="Bloom Psychology"
                width={120}
                height={60}
                className="mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-playfair text-bloom-dark mt-4">Create Your Account</h1>
            <p className="text-bloom-dark/60 mt-2">Start your wellness journey today</p>
          </div>

          {/* Show intended purchase if present */}
          {(intendedProduct || intendedPackage) && (
            <div className="bg-bloom-pink-50 rounded-lg p-4 mb-6 border border-bloom-pink/20">
              <div className="flex items-start gap-3">
                {intendedProduct ? (
                  <ShoppingCart className="w-5 h-5 text-bloom-pink flex-shrink-0 mt-0.5" />
                ) : (
                  <Package className="w-5 h-5 text-bloom-pink flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-semibold text-bloom-dark text-sm mb-1">
                    Create an account to complete your purchase
                  </h3>
                  <p className="text-xs text-bloom-dark/70">
                    {intendedProduct ? (
                      <>Adding to cart: <span className="font-medium">{intendedProduct.courseName}</span></>
                    ) : intendedPackage ? (
                      <>Selected package: <span className="font-medium">{intendedPackage.name}</span></>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Value Proposition */}
          <div className="bg-bloom-sage-50 rounded-lg p-4 mb-6 border border-bloom-sage/20">
            <h3 className="font-semibold text-bloom-dark mb-2 text-sm">Your free account includes:</h3>
            <ul className="space-y-1.5 text-sm text-bloom-dark/70">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-bloom-sage flex-shrink-0 mt-0.5" />
                <span>Access to all purchased courses and materials</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-bloom-sage flex-shrink-0 mt-0.5" />
                <span>Track your progress through wellness programs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-bloom-sage flex-shrink-0 mt-0.5" />
                <span>Save your cart and wishlist for later</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-bloom-sage flex-shrink-0 mt-0.5" />
                <span>Exclusive member discounts and early access</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-bloom-dark mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 w-5 h-5" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bloom-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bloom-dark mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 hover:text-bloom-dark"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <CheckCircle className={`w-3 h-3 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={req.met ? 'text-green-700' : 'text-gray-500'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-bloom-dark mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-bloompink border-gray-300 rounded focus:ring-bloompink"
              />
              <label htmlFor="terms" className="text-sm text-bloom-dark/70">
                I agree to the{' '}
                <Link href="/terms" className="text-bloompink hover:text-bloom-pink-dark">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-bloompink hover:text-bloom-pink-dark">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full bg-bloompink text-white py-3 rounded-lg font-semibold hover:bg-bloom-pink-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-bloom-dark/60">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-bloompink hover:text-bloom-pink-dark font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}