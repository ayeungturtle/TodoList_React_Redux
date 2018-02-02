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

const FilterLink = ({active, children, onFilterClick}) => {
    if (active) {
        return (<span>{children}</span>)
    } else {
        return (
            <a href='#'
                onClick = {e => {
                    e.preventDefault();
                    onFilterClick();
                }}
            >
                {children}
            </a>
        )
    }
}

class FilterLinkContainer extends React.Component {
    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(() => 
            this.forceUpdate()
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        const props = this.props;
        const state = props.store.getState();

        return (
            <FilterLink 
                active = {
                    props.filter === state.visibilityFilter
                }
                onFilterClick = {() =>
                    props.store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    })
                }
            >
            {props.children}
            </FilterLink>
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

const AddTodo = ({onAddClick, store}) => {
    return(
        <div>
            <input ref={node => {
                    this.input = node;
                }} />
            <button onClick={() => {
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text: this.input.value,
                 });
                this.input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    )
}

const Footer = ({store}) => {
    return(
        <p>
            Show:
            {' '}
            <FilterLinkContainer store={store} filter = 'SHOW_ALL'>
                All
            </FilterLinkContainer>

            {' '}
            <FilterLinkContainer store={store} filter = 'SHOW_ACTIVE'>
                Active
            </FilterLinkContainer>

            {' '}
            <FilterLinkContainer store={store} filter = 'SHOW_COMPLETED'>
                Completed
            </FilterLinkContainer>
        </p>
    )
}

const TodoList = ({filteredTodos, handleClick}) => {
    return (
        <ul>
            {filteredTodos.map(todo => 
                <TodoItem onClick={() => handleClick(todo.id)} completed={todo.completed} text={todo.text}/>
            )}
        </ul>
    )
}

class TodoListContainer extends React.Component {
    handleTodoClick = (id) => {
        this.props.store.dispatch({
            type:'TOGGLE_TODO',
            id: id,
        })
    }
    
    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(() => 
        this.forceUpdate()
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    
    render() {
        var filteredTodos = filterTodos(this.props.store.getState().todos, this.props.store.getState().visibilityFilter);
        
        return (
            <TodoList 
                filteredTodos={filteredTodos}
                handleClick={(id) => {
                    this.handleTodoClick(id)
                }}
            />
        )
    }
}

let nextTodoId = 7;

const TodoApp = ({store}) => {
        return (
            <div>
                <AddTodo store={store}/>
                <TodoListContainer store={store}/>
                <Footer store={store}/>
            </div>
        )
};

ReactDOM.render(<TodoApp store={createStore(todoApp)}/>,
document.getElementById('root'));



