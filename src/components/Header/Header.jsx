import { useContext } from 'react';
import React from 'react';
import Button from '../Button';
import SearchField from '../SearchField';
import todosLogo from '../../images/todos_logo.svg';
import searchIcon from '../../images/search.svg';
import { AppContext } from '../../App';

const Header = () => {
  const {searchFieldOn, setSearchFieldOn, setSearchText} = useContext(AppContext);

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
