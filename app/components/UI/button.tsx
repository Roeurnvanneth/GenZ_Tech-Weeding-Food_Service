import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'gold' | 'ghost';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'ghost', children, className, ...props }) => {
  const baseStyles= "px-6 py02 rounded-lg font-medium transition-all duration-300";
  const variants = {
    gold: "text-white hover:bg-[#B99808]/60 hover:text-white border border-[#B99808] bg-[#B99808] active:scale-95",
    ghost: "bg-transparent text-[#333333] hover:bg-[#B99808] hover:text-white border-2 border-[#B99808] active:scale-95",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  )
}