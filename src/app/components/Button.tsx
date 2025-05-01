import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    // Colores neutros
    | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
    // Colores cálidos
    | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
    // Colores fríos
    | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
    // Colores azules
    | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
    // Colores rosados
    | 'pink' | 'rose'
    // Variantes light
    | 'slateLight' | 'grayLight' | 'zincLight' | 'neutralLight' | 'stoneLight'
    | 'redLight' | 'orangeLight' | 'amberLight' | 'yellowLight' | 'limeLight'
    | 'greenLight' | 'emeraldLight' | 'tealLight' | 'cyanLight' | 'skyLight'
    | 'blueLight' | 'indigoLight' | 'violetLight' | 'purpleLight' | 'fuchsiaLight'
    | 'pinkLight' | 'roseLight';
  size?: 'normal' | 'small';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'teal',
  size = 'normal',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const buttonBaseStyle = "text-white rounded-md font-semibold shadow-sm shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1 cursor-pointer";
  const buttonBaseStyle2 = "text-white rounded-md font-semibold shadow-sm shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1 cursor-pointer";
  
  const sizeClasses = {
    normal: 'px-4 py-2',
    small: 'px-3 py-1',
  };

  const variantClasses = {
    // Colores neutros
    slate: `bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 ${buttonBaseStyle}`,
    gray: `bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 ${buttonBaseStyle}`,
    zinc: `bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-600 hover:to-zinc-700 ${buttonBaseStyle}`,
    neutral: `bg-gradient-to-r from-neutral-500 to-neutral-600 hover:from-neutral-600 hover:to-neutral-700 ${buttonBaseStyle}`,
    stone: `bg-gradient-to-r from-stone-500 to-stone-600 hover:from-stone-600 hover:to-stone-700 ${buttonBaseStyle}`,
    
    // Colores cálidos
    red: `bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 ${buttonBaseStyle}`,
    orange: `bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 ${buttonBaseStyle}`,
    amber: `bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 ${buttonBaseStyle}`,
    yellow: `bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 ${buttonBaseStyle}`,
    lime: `bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 ${buttonBaseStyle}`,
    
    // Colores fríos
    green: `bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 ${buttonBaseStyle}`,
    emerald: `bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 ${buttonBaseStyle}`,
    teal: `bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 ${buttonBaseStyle}`,
    cyan: `bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 ${buttonBaseStyle}`,
    sky: `bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 ${buttonBaseStyle}`,
    
    // Colores azules
    blue: `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 ${buttonBaseStyle}`,
    indigo: `bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 ${buttonBaseStyle}`,
    violet: `bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 ${buttonBaseStyle}`,
    purple: `bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 ${buttonBaseStyle}`,
    fuchsia: `bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 ${buttonBaseStyle}`,
    
    // Colores rosados
    pink: `bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 ${buttonBaseStyle}`,
    rose: `bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 ${buttonBaseStyle}`,
    
    // Variantes light
    slateLight: `bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 ${buttonBaseStyle2}`,
    grayLight: `bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 ${buttonBaseStyle2}`,
    zincLight: `bg-gradient-to-r from-zinc-400 to-zinc-500 hover:from-zinc-500 hover:to-zinc-600 ${buttonBaseStyle2}`,
    neutralLight: `bg-gradient-to-r from-neutral-400 to-neutral-500 hover:from-neutral-500 hover:to-neutral-600 ${buttonBaseStyle2}`,
    stoneLight: `bg-gradient-to-r from-stone-400 to-stone-500 hover:from-stone-500 hover:to-stone-600 ${buttonBaseStyle2}`,
    
    redLight: `bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 ${buttonBaseStyle2}`,
    orangeLight: `bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 ${buttonBaseStyle2}`,
    amberLight: `bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 ${buttonBaseStyle2}`,
    yellowLight: `bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 ${buttonBaseStyle2}`,
    limeLight: `bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 ${buttonBaseStyle2}`,
    
    greenLight: `bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 ${buttonBaseStyle2}`,
    emeraldLight: `bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 ${buttonBaseStyle2}`,
    tealLight: `bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 ${buttonBaseStyle2}`,
    cyanLight: `bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 ${buttonBaseStyle2}`,
    skyLight: `bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 ${buttonBaseStyle2}`,
    
    blueLight: `bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 ${buttonBaseStyle2}`,
    indigoLight: `bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 ${buttonBaseStyle2}`,
    violetLight: `bg-gradient-to-r from-violet-400 to-violet-500 hover:from-violet-500 hover:to-violet-600 ${buttonBaseStyle2}`,
    purpleLight: `bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 ${buttonBaseStyle2}`,
    fuchsiaLight: `bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 ${buttonBaseStyle2}`,
    
    pinkLight: `bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 ${buttonBaseStyle2}`,
    roseLight: `bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 ${buttonBaseStyle2}`,
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
