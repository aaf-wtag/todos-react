const TextField = ({className, displayText, setDisplayText, displayType, placeholder, editable, text, onAdd, handleSave, isCompleted}) => {

  const handleChange = (e) => {
    setDisplayText(e.target.value.trim());
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
        value={displayText}
      /> ):
    (<p className={isCompleted ? ' completedText' : className}>{text}</p>) 
  );  
};

export default TextField;