import React from 'react';

const TextField = ({className, searchFieldOn}) => {
  return (
    <input 
    className={className}
    type="text" 
    display={searchFieldOn ? "inline-flex" : "none"}
    placeholder="What are you looking for?"
    />
  )
};

export default TextField;
