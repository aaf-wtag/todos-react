import { useState, useEffect } from 'react';
import './App.css';
import todosLogo from './images/todos_logo.svg';
import Icon from './components/Icon';
import Header from './components/Header';



function App() {
  const [showMainScreen, setHideMainScreen] = useState(false);

  useEffect( () => {
    setTimeout( () => {
      setHideMainScreen(true);
    }, 2000);
  }, [showMainScreen]);

  return (
    <div className="App">
      { !showMainScreen && (
        <div className='splashScreen'>
          <Icon 
            imageSrc={todosLogo} 
            imageAlt="Todos logo" 
            imageClass="splashImage"
            text="Todos" 
            textClass="splashText"
          />
        </div>
      )}
      
      { showMainScreen && (
        <div className='mainScreen'>
          <Header />
        </div>
      )}

    </div>
  );
}

export default App;
