import { useState, useEffect } from 'react';
import './App.css';
import todosLogo from './images/todos_logo.svg';
import createImg from './images/create.svg';
import emptyImg from './images/empty.svg';
import Icon from './components/Icon';
import Header from './components/Header';
import Toast from './components/Toast';
import Button from './components/Button';
import Tag from './components/Tag';
import TodoCard from './components/TodoCard';
import Spinner from './components/Spinner';
import supabase from "./supabaseClient";

const App = () => {
  const [hideMainScreen, setHideMainScreen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [isEmptyCardCreated, setIsEmptyCardCreated] = useState(false);
  const [todos, setTodos] = useState([]);
  const [searchFieldOn, setSearchFieldOn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isTodoListEmpty, setIsTodoListEmpty] = useState(true);
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

  const determineState = (saved, completed) => {
    if (saved && !completed) return "incomplete";
    else if (!saved && !completed) return "editing";
    else if (completed) return "complete";
  }

  const updateDataInTodos = ([newTodo]) => {
    const editedTodos = todos.map(
      todo => {
        if(todo.id === newTodo.id) {
          return {...todo,
            created_at: newTodo.created_at,
            completed_at: newTodo.completed_at,
            text: newTodo.text,
            completed: newTodo.completed,
            saved: newTodo.saved
          };
        };
        return todo;
      }
    );
    setTodos(editedTodos);
  }

  const handleAdd = async(newText) => {
    if (newText) {
      setShowMainBodySpinner(true);
      const { data, error } = await supabase
      .from('todo_table')
      .insert([
          { text: newText, completed: false, saved: true }
      ]);
      setShowMainBodySpinner(false);
      if (error) createToast(false);
      else{
        createToast(true);
        const newTodo = data[0];
        setTodos(prev => [newTodo, ...todos]);
        setIsEmptyCardCreated(false); 
      }
    };
  }

  const deleteFromDB = async (id) => {
    const { data, error } = await supabase
      .from('todo_table')
      .delete()
      .match({ id: id });
    return { data, error };
  }

  const handleDelete = async(id) => {
    setShowMainBodySpinner(true);
    const {data, error} = await deleteFromDB(id);
    setShowMainBodySpinner(false);
    if (error) createToast(false);
    else{
      createToast(true);
      const deletedTodo = data[0];
      const remainingTodos = todos.filter(todo => deletedTodo.id !== todo.id);
      setTodos(remainingTodos);
    }
  }

  const todoCardsList = todos.slice(0, numberOfTodosToShow.dataShown).map(
    todo => (
      <TodoCard 
        key = {todo.id}
        todo = {todo}
        cardState = {determineState(todo.saved, todo.completed)}
        setTodos = {setTodos}
        updateDataInTodos = {updateDataInTodos}
        handleDelete = {handleDelete}
        createToast={createToast}
      />
    )
  )

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
          <div className={`todoContainer ${showMainBodySpinner && "lowerOpacity"}`}>
            <Tag
              className="addTaskTag"
              text="Add Task"
            />
            <div className='initialButtonsContainer'>
              <Button 
                className="createButton"
                imageSrc={createImg} 
                imageAlt='Plus sign' 
                imageClass="createImg" 
                text="Create" 
                textClass="createText" 
                onClick={ () => {
                  setIsEmptyCardCreated(true);
                  setIsTodoListEmpty(false);
                  } 
                }
              />
              <div className='filterButtonsContainer'>
                <Button
                  className="allButton"
                  text="All" 
                  textClass="allText" 
                  disabled={isTodoListEmpty}
                  onClick={() => setFilterType('all')}
                />
                <Button
                  className="incompleteButton"
                  text="Incomplete" 
                  textClass="incompleteText" 
                  disabled={isTodoListEmpty}
                  onClick={() => setFilterType('incomplete')}
                />
                <Button
                  className="completeButton"
                  text="Complete" 
                  textClass="completeText" 
                  disabled={isTodoListEmpty}
                  onClick={() => setFilterType('complete')}
                />
                </div>
            </div>  
            <ul className='todoList'>
              {isTodoListEmpty && (
                <Icon 
                  imageSrc={emptyImg}
                  imageAlt="Empty TodoList Icon" 
                  text="You didn't add any task. Please, add one."
                  textClass='emptyTodoText'
                  isEmptyIcon={isTodoListEmpty}
                />
              )}
              {isEmptyCardCreated && (
                <TodoCard 
                  cardState={'empty'}
                  handleAdd={handleAdd}
                  handleDelete={handleDelete}
                  setIsEmptyCardCreated={setIsEmptyCardCreated}
                  createToast={createToast}
                />
              )}
              {todoCardsList}
            </ul>
            <footer className='todosDisplayController'>
              {(loadMorePresent && !isTodoListEmpty && (todos.length > dataIncrement)) && (
                <Button 
                  className='loadMore'
                  text='Load More'
                  textClass='loadMoreText'
                  onClick={ () => {
                    if (numberOfTodosToShow.dataShown < todos.length){
                      if ((numberOfTodosToShow.dataShown + dataIncrement) < todos.length)
                        setNumberOfTodosToShow({dataShown: numberOfTodosToShow.dataShown + dataIncrement});
                      else {
                        setNumberOfTodosToShow({dataShown: todos.length});
                        setLoadMorePresent(false);
                      };
                    }
                    else setLoadMorePresent(false);
                  }}
                />
              )}
              {(!loadMorePresent && !isTodoListEmpty && (todos.length > dataIncrement)) && (
                <Button 
                  className='seeLess'
                  text='See Less'
                  textClass='seeLessText'
                  onClick={ () => {
                    if (numberOfTodosToShow.dataShown > dataIncrement) {
                      if ((numberOfTodosToShow.dataShown - dataIncrement) > dataIncrement)
                        setNumberOfTodosToShow({dataShown: numberOfTodosToShow.dataShown - dataIncrement});
                      else {
                        setNumberOfTodosToShow({dataShown: dataIncrement});
                        setLoadMorePresent(true);    
                      }
                    }
                    else setLoadMorePresent(true);
                  }}
                />
              )}
            </footer>
          </div>
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
