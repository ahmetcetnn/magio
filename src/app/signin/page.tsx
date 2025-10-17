'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import api from '../../lib/http';
import { toast } from 'react-toastify';
import { useState } from 'react';

type LoginForm = { email: string; password: string };

const schema = yup.object({
  email: yup.string().trim().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required'),
});

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginForm) => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          // API sets tokens in cookie; include credentials so browser stores them
          withCredentials: true,
          timeout: 15000,
        }
      );
      if (res.status === 200) {
        // Try multiple shapes the API may return
        const accessToken = (
          (res.data && (res.data.accessToken || res.data.token)) ||
          (res.data?.data && (res.data.data.accessToken || res.data.data.token)) ||
          (res.data?.result && (res.data.result.accessToken || res.data.result.token))
        ) as string | undefined;
        const refreshToken = (
          (res.data && (res.data.refreshToken)) ||
          (res.data?.data && (res.data.data.refreshToken)) ||
          (res.data?.result && (res.data.result.refreshToken))
        ) as string | undefined;

        try {
          if (accessToken) localStorage.setItem('accessToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        } catch {}

        // Immediately call refresh-token and include current accessToken in request body
        try {
          const stored = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : undefined;
          const r = await api.post('/users/refresh-token', stored ? { accessToken: stored } : {});
          const fresh = (r.data as any)?.accessToken || (r.data as any)?.token || (r.data as any)?.data?.accessToken;
          const freshRefresh = (r.data as any)?.refreshToken || (r.data as any)?.data?.refreshToken;
          if (fresh) {
            try { localStorage.setItem('accessToken', fresh); } catch {}
          }
          if (freshRefresh) {
            try { localStorage.setItem('refreshToken', freshRefresh); } catch {}
          }
        } catch {}

        toast.success('Signed in successfully');
        router.replace('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20">

        {/* Logo */}
        <div className="mb-12 lg:mb-16">
          <Image 
            src="/images/logonav.png" 
            alt="MagIo Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Sign In
            </h1>
            <p className="text-gray-500 text-sm">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Form Fields */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="example@gmail.com"
                className={`w-full pl-5 pr-6 pt-4 pb-4 border focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-sm placeholder-gray-400 text-[#78778B] ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                style={{ borderRadius: '10px' }}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                placeholder="••••••••"
                className={`w-full pl-5 pr-6 pt-4 pb-4 border focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-sm placeholder-gray-400 text-[#78778B] ${errors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                style={{ borderRadius: '10px' }}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-black font-medium px-5 py-3.5 transition-colors duration-200 mt-6 ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
              style={{ 
                borderRadius: '10px',
                backgroundColor: '#C8EE44',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Google Sign In */}
          <div className="mt-2.5">
            <button className="w-full flex items-center justify-center space-x-3 px-5 py-3.5 border border-gray-300 hover:bg-gray-50 transition-colors duration-200" style={{ borderRadius: '10px' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-500">
              Don't have an account?{' '}
              <div className="inline-block relative">
                <a href="/signup" className="text-black font-medium hover:underline">
                  Sign up
                </a>
                {/* Line Image positioned directly under "Sign up" */}
                <div className="absolute left-0 right-0 mt-1 flex justify-center">
                  <Image
                    src="/images/line.png"
                    alt="Underline"
                    width={60}
                    height={8}
                    className="h-auto w-auto"
                  />
                </div>
              </div>
              <span className="text-black font-medium hover:underline"></span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 via-gray-100 to-pink-100 items-center justify-center p-0 relative">
        <Image
          src="/images/mainimg.png"
          alt="Main image"
          fill
          className="object-center"
          priority
        />
      </div>
    </div>
  );
}