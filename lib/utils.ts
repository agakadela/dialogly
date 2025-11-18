import { subjectsColors } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: Subject | string): string => {
  const subjectKey = String(subject).toLowerCase();
  const color = subjectsColors[subjectKey as keyof typeof subjectsColors];
  return color || '#E5E5E5';
};
