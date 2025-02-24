import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  return (
    <AppLayout title="Register | P2P Chat App" requireAuth={false}>
      <Head>
        <title>Register | P2P Chat App</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600">P2P Chat</h1>
            <p className="text-secondary-600 mt-2">
              Create your account to get started
            </p>
          </div>
          
          <RegisterForm />
        </motion.div>
        
        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    </AppLayout>
  );
};

export default RegisterPage;