import React from 'react';

const Toast = ({isSuccessful}) => {
  return (
    <li 
      className={'toast animateToast' + isSuccessful ? 'toastSuccess' : 'toastFail' }
    >
      {isSuccessful && (<span>{'\u2713 Changes are saved successfully'}</span>)}
      {!isSuccessful && (<span>{"We couldn't save your change"}</span>)}
    </li>
  );
};

export default Toast;
