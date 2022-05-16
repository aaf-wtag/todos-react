import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import App from './App';

// const todosData = [
//   {
//     id: 1,
//     text: 'Eat',
//     created_at: "2022-05-01",
//     completed_at: null,
//     completed: false,
//     saved: true,
//   },
//   {
//     id: 2,
//     text: 'Sleep',
//     created_at: "2022-05-02",
//     completed_at: null,
//     completed: false,
//     saved: false,
//   },
//   {
//     id: 3,
//     text: 'Wake',
//     created_at: "2022-05-01",
//     completed_at: "2022-05-02",
//     completed: true,
//     saved: true,
//   },
// ]


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
