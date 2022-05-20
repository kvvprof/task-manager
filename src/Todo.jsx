import React, { useCallback, useEffect, useRef, useState } from 'react'
import TodoItem from './TodoItem'

const Todo = () => {

  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos')) || [])
  const [displayedTodos, setDisplayedTodos] = useState(todos)
  const [currentTodo, setCurrentTodo] = useState('')
  const [filterValue, setFilterValue] = useState(localStorage.getItem('todoFilter') || 'all')
  const [newTodo, setNewTodo] = useState('')
  const [stats, setStats] = useState({ all: 0, active: 0, complited: 0 })
  const [selectAll, setSelectAll] = useState(true)
  const inputRef = useRef()

  const setAll = () => setFilterValue('all')

  const setActive = () => setFilterValue('active')

  const setComplited = () => setFilterValue('complited')

  const deleteComplited = () => {
    setSelectAll(true)
    setTodos(todos.filter(todo => todo.complited !== true))
  }

  const showStats = useCallback(() => {
    let complited = 0
    todos.map(el => {
      if (el.complited === true) {
        complited += 1
      }
      return el
    })
    setStats({ all: todos.length, active: todos.length - complited, complited: complited })
  }, [todos])

  const compliteAll = () => {
    let select = selectAll
    if (stats.all === stats.complited) {
      select = false
    }
    setTodos(todos.map(todo => {
      if (select === true) {
        return { ...todo, complited: true }
      } else {
        return { ...todo, complited: false }
      }
    }))
    setSelectAll(!select)
  }

  const filterTodos = useCallback(() => {
    switch (filterValue) {
      case 'all':
        setDisplayedTodos(todos)
        localStorage.setItem('todoFilter', 'all')
        break
      case 'active':
        setDisplayedTodos(todos.filter(todo => todo.complited !== true))
        localStorage.setItem('todoFilter', 'active')
        break
      case 'complited':
        setDisplayedTodos(todos.filter(todo => todo.complited !== false))
        localStorage.setItem('todoFilter', 'complited')
        break
      default:
        setDisplayedTodos(todos)
        localStorage.setItem('todoFilter', 'all')
    }
  }, [todos, filterValue])

  const setTodo = (event) => {
    setNewTodo(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const addTodoByEnter = (event) => {
    if (event.key === 'Enter') {
      if (newTodo.trim() !== '') {
        const currentTodo = { id: Date.now(), text: newTodo.trim(), complited: false, order: todos.length + 1 }
        setTodos([...todos, currentTodo])
        setNewTodo('')
      }
    }
  }

  const addTodoByClick = () => {
    if (newTodo.trim() !== '') {
      const currentTodo = { id: Date.now(), text: newTodo.trim(), complited: false, order: todos.length + 1 }
      setTodos([...todos, currentTodo])
      setNewTodo('')
      inputRef.current.focus()
    }
  }

  const updateTodo = (event, id) => {
    setTodos(todos.map(todo => {
      if (id === todo.id) {
        return { ...todo, text: event.target.value }
      }
      return todo
    }))
  }

  const deleteTodo = (id) => {
    const newTodos = todos
      .filter(todo => todo.id !== id)
      .map((todo, index) => ({ ...todo, order: index + 1 }))
    setTodos(newTodos)
  }

  const isComplited = (id) => {
    setTodos(todos.map(todo => {
      if (id === todo.id) {
        return { ...todo, complited: !todo.complited }
      }
      return todo
    }))
    setSelectAll(true)
  }

  const dragStartHandler = (order, id) => {
    setCurrentTodo({ id: id, order: order })
  }

  const dragEndHandler = (event) => {
    event.currentTarget.style.border = '1px solid white'
    event.currentTarget.style.borderBottom = '1px solid #EFD0DC'
  }

  const dragOverHandler = (event) => {
    event.preventDefault()
    event.currentTarget.style.border = '1px solid #6F6D79'
  }

  const dropHandler = (event, id, order) => {
    event.preventDefault()
    event.currentTarget.style.border = '1px solid white'
    event.currentTarget.style.borderBottom = '1px solid #EFD0DC'
    setTodos(todos.map(todo => {
      if (todo.id === currentTodo.id) {
        return { ...todo, order: order }
      }
      if (todo.id === id && todo.order > currentTodo.order) {
        return { ...todo, order: todo.order - 1 }
      }
      if (todo.id === id && todo.order < currentTodo.order) {
        return { ...todo, order: todo.order + 1 }
      }
      if (todo.id !== id && todo.id !== currentTodo.id && todo.order < order) {
        return { ...todo, order: todo.order - 1 }
      }
      if (todo.id !== id && todo.id !== currentTodo.id && todo.order > order) {
        return { ...todo, order: todo.order + 1 }
      }
      return todo
    }))
  }

  const upTodo = (order) => { 
    setTodos(todos.map(todo => {
      if (todo.order === order && todo.order > 1 ) {
        return {...todo, order: todo.order - 1}
      }

      if (todo.order === order - 1) {
        return {...todo, order: todo.order + 1}
      }

      return todo
    }))

   }

  const sortTodos = (a, b) => {
    if (a.order > b.order) {
      return 1
    } else {
      return -1
    }
  }

  useEffect(() => {
    showStats()
    filterTodos()
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos, filterTodos, showStats])

  useEffect(filterTodos, [filterValue, filterTodos])

  return (
    <div className="todo">
      <div className="container">
        <h1 className="todo__title">Менеджер задач</h1>
        <div className="todo__filter">
          {filterValue === 'all'
            ? < button className="filter-btn filter-btn--active" onClick={setAll}>Все ({stats.all})</button>
            : < button className="filter-btn" onClick={setAll}>Все ({stats.all})</button>
          }
          {filterValue === 'active'
            ? <button className="filter-btn filter-btn--active" onClick={setActive}>Активные ({stats.active})</button>
            : <button className="filter-btn" onClick={setActive}>Активные ({stats.active})</button>
          }
          {filterValue === 'complited'
            ? <button className="filter-btn filter-btn--active" onClick={setComplited}>Завершенные ({stats.complited})</button>
            : <button className="filter-btn" onClick={setComplited}>Завершенные ({stats.complited})</button>
          }
          {stats.complited > 0
            ? <img className="filter-btn filter-btn--delete filter-btn--hide" src="./images/delete-all.png" alt="" srcSet="" title="Удалить все завершенные" onClick={deleteComplited} />
            : <img className="filter-btn filter-btn--delete" src="./images/delete-all.png" title="Удалить все завершенные" alt="" srcSet="" onClick={deleteComplited} />
          }
        </div>

        <div className="input">
          <form className="input__form" action="" onSubmit={handleSubmit}>
            <img className="input__img input__img--sm input__img--check" src="./images/select-all.png" alt="" srcSet="" onClick={compliteAll} />
            <input
              className="input__add"
              type="text"
              maxLength={180}
              placeholder="Что нужно сделать?"
              value={newTodo}
              ref={inputRef}
              onKeyDown={(event) => addTodoByEnter(event)}
              onChange={setTodo}
              autoFocus />
            <button className="input__img" type="submit" onClick={addTodoByClick}></button>
          </form>
        </div>
        {
          displayedTodos.sort(sortTodos).map(todo =>
            <TodoItem
              order={todo.order}
              key={todo.id}
              id={todo.id}
              text={todo.text}
              upTodo={upTodo}
              complited={todo.complited}
              deleteTodo={deleteTodo}
              isComplited={isComplited}
              updateTodo={updateTodo}
              dragStartHandler={dragStartHandler}
              dragEndHandler={dragEndHandler}
              dragOverHandler={dragOverHandler}
              dropHandler={dropHandler}
            />
          )
        }
      </div>
      <footer className='todo__footer'>
        <h3 className='todo__text todo__text--mobile'>Потяните за свободную область, чтобы переместить задачу</h3>
        <h3 className='todo__text'> Разработал
          <a className='todo__text-link' href="https://t.me/kvvprof" target="blank"> @kvvprof</a>
        </h3>
      </footer>
    </div >
  )
}

export default Todo