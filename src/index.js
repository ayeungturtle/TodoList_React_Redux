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

const FilterLink = ({filter, currentFilter, children, onFilterClick}) => {
    if (filter === currentFilter) {
        return (<span>{children}</span>)
    } else {
        return (
            <a href='#'
                onClick = {e => {
                    e.preventDefault();
                    onFilterClick(filter);
                }}
            >
                {children}
            </a>
        )
    }
}

const TodoItem = ({onClick, completed, text}) => {
    return (
        <li
            onClick={onClick}
            style={{
                textDecoration: completed ? 'line-through' : 'none'
            }}>
            {text}
        </li>
    )
}

const handleTodoClick = (id) => {
    store.dispatch({
        type:'TOGGLE_TODO',
        id: id,
    })
}

const filterTodos = (todos, visibilityFilter) => {
    switch (visibilityFilter) {
        case 'SHOW_ALL':
            return todos
        case 'SHOW_COMPLETED':
            return todos.filter(todo => todo.completed)
        case 'SHOW_ACTIVE':
            return todos.filter(todo => !todo.completed)
    }
}

const AddTodo = ({onAddClick}) => {
    return(
        <div>
            <input ref={node => {
                    this.input = node;
                }} />
            <button onClick={() => {
                onAddClick(this.input);
                this.input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    )
}

const VisibilityFilters = ({visibilityFilter, onFilterClick}) => {
    return(
        <p>
            Show:
            {' '}
            <FilterLink filter = 'SHOW_ALL' currentFilter = {visibilityFilter} onFilterClick = {onFilterClick}>
                All
            </FilterLink>

            {' '}
            <FilterLink filter = 'SHOW_ACTIVE' currentFilter = {visibilityFilter} onFilterClick = {onFilterClick}>
                Active
            </FilterLink>

            {' '}
            <FilterLink filter = 'SHOW_COMPLETED' currentFilter = {visibilityFilter} onFilterClick = {onFilterClick}>
                Completed
            </FilterLink>
        </p>
    )
}

let nextTodoId = 7;

const TodoApp = ({todos, visibilityFilter}) => {
        var filteredTodos = filterTodos(todos, visibilityFilter);

        return (
        <div>
            <AddTodo
                onAddClick={(input) => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        id: nextTodoId++,
                        text: input.value,
                    });
                }}
            />
            <ul>
                {filteredTodos.map(todo => 
                    <TodoItem onClick={() => handleTodoClick(todo.id)} completed={todo.completed} text={todo.text}/>
                )}
            </ul>
            <VisibilityFilters 
                visibilityFilter={visibilityFilter}
                onFilterClick={(filter) => {
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter
                    })
                }}
            />
        </div>
        )
};



const render = () => {
    ReactDOM.render(<TodoApp {...store.getState()}/>, document.getElementById('root'));
    registerServiceWorker();
}

store.subscribe(render);
render();
