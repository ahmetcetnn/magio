'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const schema = yup.object().shape({
  fullName: yup.string().trim().required('Full name is required'),
  email: yup.string().trim().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .required('Password is required'),
});

type FormData = {
  fullName: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  setFocus,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const watchedValues = watch();
  
  useEffect(() => {
  }, [watchedValues, errors, isValid]);

  useEffect(() => {
    if (errors.fullName) {
      setFocus('fullName');
    } else if (errors.email) {
      setFocus('email');
    } else if (errors.password) {
      setFocus('password');
    }
  }, [errors, setFocus]);

  const onSubmit = async (data: FormData) => {
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        toast.success('Account created successfully!');
        setTimeout(() => {
          reset();
          router.push('/signin');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || isSuccess;

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        setRedirecting(true);
        router.replace('/dashboard');
      }
    } catch {}
  }, [router]);

  if (redirecting) return null;

  return (
  <div className="min-h-screen flex bg-white">
      
      <div className="w-full lg:w-1/2 flex flex-col justify-start pt-10 lg:pt-8 px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="mb-8 lg:mb-20">
          <Image 
            src="/images/logonav.png" 
            alt="MagIo Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Create new account
            </h1>
            <p className="text-gray-500 text-sm">
              Welcome back! Please enter your details
            </p>
          </div>

          <form 
            className="space-y-4" 
            onSubmit={handleSubmit(onSubmit, (errors) => {
              toast.error('Please fill in all required fields correctly.');
            })}
          >
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register('fullName')}
                type="text"
                id="fullName"
                placeholder="Mahfuzul Nabil"
                disabled={isDisabled}
                className={`w-full pl-5 pr-6 pt-4 pb-4 border focus:outline-none focus:ring-2 ${errors.fullName ? 'focus:ring-red-500' : 'focus:ring-lime-500'} focus:border-transparent text-sm placeholder-gray-400 text-gray-900 ${
                  isDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'
                } ${errors.fullName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                style={{ borderRadius: '10px' }}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="example@gmail.com"
                disabled={isDisabled}
                className={`w-full pl-5 pr-6 pt-4 pb-4 border focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-lime-500'} focus:border-transparent text-sm placeholder-gray-400 text-gray-900 ${
                  isDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'
                } ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                style={{ borderRadius: '10px' }}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                placeholder="••••••••"
                disabled={isDisabled}
                className={`w-full pl-5 pr-6 pt-4 pb-4 border focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-lime-500'} focus:border-transparent text-sm placeholder-gray-400 text-gray-900 ${
                  isDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'
                } ${errors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                style={{ borderRadius: '10px' }}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full text-black font-medium px-5 py-3.5 transition-colors duration-200 mt-6 flex items-center justify-center ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{ 
                borderRadius: '10px',
                backgroundColor: '#C8EE44',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-2.5">
            <button 
              disabled={isDisabled}
              className={`w-full flex items-center justify-center space-x-3 px-5 py-3.5 border border-gray-300 transition-colors duration-200 ${
                isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
              }`} 
              style={{ borderRadius: '10px' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Sign up with google</span>
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-500">
              Already have an account?{' '}
              <div className="inline-block relative">
                <a href="/signin" className="text-black font-medium hover:underline">
                  Sign in
                </a>
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
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 via-gray-100 to-pink-100 items-center justify-center p-0 relative">
        <Image
          src="/images/mainimg.png"
          alt="Main image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}