import React from "react";

const TaskForm = ({onChange, onSubmit, value, getInputRef}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        ref={ref => getInputRef(ref) }
        onChange={onChange}
        placeholder="What are you working on ?"
      />
    </form>
  );
};

export default TaskForm;
