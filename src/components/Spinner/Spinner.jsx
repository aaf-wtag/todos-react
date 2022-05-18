import React from 'react';
import spinnerImg from '../../images/spinner.svg';

const Spinner = ({className}) => {
  return (
    <div className={className}>
      <img src={spinnerImg} alt='Spinner icon' />
    </div>
  );
};

export default Spinner;
