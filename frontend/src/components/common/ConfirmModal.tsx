import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Check, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Yes, Proceed', 
  cancelText = 'Wait, No',
  type = 'default'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            className="relative sketch-border bg-white p-8 max-w-md w-full shadow-2xl overflow-hidden"
          >
            {/* Highlighter background detail */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 ${type === 'danger' ? 'bg-highlighter-pink' : 'bg-highlighter-yellow'}`} />
            
            <div className="flex flex-col items-center text-center gap-6 relative z-10">
              <div className={`w-16 h-16 sketch-border flex items-center justify-center ${type === 'danger' ? 'bg-highlighter-pink/10' : 'bg-highlighter-yellow/10'}`}>
                <HelpCircle size={32} className={type === 'danger' ? 'text-highlighter-pink' : 'text-ink'} />
              </div>
              
              <div>
                <h3 className="marker-text text-3xl mb-2">{title}</h3>
                <p className="font-hand text-xl text-ink-light leading-snug">{message}</p>
              </div>
              
              <div className="flex gap-4 w-full mt-4">
                <button 
                  onClick={onCancel}
                  className="flex-1 py-3 sketch-border font-hand text-xl hover:bg-paper-bg transition-all flex items-center justify-center gap-2 group"
                >
                  <X size={18} className="group-hover:rotate-90 transition-transform" />
                  {cancelText}
                </button>
                <button 
                  onClick={() => { onConfirm(); onCancel(); }}
                  className={`flex-1 py-3 sketch-border font-marker text-xl text-white transition-all flex items-center justify-center gap-2 group ${type === 'danger' ? 'bg-highlighter-pink hover:bg-ink' : 'bg-ink hover:bg-highlighter-yellow hover:text-ink'}`}
                >
                  <Check size={18} className="group-hover:scale-125 transition-transform" />
                  {confirmText}
                </button>
              </div>
            </div>
            
            {/* Tape effect at bottom */}
            <div className="absolute -bottom-2 left-1/4 w-24 h-6 bg-tape/20 rotate-1 shadow-sm" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
