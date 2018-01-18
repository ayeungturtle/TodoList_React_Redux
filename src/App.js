import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let nextTodoId = 7;

class TodoApp extends Component {
  render() {
    return (
      <div>
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: 'mow the lawn',
          });
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(t => 
            <li key={t.id}>
              {t.text}
            </li>
          )
          }
        </ul>
      </div>
    )
  }
};

// export default TodoApp;

// store.subscribe(render);
// render();

















// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

// export default App;
