import { useState, useEffect } from 'react';
import './App.css';
import todosLogo from './images/todos_logo.svg';
import createImg from './images/create.svg';
import Icon from './components/Icon';
import Header from './components/Header';
import Toast from './components/Toast';
import Button from './components/Button';
import Tag from './components/Tag';
import TodoCard from './components/TodoCard';
import supabase from "./supabaseClient";

const App = () => {
  const [hideMainScreen, setHideMainScreen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [isEmptyCardCreated, setIsEmptyCardCreated] = useState(false);
  const [todos, setTodos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getDataFromDB = async() => {
    const { data, error } = await supabase
        .from('todo_table')
        .select()
        // .ilike('text', `%${searchText}%`)
        .order('created_at', { ascending: false });
    return { data, error };
  }

  useEffect( async() => { 
    const { data, error } = await getDataFromDB();     
    setTodos(prev => data);
    setHideMainScreen(prev => false);
  }, []);

  const toastList = toasts
  .map(toast => (
    <Toast 
      // key ={Date.now()}
      // toastType={toastType}
      // isChangeSavedInDB={isChangeSavedInDB}
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
    setTodos(prev => editedTodos);
  }

  const handleDelete = async(id) => {
    await deleteFromDB(id);
    const remainingTodos = todos.filter(todo => id !== todo.id);
    setTodos(remainingTodos);
  }

  const todoCardsList = todos.map(
    todo => (
      <TodoCard 
        key = {todo.id}
        todo = {todo}
        cardState = {determineState(todo.saved, todo.completed)}
        setTodos = {setTodos}
        updateDataInTodos = {updateDataInTodos}
        handleDelete = {handleDelete}
      />
    )
  )

  const handleAdd = async(newText) => {
    const { data, error } = await supabase
    .from('todo_table')
    .insert([
        { text: newText, completed: false, saved: true }
    ]);
    const newTodo = data[0];
    setTodos(prev => [newTodo, ...todos]);
    setIsEmptyCardCreated(prev => false);  
  }

  const deleteFromDB = async (id) => {
    const { data, error } = await supabase
      .from('todo_table')
      .delete()
      .match({ id: id });
  }

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
        <div className='mainScreen'>
          <Header />
          <div className="toastContainer">
            <ul className='toastList'>
              {toastList}
            </ul>
          </div>
          <div className='todoContainer'>
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
                onClick={() => setIsEmptyCardCreated(prev => true)} 
              />
              <div className='filterButtonsContainer'>
                <Button
                  className="allButton"
                  text="All" 
                  textClass="allText" 
                  // onClick 
                />
                <Button
                  className="incompleteButton"
                  text="Incomplete" 
                  textClass="incompleteText" 
                  // onClick 
                />
                <Button
                  className="completeButton"
                  text="Complete" 
                  textClass="completeText" 
                  // onClick 
                />
                </div>
            </div>  
            <ul className='todoList'>
              {isEmptyCardCreated && (
                <TodoCard 
                  cardState={'empty'}
                  handleAdd={handleAdd}
                  handleDelete={handleDelete}
                  setIsEmptyCardCreated={setIsEmptyCardCreated}
                />
              )}
              {todoCardsList}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
