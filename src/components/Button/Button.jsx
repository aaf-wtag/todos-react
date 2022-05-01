import React from 'react';

const Button = ({ className, imageSrc, imageAlt, imageClass, text, textClass, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {imageSrc && (<img className={imageClass} src={imageSrc} alt={imageAlt} />)}
      {text && (<span className={textClass}>{text}</span>)}
    </button>
  )
};

export default Button;
