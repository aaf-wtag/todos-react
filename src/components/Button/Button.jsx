import React from 'react';

const Button = ({ className, imageSrc, imageAlt, imageClass, text, textClass }) => {
  const onClick = () => {
    console.log("headerTitle clicked");
  }

  return (
    <button className={className} onClick={onClick}>
      {imageClass && (<img className={imageClass} src={imageSrc} alt={imageAlt} />)}
      {text && (<span className={textClass}>{text}</span>)}
    </button>
  )
};

export default Button;
