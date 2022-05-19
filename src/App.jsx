import { useState, useEffect } from 'react';
import './App.css';
import todosLogo from './images/todos_logo.svg';
import Icon from './components/Icon';
import Header from './components/Header';
import Toast from './components/Toast';
import Spinner from './components/Spinner';
import TodoContainer from './components/TodoContainer';
import supabase from './supabaseClient';

const App = () => {
  const [hideMainScreen, setHideMainScreen] = useState(true);
  const [todos, setTodos] = useState([]);
  const [isTodoListEmpty, setIsTodoListEmpty] = useState(true);
  const [searchFieldOn, setSearchFieldOn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [toasts, setToasts] = useState([]);
  const [showMainBodySpinner, setShowMainBodySpinner] = useState(false);
  const dataIncrement = 8;
  const [numberOfTodosToShow, setNumberOfTodosToShow] = useState({dataShown: dataIncrement});
  const [loadMorePresent, setLoadMorePresent] = useState(true);


  const getDataFromDB = async() => {
    const { data, error } = await supabase
        .from('todo_table')
        .select()
        .ilike('text', `%${searchText}%`)
        .order('created_at', { ascending: false });
    return { data, error };
  }

  const getDataWithCompletionStatus = async (isCompleted) => {
    const { data, error } = await supabase
      .from('todo_table')
      .select()
      .match({completed : isCompleted})
      .ilike('text', `%${searchText}%`)
      .order('created_at', { ascending: false });
  
    return {data, error};
  }

  const loadTodos = async() => {
    let dataFromDB;

    setShowMainBodySpinner(true);
    if (filterType === "all")
      dataFromDB = await getDataFromDB(searchText);

    else if (filterType === "complete")
      dataFromDB = await getDataWithCompletionStatus(true);

    else if (filterType === "incomplete" )
      dataFromDB = await getDataWithCompletionStatus(false);  
    setShowMainBodySpinner(false);

    const { data, error } = dataFromDB;
    if (error) createToast(false);
    else {
      createToast(true);
      if (data.length > 0) setIsTodoListEmpty(false);
      else setIsTodoListEmpty(true);
      setTodos(data);
      setLoadMorePresent(true);
      setNumberOfTodosToShow({dataShown: dataIncrement});
      setHideMainScreen(false);
    }
  }

  useEffect( () => { 
    loadTodos();
  }, [searchText, filterType]);

  const createToast = (isDBCallSuccessful) => {
    const toast = {
      id: Date.now(),
      isSuccessful: isDBCallSuccessful,
    };
    setToasts([...toasts, toast]);
    removeToast();
  };

  const removeToast = () => {
    setTimeout(() => {
      const editedToasts = [...toasts];
      editedToasts.shift();
      setToasts(editedToasts);
    }, 2000);
  };

  const toastList = toasts
  .map(toast => (
    <Toast 
      key ={toast.id}
      isSuccessful={toast.isSuccessful}
    />
  ));

  return (
    <div className="App">
      { hideMainScreen && (
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
      
      { !hideMainScreen && (
        <div className={`mainScreen`}>
          <Header 
            searchFieldOn={searchFieldOn} 
            setSearchFieldOn={setSearchFieldOn}
            searchText={searchText}
            setSearchText={setSearchText}
          />

          <div className="toastContainer">
            <ul className='toastList'>
              {toastList}
            </ul>
          </div>

          <TodoContainer 
            todos={todos}
            setTodos={setTodos}
            showMainBodySpinner={showMainBodySpinner}
            setShowMainBodySpinner={setShowMainBodySpinner}
            numberOfTodosToShow={numberOfTodosToShow}
            setNumberOfTodosToShow={setNumberOfTodosToShow}
            isTodoListEmpty={isTodoListEmpty}
            setIsTodoListEmpty={setIsTodoListEmpty}
            loadMorePresent={loadMorePresent}
            setLoadMorePresent={setLoadMorePresent}
            dataIncrement={dataIncrement}
            setFilterType={setFilterType}
            setToasts={setToasts}
            createToast={createToast}
          />
          {showMainBodySpinner && (
            <Spinner 
              className='mainSpinnerContainer'
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
