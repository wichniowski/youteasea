import React from "react";
import moment from 'moment';
import "./TaskList.css";

const TaskList = ({ tasks, onRemove }) => (
  <ul className="taskList">
    {tasks &&
      tasks.slice().reverse().map(task => (
        <li key={task.name}>
          <p className="taskName">{task.name}</p>
          <div>
            <span className="startTime">{task.start && moment(task.start).format('HH:mm')}</span>
            {task.end && <span>:</span>}
            <span className="endTime">{task.start && moment(task.end).format('HH:mm')}</span>
            <button onClick={() => onRemove(task.id)}>x</button>
          </div>
        </li>
      ))}
  </ul>
);

export default TaskList;
