import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

const TodoItem = ({
  id,
  order,
  text,
  complited,
  deleteTodo,
  isComplited,
  updateTodo,
  upTodo,
  dragStartHandler,
  dragEndHandler,
  dragOverHandler,
  dropHandler
}) => {
  return (
    <div
      className="input"
      draggable
      onDragStart={() => dragStartHandler(order, id)}
      onDragLeave={(event) => dragEndHandler(event)}
      onDragEnd={(event) => dragEndHandler(event)}
      onDragOver={(event) => dragOverHandler(event)}
      onDrop={(event) => dropHandler(event, id, order)}
    >
      {complited === true
        ? <button className="input__checkbox input__checkbox--checked" onClick={() => isComplited(id)}></button>
        : <button className="input__checkbox" onClick={() => isComplited(id)}></button>
      }
      {complited === true
        ? <TextareaAutosize
          className="input__add input__add--strike input__add--sm"
          defaultValue={text}
          onChange={(event) => updateTodo(event, id)}
        />
        : <TextareaAutosize
          className="input__add input__add--sm"
          defaultValue={text}
          onChange={(event) => updateTodo(event, id)}
        />
      }
      <img className="input__img input__img--mobile" src="./images/arrow.png" alt="" srcSet="" onClick={() => upTodo(order)} />
      <img className="input__img input__img--sm" src="./images/delete.png" alt="" srcSet="" onClick={() => deleteTodo(id)} />
    </div>
  )
}

export default TodoItem