import React from "react";
import { X, Smile } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onUpdateProfile: (name: string, avatarUrl: string) => Promise<void>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(user.name);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setName(user.name);
  }, [user]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await onUpdateProfile(name, "");
    setIsLoading(false);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm transition-opacity">
      <div className="bg-paper-bg w-full max-w-md sketch-border relative p-8 shadow-2xl">
        {/* Tape Effect */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-highlighter-blue/30 rotate-1 shadow-sm pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        <h2 className="font-marker text-3xl mb-8 text-center -rotate-2">
          Studio Settings
        </h2>

        <div className="space-y-8">
          {/* User Profile Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-2">
              <h3 className="font-hand text-xl font-bold flex items-center gap-2">
                <Smile size={20} /> Identity
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-sans uppercase tracking-widest hover:bg-black/5 px-2 py-1 rounded transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 bg-white/50 p-4 rounded sketch-border border-ink/10">
                <div>
                   <label className="block font-hand text-sm mb-1 opacity-60">Full Name</label>
                   <input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 font-hand border-b-2 border-ink/20 bg-transparent focus:border-highlighter-pink focus:outline-none transition-colors"
                   />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                   <button 
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 font-hand text-sm hover:underline opacity-60"
                      disabled={isLoading}
                   >
                     Cancel
                   </button>
                   <button 
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="px-4 py-1 bg-ink text-white font-hand rounded hover:bg-highlighter-pink hover:text-ink transition-colors disabled:opacity-50"
                   >
                     {isLoading ? "Saving..." : "Save Changes"}
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-white/50 p-4 rounded sketch-border border-ink/10">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white shrink-0 border-2 border-ink flex items-center justify-center">
                  <Smile className="w-8 h-8 text-highlighter-pink" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold font-hand text-lg truncate">{user.name}</p>
                  <p className="text-sm font-sans opacity-60 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>


          <div className="pt-6 text-center">
             <p className="font-hand text-sm opacity-40">
               Version 1.0.0
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
