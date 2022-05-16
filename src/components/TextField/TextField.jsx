import React, { useState } from 'react';

const TextField = ({className, displayType, placeholder, editable, text, updateTextState, isCompleted}) => {
  const [textValue, setTextValue] = useState(text);

  const handleChange = (e) => {
    setTextValue(e.target.value);
    updateTextState(e.target.value); // not using textValue because it might not change as expected
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