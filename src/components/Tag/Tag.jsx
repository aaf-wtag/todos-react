import React from 'react'

const Tag = ({ className, text, showTag }) => {
  return (
    <p 
      className={className}
      style={{display: showTag ? 'block' : 'none'}} 
    >
      {text}
    </p>
  )
}

export default Tag
