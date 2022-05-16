import React, { useEffect } from 'react'

const SearchField = ({ className, placeholder, setSearchText }) => {

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
      onChange={handleChange}
    />
  )
}

export default SearchField;