'use client';

import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUserImageQuery } from "@/hooks/messages.hooks";

interface UserAvatarProps {
  userId?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * UserAvatar component that handles fetching user profile images and displays appropriate fallbacks
 * 
 * @param userId - The Clerk user ID for fetching the image
 * @param firstName - User's first name (used for initials fallback)
 * @param lastName - User's last name (used for initials fallback)
 * @param email - User's email address (used for alt text)
 * @param className - Additional classes for the Avatar component
 * @param fallbackClassName - Additional classes for the AvatarFallback component
 * @param size - Size of the avatar (sm, md, lg)
 */
export default function UserAvatar({
  userId,
  firstName = "",
  lastName = "",
  email = "",
  className = "",
  fallbackClassName = "",
  size = "md",
}: Readonly<UserAvatarProps>) {
  // Size classes for different avatar sizes
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  // Get the user's profile image URL from Clerk
  const { data: imageUrl, isLoading } = useUserImageQuery(userId!);

  // Generate initials for fallback
  const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  const hasInitials = !!initials.trim();
  
  // Full name or email for alt text
  const altText = `${firstName} ${lastName}`.trim() || email || "User";

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {!isLoading && imageUrl && (
        <AvatarImage 
          src={imageUrl} 
          alt={altText}
          className="rounded-full border border-gray-300 bg-primary object-cover"
        />
      )}
      <AvatarFallback 
        className={cn(
          "bg-primary/10 text-primary", 
          fallbackClassName
        )}
      >
        {hasInitials ? (
          <span className="text-xs font-semibold">{initials}</span>
        ) : (
          <FaUserCircle className={cn(
            size === "sm" ? "size-4" : 
              size === "md" ? "size-5" :
                "size-6"
          )} />
        )}
      </AvatarFallback>
    </Avatar>
  );
}