import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const RegisterForm = () => {
  const { register: registerUser, error: authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const success = await registerUser(
        data.name,
        data.email,
        data.mobile,
        data.password
      );
      
      if (success) {
        toast.success('Registration successful!');
        router.push('/chat');
      } else {
        toast.error(authError || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-soft max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-800">Create Account</h1>
        <p className="text-secondary-600 mt-2">Join our P2P chat community</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
          placeholder="Enter your full name"
          leftIcon={<FiUser className="h-5 w-5 text-secondary-400" />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<FiMail className="h-5 w-5 text-secondary-400" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        
        <Input
          label="Mobile Number"
          placeholder="Enter your mobile number"
          leftIcon={<FiPhone className="h-5 w-5 text-secondary-400" />}
          error={errors.mobile?.message}
          {...register('mobile', {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: 'Please enter a valid mobile number',
            },
          })}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          leftIcon={<FiLock className="h-5 w-5 text-secondary-400" />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          leftIcon={<FiLock className="h-5 w-5 text-secondary-400" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match',
          })}
        />
        
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isSubmitting}
          leftIcon={<FiUserPlus />}
          className="mt-6"
        >
          Sign Up
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-secondary-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;