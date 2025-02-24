import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiLock, FiUsers, FiWifi } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

const HomePage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect to chat if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/chat');
    }
  }, [isAuthenticated, loading, router]);

  // Skip rendering if we're going to redirect
  if (loading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Features list
  const features = [
    {
      icon: <FiMessageSquare className="h-8 w-8 text-primary-500" />,
      title: 'Real-time messaging',
      description: 'Send and receive messages instantly without delays.',
    },
    {
      icon: <FiLock className="h-8 w-8 text-primary-500" />,
      title: 'Secure communication',
      description: 'End-to-end messaging ensures your conversations are private.',
    },
    {
      icon: <FiUsers className="h-8 w-8 text-primary-500" />,
      title: 'Simple user search',
      description: 'Find users by email or phone number to start chatting.',
    },
    {
      icon: <FiWifi className="h-8 w-8 text-primary-500" />,
      title: 'Offline support',
      description: 'Messages are stored temporarily when offline and delivered when back online.',
    },
  ];

  return (
    <>
      <Head>
        <title>P2P Chat - Peer-to-Peer Messaging</title>
        <meta name="description" content="A secure peer-to-peer chat application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">P2P Chat</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" passHref>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section className="flex-1 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
                  Secure peer-to-peer messaging
                </h2>
                <p className="text-lg text-secondary-700 mb-8">
                  Connect directly with your peers without storing messages in a central server.
                  Enjoy real-time communication with enhanced privacy.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/register" passHref>
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/login" passHref>
                    <Button variant="secondary" size="lg">Login</Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block"
              >
                {/* Placeholder for chat UI image */}
                <div className="w-full h-96 bg-white rounded-xl shadow-soft overflow-hidden border border-secondary-200">
                  <div className="h-12 bg-primary-600 flex items-center px-4">
                    <div className="w-3 h-3 rounded-full bg-secondary-200 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary-200 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary-200"></div>
                  </div>
                  <div className="flex h-[calc(100%-3rem)]">
                    <div className="w-1/3 border-r border-secondary-100 p-2">
                      <div className="bg-secondary-100 h-10 rounded mb-2"></div>
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center">
                            <div className="w-8 h-8 bg-secondary-200 rounded-full"></div>
                            <div className="ml-2 flex-1">
                              <div className="h-2 bg-secondary-200 rounded w-20"></div>
                              <div className="h-2 bg-secondary-200 rounded w-16 mt-1"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex-1">
                        <div className="flex justify-end mb-2">
                          <div className="bg-primary-500 text-white rounded-lg p-2 max-w-xs">
                            <div className="h-2 bg-primary-400 rounded w-24 mb-1"></div>
                            <div className="h-2 bg-primary-400 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          <div className="bg-secondary-200 rounded-lg p-2 max-w-xs">
                            <div className="h-2 bg-secondary-300 rounded w-32 mb-1"></div>
                            <div className="h-2 bg-secondary-300 rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 bg-secondary-100 rounded flex items-center px-2">
                        <div className="flex-1 h-6 bg-white rounded mx-2"></div>
                        <div className="w-6 h-6 bg-primary-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900">Key Features</h2>
              <p className="text-secondary-600 mt-4 max-w-2xl mx-auto">
                Our peer-to-peer chat application offers these essential features for a seamless communication experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-secondary-50 rounded-xl p-6 shadow-sm border border-secondary-100"
                >
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to start chatting?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Join our P2P chat platform today and experience secure, direct communication with your peers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register" passHref>
                <Button size="lg" variant="secondary">
                  Create Account
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button size="lg" variant="ghost" className="text-white border border-primary-300 hover:bg-primary-700">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-secondary-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-secondary-400 text-sm">
              &copy; {new Date().getFullYear()} P2P Chat. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;