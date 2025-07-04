import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Facebook, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, title, className = '' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}${url}`;

  const handleCopyLink = async () => {
    try {
      // Use modern clipboard API with axios-like error handling
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      toast.success('Đã sao chép liên kết!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Không thể sao chép liên kết');
    }
  };

  const handleFacebookShare = () => {
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}`;
      const popup = window.open(facebookUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        toast.error('Vui lòng cho phép popup để chia sẻ');
      }
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      toast.error('Không thể chia sẻ lên Facebook');
    }
  };

  const handleZaloShare = () => {
    try {
      const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
      const popup = window.open(zaloUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        toast.error('Vui lòng cho phép popup để chia sẻ');
      }
    } catch (error) {
      console.error('Error sharing to Zalo:', error);
      toast.error('Không thể chia sẻ lên Zalo');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="w-5 h-5" />
        <span className="font-medium">Chia sẻ</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                <button
                  onClick={() => {
                    handleFacebookShare();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                  Chia sẻ lên Facebook
                </button>
                
                <button
                  onClick={() => {
                    handleZaloShare();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-4 h-4 mr-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Z</span>
                  </div>
                  Chia sẻ lên Zalo
                </button>
                
                <button
                  onClick={() => {
                    handleCopyLink();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-3 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 mr-3" />
                  )}
                  {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};