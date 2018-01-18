import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const todo = (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return {
            id: action.id,
            text: action.text,
            completed: false
        };
      case 'TOGGLE_TODO':
        if(state.id !== action.id) {
            return state;
          }
          return {
            ...state,
            completed: !state.completed
          };
      default:
        return state;
    }
};
  
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => {
                return todo(t, action);
            });
        default:
        return state;
    };
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};


const todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter,
});

const store = createStore(todoApp);

const FilterLink = ({filter, currentFilter, children}) => {
    if (filter === currentFilter) {
        return (<span>{children}</span>)
    } else {
        return (
            <a href='#'
                onClick = {e => {
                    e.preventDefault();
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter
                    });
                }}
            >
                {children}
            </a>
        )
    }
}

const filterTodos = (todos) => {
    switch (store.getState().visibilityFilter) {
        case 'SHOW_ALL':
            return todos
        case 'SHOW_COMPLETED':
            return todos.filter(todo => todo.completed)
        case 'SHOW_ACTIVE':
            return todos.filter(todo => !todo.completed)
    }
}

let nextTodoId = 7;

class TodoApp extends React.Component {
    render() {
        var filteredTodos = filterTodos(this.props.todos);

        return (
        <div>
            <input ref={node => {
                this.input = node;
            }} />
            <button onClick={() => {
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text: this.input.value + nextTodoId,
                });
                this.input.value = '';
            }}>
                Add Todo
            </button>
            <ul>
                {filteredTodos.map(todo => 
                    <li key={todo.id} 
                        onClick={() =>
                            store.dispatch({
                                type:'TOGGLE_TODO',
                                id: todo.id,
                            })
                        }
                        style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}>
                        {todo.text}
                    </li>
                )}
            </ul>
            <p>
                Show:
                {' '}
                <FilterLink filter = 'SHOW_ALL' currentFilter = {store.getState().visibilityFilter}>
                    All
                </FilterLink>

                {' '}
                <FilterLink filter = 'SHOW_ACTIVE' currentFilter = {store.getState().visibilityFilter}>
                    Active
                </FilterLink>

                {' '}
                <FilterLink filter = 'SHOW_COMPLETED' currentFilter = {store.getState().visibilityFilter}>
                    Completed
                </FilterLink>
            </p>
        </div>
        )
    }
};



const render = () => {
    ReactDOM.render(<TodoApp {...store.getState()}/>, document.getElementById('root'));
    registerServiceWorker();
}

store.subscribe(render);
render();
