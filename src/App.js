import React from 'react';
import Calendar from './react_project/Calendar';

//리스트 text박스
// const container = document.getElementsByClassName(
//   'fc-list-day-cushion fc-cell-shaded'
// );
// const listA = document.createElement('a');
// listA.id = 'listA';
// const newText = document.createTextNode('박스');
// listA.appendChild(newText);

// document.body.appendChild(listA);

const App = () => {
  return (
    <div>
      <Calendar></Calendar>
    </div>
  );
};

export default App;
