import { useState } from 'react';
import React from 'react';
import Button from '../Button';
import TextField from '../TextField';
import todosLogo from '../../images/todos_logo.svg';
import searchIcon from '../../images/search.svg';

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

      <div className='searchContainer'>
        { searchFieldOn && (
          <TextField 
            className='searchField'
            searchFieldOn={searchFieldOn}
          />
        )}

        <Button 
          className="buttonIcon"
          imageSrc={searchIcon}  
          imageAlt="Search Button"
          onClick = {() => setSearchFieldOn(!searchFieldOn)}
        />
      </div>
    </header>
  )
};

export default Header;
