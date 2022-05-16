import React, { useState } from 'react';

const TextField = ({className, displayType, placeholder, editable, text, updateDisplayText, isCompleted}) => {
  const [textValue, setTextValue] = useState(text? text : '');

  const handleChange = (e) => {
    setTextValue(prev => e.target.value);
    updateDisplayText(e.target.value);
  } 

  return (editable ?  
    (<textarea
        className={className}
        display={displayType}
        placeholder={placeholder}
        onChange={handleChange}
        value={textValue}
      /> ):
    (<p className={isCompleted ? ' completedText' : className}>{text}</p>) 
  );  
};

export default TextField;