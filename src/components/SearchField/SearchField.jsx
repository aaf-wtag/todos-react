import React, { useContext } from 'react'
import { AppContext } from '../../App';

const SearchField = ({ className, placeholder }) => {
  const {setSearchText} = useContext(AppContext);
  
  const debounce = (fn, delay) => {
    let timer;
  
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  const handleChange = debounce((e) => {
    setSearchText(e.target.value);
  }, 500);

  return (
    <input 
      className={className}
      placeholder={placeholder}
      autoFocus
      onChange={handleChange}
    />
  )
}

export default SearchField;