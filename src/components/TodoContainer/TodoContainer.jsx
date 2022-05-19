import React from 'react';
import { useState, useEffect } from 'react';
import createImg from '../../images/create.svg';
import emptyImg from '../../images/empty.svg';
import Tag from '../Tag';
import Button from '..//Button';
import Icon from '../Icon';
import TodoCard from '../TodoCard';
import supabase from "../../supabaseClient";

const TodoContainer = ({ todos, setTodos, showMainBodySpinner, setShowMainBodySpinner,
  setToasts, createToast, numberOfTodosToShow, setNumberOfTodosToShow, isTodoListEmpty, setIsTodoListEmpty, 
  setFilterType, loadMorePresent, setLoadMorePresent, dataIncrement }) => {

  const [isEmptyCardCreated, setIsEmptyCardCreated] = useState(false);

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
        setTodos([newTodo, ...todos]);
        setIsEmptyCardCreated(false); 
      }
    };
  ;}

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

  const determineState = (saved, completed) => {
    if (saved && !completed) return "incomplete";
    else if (!saved && !completed) return "editing";
    else if (completed) return "complete";
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
        setToasts={setToasts}
      />
    )
  );

  return (
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
  )
}

export default TodoContainer
