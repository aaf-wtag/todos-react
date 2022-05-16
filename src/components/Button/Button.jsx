import React from 'react';

const Button = ({ className, imageSrc, imageAlt, imageClass, text, textClass, disabled, onClick }) => {
  return (
    <button 
      className={className} 
      onClick={onClick}
      disabled={disabled}
    >
      {imageSrc && (<img className={imageClass} src={imageSrc} alt={imageAlt} />)}
      {text && (<span className={textClass}>{text}</span>)}
    </button>
  )
};

export default Button;