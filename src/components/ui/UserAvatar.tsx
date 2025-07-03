import React, { useState } from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  image, 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const generateAvatarUrl = (name: string) => {
    // Use UI Avatars service for consistent, colorful avatars
    const colors = ['3B82F6', '8B5CF6', 'EF4444', '10B981', 'F59E0B', 'EC4899', '6366F1', '14B8A6'];
    const colorIndex = name.length % colors.length;
    const backgroundColor = colors[colorIndex];
    
    const sizeMap = { sm: 32, md: 40, lg: 48, xl: 64 };
    const avatarSize = sizeMap[size];
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=${backgroundColor}&color=fff&size=${avatarSize}&font-size=0.4&format=png&rounded=true`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const avatarUrl = image && !imageError ? image : generateAvatarUrl(name);
  const initials = getInitials(name);

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 ${className}`}>
      {(image && !imageError) ? (
        <Image
          src={image}
          alt={`${name}'s avatar`}
          fill
          className="object-cover"
          unoptimized
          onError={() => setImageError(true)}
        />
      ) : (
        <>
          <Image
            src={avatarUrl}
            alt={`${name}'s avatar`}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
          {imageError && (
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center ${sizeClasses[size].split(' ')[2]}`}>
              {initials}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserAvatar;
