import React from 'react';

const Icon = ({ imageSrc, imageAlt, imageClass, text, textClass }) => {
  return (
    <div>
      <img className={imageClass} src={imageSrc} alt={imageAlt} />
      {text && (<span className={textClass}>{text}</span>)}
    </div>
  )
};

export default Icon;
