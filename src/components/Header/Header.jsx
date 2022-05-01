import { useState } from 'react';
import React from 'react';
import Button from '../Button';
import TextField from '../TextField';
import todosLogo from '/Users/akib.fahad/Desktop/todo-list-app/src/images/todos_logo.svg';

const Header = () => {
  const [searchFieldOn, setSearchFieldOn] = useState(false);

  return (
    <header className='header'>
      <Button 
        className="headerTitle" 
        imageSrc={todosLogo}  
        imageAlt="Todos Logo"
        imageClass="headerTitleImage"
        text="Todos"
        textClass="headerTitleText"
      />

      { searchFieldOn && (
        <TextField 
          className='searchField'
        />
      )}

      <Button 
        className="search"
      />

    </header>
  )
};

export default Header;
