import React, { useContext } from 'react';
import { useState } from 'react';
import Button from '../Button';
import TextField from '../TextField';
import Tag from '../Tag';
import deleteImg from '../../images/delete.svg';
import doneImg from '../../images/done.svg';
import editImg from '../../images/edit.svg';
import supabase from '../../supabaseClient';
import Spinner from '../Spinner';
import { AppContext } from '../../App';

const TodoCard = ({ todo, cardState, handleAdd, handleDelete, 
  updateDataInTodos, setIsEmptyCardCreated}) => {
    
  const {createToast} = useContext(AppContext);
  const isTextEditable = (cardState === 'empty' || cardState === 'editing');
  const textClass = (isTextEditable) ? 'inputText' : 'uneditableText';
  
  const [isAddDisabled, setisAddDisabled] = useState(false);
  const [displayText, setDisplayText] = useState(todo ? todo.text : '');
  const [showCardSpinner, setShowCardSpinner] = useState(false);
  
  const calculateElapsedTime = (startDateString, endDate) => {
    if (!endDate) return -1;

    const start = new Date(startDateString);
    const end = new Date(endDate);
  
    const startInMs = Number(start);
    const endInMs = Number(end);
  
    return Math.round((endInMs - startInMs) / (24 * 3600 * 1000));
  }

  const [elapsedTime, setElapsedTime] = useState( cardState === 'empty' ? -1 :
    calculateElapsedTime(todo.created_at, todo.completed_at));

  const toDateString = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `Created At: ${day}.${month}.${year.substring(2, 4)}`;
  }

  const onAdd = () => {
    setisAddDisabled(true);
    handleAdd(displayText.trim());
  }

  const updateCompletedState = async (id, val) => {
    const { data, error } = await supabase
      .from('todo_table')
      .update({ completed: val })
      .match({ id: id });
    return { data, error };
  }

  const updateCompletedAt = async (id, val) => {
    const { data, error } = await supabase
      .from('todo_table')
      .update({ completed_at: val })
      .match({ id: id });
    return { data, error };
  }

  const handleDone = async() => {
    setShowCardSpinner(true);
    const updatedState = await updateCompletedState(todo.id, true);
    if (updatedState.error) {
      createToast(false);
    }
    else {
      createToast(true);
      const completionTime = new Date(Date.now());
      const { data, error } = await updateCompletedAt(todo.id, completionTime);
      if (error) createToast(false);
      else {
        createToast(true);
        setElapsedTime(prev => calculateElapsedTime(todo.created_at, completionTime));
        updateDataInTodos(data);
      }
    }
    setShowCardSpinner(false);
  }

  const updateSavedState = async (id, val) => {
    const { data, error } = await supabase
      .from('todo_table')
      .update({ saved: val })
      .match({ id: id });

    return { data, error };
  }

  const handleEdit = async() => {
    setShowCardSpinner(true);
    const {data, error} = await updateSavedState(todo.id, false);
    if (error) createToast(false);
    else {
      createToast(true);
      updateDataInTodos(data);
    }
    setShowCardSpinner(false);
  }

  const updateText = async (id, val) => {
    const { data, error } = await supabase
      .from('todo_table')
      .update({ text: val })
      .match({ id: id });
    return {data, error};
  }

  const handleSave = async() => {
    if (displayText) {
      setShowCardSpinner (true);
      const updatedState = await updateText(todo.id, displayText);
      if (updatedState.error) createToast(false);
      else {
        createToast(true);
        const { data, error } = await updateSavedState(todo.id, true);
        if (error) createToast(false);
        else {
          createToast(true);
          updateDataInTodos(data);
        }
      }
      setShowCardSpinner(false);
    }
  }

  const onDelete = () => {
    todo ? handleDelete(todo.id) :
    setIsEmptyCardCreated(false);
  }

  return (
    <li className={`cardItem ${showCardSpinner && "lowerOpacity"}`}>
      {showCardSpinner && (
        <Spinner className='cardSpinnerContainer'/>
      )}
      <TextField 
        className={textClass}
        displayType='block'
        placeholder='What do you want to do?'
        editable={isTextEditable}
        text={todo? todo.text : ''}
        displayText={displayText}
        setDisplayText={setDisplayText}
        onAdd={onAdd}
        handleSave={handleSave}
        isCompleted={todo? todo.completed : false} 
      />

      {(cardState !== 'empty') &&
        <Tag 
          className='timestamp'
          text={toDateString(todo.created_at)}
          showTag={true}
        />
      }

      <footer className='cardItemFooter'>
        <div className='todoButtonsContainer'>
          {(cardState === 'empty') &&
            <Button 
              className='addTaskButton'
              text="Add Task"
              textClass="addTaskText"
              onClick={onAdd}
              disabled={isAddDisabled}
            />  
          } 
          {(cardState === 'editing') &&
            <Button 
              className='saveButton'
              text="Save"
              textClass="saveText"
              onClick = {handleSave}
            />
          }
          {(cardState === 'incomplete' || cardState === 'editing') &&
            <Button 
              className='doneButton buttonIcon'
              imageSrc={doneImg}
              imageAlt="done button"
              onClick = {handleDone}
            />
          }
          {(cardState === 'incomplete') &&
            <Button
              className='editButton buttonIcon'
              imageSrc={editImg}
              imageAlt="edit button"
              onClick = {handleEdit}
            />
          }
          <Button 
            className="deleteButton buttonIcon"
            imageSrc={deleteImg}
            imageAlt="delete button"
            onClick = {onDelete}
          />
          {(cardState === 'complete') &&
            <Tag 
              className='durationText'
              text={`Completed in ${elapsedTime} days`}
              showTag={true}
            />
          }
        </div>
      </footer>
    </li>
  );
};

export default TodoCard;
