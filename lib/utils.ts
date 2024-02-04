import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const convertTime = (createdAt: Date): string => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);
  
    if (years > 0) {
        return `(${years} ${years === 1 ? 'year' : 'years'}) ago`;
    } else if (weeks > 0) {
        return `(${weeks} ${weeks === 1 ? 'week' : 'weeks'}) ago`;
    } else if (days > 0) {
        return `(${days} ${days === 1 ? 'day' : 'days'}) ago`;
    } else if (hours > 0) {
        return `(${hours} ${hours === 1 ? 'hour' : 'hours'}) ago`;
    } else if (minutes > 0) {
        return `(${minutes} ${minutes === 1 ? 'minute' : 'minutes'}) ago`;
    } else {
        return `(${seconds} ${seconds === 1 ? 'second' : 'seconds'}) ago`;
    }
};

export const formatNumber = (number: number): string => {
    if (Math.abs(number) >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M';
    } else if (Math.abs(number) >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K';
    } else {
        return number?.toString();
    }
};
  
  
  