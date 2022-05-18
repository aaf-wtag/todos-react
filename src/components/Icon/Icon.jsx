import React from 'react';

const Icon = ({ imageSrc, imageAlt, imageClass, text, textClass, isEmptyIcon }) => {

  const emptyIcon = (
    <div className='emptyTodoContainer'>
      <div className='emptyTodoImageContainer'>
        <img src={imageSrc} alt={imageAlt} />
      </div>
      <div className='emptyTodoTextContainer'>
        <p className={textClass}>{text}</p>
      </div>
    </div>
  )

  if (isEmptyIcon) return emptyIcon;
  
  return (
    <div>
      <img className={imageClass} src={imageSrc} alt={imageAlt} />
      {text && (<span className={textClass}>{text}</span>)}
    </div>
  )
};

export default Icon;
