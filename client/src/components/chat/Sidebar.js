import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiUsers, 
  FiMessageSquare, 
  FiX, 
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConversationList from './ConversationList';
import SearchResults from './SearchResults';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { 
    conversations, 
    handleSearch, 
    searchQuery, 
    searchResults, 
    isSearching,
    setActiveChat 
  } = useChat();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Handle search input change
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Close search
  const closeSearch = () => {
    setIsSearchOpen(false);
    setQuery('');
    handleSearch('');
  };

  // Count unread messages
  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0), 
    0
  );

  // Handle user logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Handle user selection from search
  const handleUserSelect = (userId) => {
    setActiveChat(userId);
    closeSearch();
  };

  // Update search results when query changes
  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query, handleSearch]);

  return (
    <div className="h-full w-full md:w-80 lg:w-96 bg-white border-r border-secondary-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar 
              src={user?.avatar} 
              alt={user?.name} 
              size="md" 
              online={true}
            />
            <div>
              <h2 className="font-medium text-secondary-900">{user?.name}</h2>
              <p className="text-xs text-secondary-500">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            leftIcon={<FiLogOut className="h-4 w-4" />}
            className="text-secondary-500"
          >
            Logout
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="mt-4">
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search by email or phone..."
                value={query}
                onChange={handleSearchChange}
                onClick={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <FiSearch className="absolute left-3 top-2.5 text-secondary-400" />
              {isSearchOpen && query && (
                <FiX
                  className="absolute right-3 top-2.5 text-secondary-400 cursor-pointer"
                  onClick={closeSearch}
                />
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-secondary-200">
        <button
          className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
            !isSearchOpen
              ? 'text-primary-600 border-b-2 border-primary-600 font-medium'
              : 'text-secondary-500 hover:text-secondary-700'
          }`}
          onClick={() => setIsSearchOpen(false)}
        >
          <FiMessageSquare className="h-5 w-5" />
          <span>Chats</span>
          {totalUnread > 0 && (
            <Badge variant="primary" size="sm">
              {totalUnread}
            </Badge>
          )}
        </button>
        <button
          className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
            isSearchOpen
              ? 'text-primary-600 border-b-2 border-primary-600 font-medium'
              : 'text-secondary-500 hover:text-secondary-700'
          }`}
          onClick={() => setIsSearchOpen(true)}
        >
          <FiUsers className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isSearchOpen ? (
          <SearchResults
            results={searchResults}
            isLoading={isSearching}
            query={searchQuery}
            onSelect={handleUserSelect}
          />
        ) : (
          <ConversationList conversations={conversations} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;