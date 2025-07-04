import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../hooks/useAuth';

interface LikeButtonProps {
  blogId: string;
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ blogId, className = '' }) => {
  const {  canLike } = useAuth();
  const { getBlogInteraction, isLiked, toggleLike } = useComments();
  
  const interaction = getBlogInteraction(blogId);
  const liked = isLiked(blogId);

  const handleLike = async () => {
    if (!canLike()) {
      return;
    }
    await toggleLike(blogId);
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={!canLike()}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      } ${!canLike() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      whileHover={canLike() ? { scale: 1.05 } : {}}
      whileTap={canLike() ? { scale: 0.95 } : {}}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
        />
      </motion.div>
      <span className="font-medium">
        {interaction.likeCount > 0 ? interaction.likeCount : 'Thích'}
      </span>
    </motion.button>
  );
};