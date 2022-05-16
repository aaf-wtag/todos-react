import { useState } from 'react';
import React from 'react';
import Button from '../Button';
import SearchField from '../SearchField';
import todosLogo from '../../images/todos_logo.svg';
import searchIcon from '../../images/search.svg';

const Header = ({searchFieldOn, setSearchFieldOn, searchText, setSearchText}) => {
  const handleToggleSearchField = () => {
    setSearchFieldOn(!searchFieldOn);
    setSearchText('');
  };

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
        {(searchFieldOn && (
          <SearchField
            className='searchField'
            placeholder="What are you looking for?"
            searchText={searchText}
            setSearchText={setSearchText}
         />)
        )}
        
        <Button 
          className="searchButton buttonIcon"
          imageSrc={searchIcon}  
          imageAlt="Search Button"
          onClick = {handleToggleSearchField}
        />
      </div>
    </header>
  )
};

export default Header;
