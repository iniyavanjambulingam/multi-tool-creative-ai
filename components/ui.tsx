
import React, { SelectHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';

// --- Icons ---
export const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
export const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
export const PosterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
export const MemeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

// --- UI Components ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ children, isLoading = false, ...props }) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-light focus:ring-brand-purple disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
  >
    {isLoading && <Spinner className="-ml-1 mr-3" />}
    {children}
  </button>
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}
export const Select: React.FC<SelectProps> = ({ label, children, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-brand-text-light mb-1">{label}</label>
    <select
      {...props}
      className="block w-full pl-3 pr-10 py-2 text-base border-brand-border bg-brand-bg-dark rounded-md focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text"
    >
      {children}
    </select>
  </div>
);

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}
export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-brand-text-light mb-1">{label}</label>
    <textarea
      {...props}
      className="shadow-sm block w-full sm:text-sm border-brand-border rounded-md bg-brand-bg-dark text-brand-text focus:ring-brand-purple focus:border-brand-purple"
      rows={5}
    />
  </div>
);

interface SpinnerProps {
    className?: string;
}
export const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => (
  <svg className={`animate-spin h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface CardProps {
    children: React.ReactNode;
    className?: string;
}
export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`bg-brand-bg-dark border border-brand-border rounded-lg p-4 ${className}`}>
        {children}
    </div>
);
