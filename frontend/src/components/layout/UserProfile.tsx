import React from 'react';
import { LogOut, Smile } from 'lucide-react';

interface UserProfileProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      picture?: string;
    };
  };
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 sketch-border overflow-hidden bg-white flex items-center justify-center">
          <Smile className="w-10 h-10 text-highlighter-pink" />
        </div>
        <div>
          <h2 className="marker-text text-3xl leading-tight">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}
          </h2>
          <button 
            onClick={onLogout}
            className="font-sketch text-lg text-ink-light hover:text-highlighter-pink flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>


    </div>
  );
};

export default UserProfile;
