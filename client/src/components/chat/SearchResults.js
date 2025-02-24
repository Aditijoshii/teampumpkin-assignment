import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

const SearchResults = ({ results, isLoading, query, onSelect }) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-secondary-600">Searching...</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
          <FiSearch className="h-8 w-8 text-secondary-500" />
        </div>
        <h3 className="text-lg font-medium text-secondary-900">Search for users</h3>
        <p className="text-secondary-500 mt-1">
          Find people by email or phone number
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
          <FiSearch className="h-8 w-8 text-secondary-500" />
        </div>
        <h3 className="text-lg font-medium text-secondary-900">No users found</h3>
        <p className="text-secondary-500 mt-1">
          Try another search term or check the spelling
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-secondary-100">
      {results.map((user) => (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 hover:bg-secondary-50"
        >
          <div className="flex items-center space-x-3">
            <Avatar
              src={user.avatar}
              alt={user.name}
              online={user.isOnline}
              size="lg"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-secondary-900 truncate">
                {user.name}
              </h3>
              <p className="text-xs text-secondary-500 truncate mt-1">
                {user.email}
              </p>
              <p className="text-xs text-secondary-500 truncate mt-0.5">
                {user.mobile}
              </p>
            </div>
            
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FiUserPlus className="h-4 w-4" />}
              onClick={() => onSelect(user._id)}
            >
              Chat
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SearchResults;