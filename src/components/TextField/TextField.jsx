import React, { useState } from 'react';

const TextField = ({className, displayType, placeholder, editable, text, onAdd, handleSave, updateTextState, isCompleted}) => {
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
        autoFocus
        onFocus={(e) => {
          const val = e.target.value;
          e.target.value = '';
          e.target.value = val;
        }}
        onChange={handleChange}
        onKeyPress={(e) => {
          if (e.key === 'Enter'){
            e.preventDefault();
            if (!text) onAdd();
            else handleSave();
          }
        }}
        value={textValue}
      /> ):
    (<p className={isCompleted ? ' completedText' : className}>{text}</p>) 
  );  
};

export default TextField;