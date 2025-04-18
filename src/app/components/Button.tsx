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
  const buttonBaseStyle = "text-white rounded-md font-semibold shadow-sm shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1";
  const buttonBaseStyle2 = "text-white rounded-md font-semibold shadow-sm shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1";
  
  const sizeClasses = {
    normal: 'px-4 py-2',
    small: 'px-3 py-1',
  };

  const variantClasses = {
    // Colores neutros
    slate: `bg-slate-500 hover:bg-slate-600 ${buttonBaseStyle}`,
    gray: `bg-gray-500 hover:bg-gray-600 ${buttonBaseStyle}`,
    zinc: `bg-zinc-500 hover:bg-zinc-600 ${buttonBaseStyle}`,
    neutral: `bg-neutral-500 hover:bg-neutral-600 ${buttonBaseStyle}`,
    stone: `bg-stone-500 hover:bg-stone-600 ${buttonBaseStyle}`,
    
    // Colores cálidos
    red: `bg-red-500 hover:bg-red-600 ${buttonBaseStyle}`,
    orange: `bg-orange-500 hover:bg-orange-600 ${buttonBaseStyle}`,
    amber: `bg-amber-500 hover:bg-amber-600 ${buttonBaseStyle}`,
    yellow: `bg-yellow-500 hover:bg-yellow-600 ${buttonBaseStyle}`,
    lime: `bg-lime-500 hover:bg-lime-600 ${buttonBaseStyle}`,
    
    // Colores fríos
    green: `bg-green-500 hover:bg-green-600 ${buttonBaseStyle}`,
    emerald: `bg-emerald-500 hover:bg-emerald-600 ${buttonBaseStyle}`,
    teal: `bg-teal-500 hover:bg-teal-600 ${buttonBaseStyle}`,
    cyan: `bg-cyan-500 hover:bg-cyan-600 ${buttonBaseStyle}`,
    sky: `bg-sky-500 hover:bg-sky-600 ${buttonBaseStyle}`,
    
    // Colores azules
    blue: `bg-blue-500 hover:bg-blue-600 ${buttonBaseStyle}`,
    indigo: `bg-indigo-500 hover:bg-indigo-600 ${buttonBaseStyle}`,
    violet: `bg-violet-500 hover:bg-violet-600 ${buttonBaseStyle}`,
    purple: `bg-purple-500 hover:bg-purple-600 ${buttonBaseStyle}`,
    fuchsia: `bg-fuchsia-500 hover:bg-fuchsia-600 ${buttonBaseStyle}`,
    
    // Colores rosados
    pink: `bg-pink-500 hover:bg-pink-600 ${buttonBaseStyle}`,
    rose: `bg-rose-500 hover:bg-rose-600 ${buttonBaseStyle}`,
    
    // Variantes light
    slateLight: `bg-slate-400 hover:bg-slate-600 ${buttonBaseStyle2}`,
    grayLight: `bg-gray-400 hover:bg-gray-600 ${buttonBaseStyle2}`,
    zincLight: `bg-zinc-400 hover:bg-zinc-600 ${buttonBaseStyle2}`,
    neutralLight: `bg-neutral-400 hover:bg-neutral-600 ${buttonBaseStyle2}`,
    stoneLight: `bg-stone-400 hover:bg-stone-600 ${buttonBaseStyle2}`,
    
    redLight: `bg-red-400 hover:bg-red-600 ${buttonBaseStyle2}`,
    orangeLight: `bg-orange-400 hover:bg-orange-600 ${buttonBaseStyle2}`,
    amberLight: `bg-amber-400 hover:bg-amber-600 ${buttonBaseStyle2}`,
    yellowLight: `bg-yellow-400 hover:bg-yellow-600 ${buttonBaseStyle2}`,
    limeLight: `bg-lime-400 hover:bg-lime-600 ${buttonBaseStyle2}`,
    
    greenLight: `bg-green-400 hover:bg-green-600 ${buttonBaseStyle2}`,
    emeraldLight: `bg-emerald-400 hover:bg-emerald-600 ${buttonBaseStyle2}`,
    tealLight: `bg-teal-400 hover:bg-teal-600 ${buttonBaseStyle2}`,
    cyanLight: `bg-cyan-400 hover:bg-cyan-600 ${buttonBaseStyle2}`,
    skyLight: `bg-sky-400 hover:bg-sky-600 ${buttonBaseStyle2}`,
    
    blueLight: `bg-blue-400 hover:bg-blue-600 ${buttonBaseStyle2}`,
    indigoLight: `bg-indigo-400 hover:bg-indigo-600 ${buttonBaseStyle2}`,
    violetLight: `bg-violet-400 hover:bg-violet-600 ${buttonBaseStyle2}`,
    purpleLight: `bg-purple-400 hover:bg-purple-600 ${buttonBaseStyle2}`,
    fuchsiaLight: `bg-fuchsia-400 hover:bg-fuchsia-600 ${buttonBaseStyle2}`,
    
    pinkLight: `bg-pink-400 hover:bg-pink-600 ${buttonBaseStyle2}`,
    roseLight: `bg-rose-400 hover:bg-rose-600 ${buttonBaseStyle2}`,
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
