import React, { Component } from "react";
import moment from "moment";
import shortid from "shortid";

import TaskList from "./components/TaskList";
import Status from "./components/Status";
import "./App.css";
import TaskForm from "./components/TaskForm";

class App extends Component {
  defaultState = {
    taskAtHand: {
      start: undefined,
      name: "",
      end: undefined
    },
    allTasks: localStorage.getItem("youteasea")
      ? JSON.parse(localStorage.getItem("youteasea"))
      : []
  };
  state = this.defaultState;

  componentDidMount() {
    this.input.focus();
  }

  addEndTime = () => {
    if (localStorage.getItem("youteasea")) {
      const tasks = JSON.parse(localStorage.getItem("youteasea")).map(task => {
        if (task.id === this.state.taskAtHand.id) {
          return {
            ...task,
            end: this.state.taskAtHand.end
          };
        }
        return task;
      });
      localStorage.setItem("youteasea", JSON.stringify(tasks));
      this.setState(this.defaultState);
      this.setState({ allTasks: tasks });
    }
  };

  findHashtags = searchText =>
    searchText
      .split(" ")
      .filter(v => v.startsWith("#"))
      .map(tag => tag.replace("#", ""));
  getInvoiceTags = searchText =>
    searchText
      .split(" ")
      .filter(v => v.startsWith("invoice:"))
      .map(tag => tag.replace("invoice:", ""));

  setTask = e => {
    this.setState(
      {
        ...this.state,
        taskAtHand: {
          ...this.state.taskAtHand,
          id: shortid.generate(),
          start: moment(),
          tags: this.findHashtags(this.state.taskAtHand.name)
        }
      },
      () => {
        if (localStorage.getItem("youteasea")) {
          const tasks = JSON.parse(localStorage.getItem("youteasea"));
          tasks.push(this.state.taskAtHand);
          this.setState({ allTasks: tasks });
          localStorage.setItem("youteasea", JSON.stringify(tasks));
        } else {
          localStorage.setItem(
            "youteasea",
            JSON.stringify([this.state.taskAtHand])
          );
          this.setState({ allTasks: [this.state.taskAtHand] });
        }
      }
    );
  };

  createInvoice = tags => {
    const allTasks = JSON.parse(localStorage.getItem("youteasea"));
    let accuTime = 0;
    allTasks.forEach(task => {
      task.tags.length &&
        tags.forEach(tag => {
          if (task.tags.indexOf(tag) > -1) {
            accuTime =
              accuTime +
              moment.duration(moment(task.end).diff(task.start)).asMinutes();
          }
        });
    });

    return accuTime;
  };

  handleRemove = id => {
    const allTasks = JSON.parse(localStorage.getItem("youteasea")).filter(
      task => task.id !== id
    );

    localStorage.setItem(
      "youteasea",
      JSON.stringify(
        allTasks
      )
    );

    this.setState({allTasks});
  };

  handleSubmit = e => {
    e.preventDefault();
    if(this.state.invoice) {
      this.setState({
        ...this.state,
        taskAtHand: this.defaultState.taskAtHand,
        invoice: undefined
      });

      return null;
    }

    if (!this.state.taskAtHand.start) {
      if (this.getInvoiceTags(this.state.taskAtHand.name).length) {
        this.setState({
          invoice: this.createInvoice(this.getInvoiceTags(this.state.taskAtHand.name))
        });
      } else {
        this.setTask(e);
      }
    } else {
      this.setState(
        {
          ...this.state,
          taskAtHand: {
            ...this.state.taskAtHand,
            end: moment()
          }
        },
        this.addEndTime
      );
    }
  };

  render() {
    return (
      <div className="App">
        <div>
          <TaskForm
            onSubmit={e => this.handleSubmit(e)}
            value={this.state.invoice || this.state.taskAtHand.name}
            getInputRef={ref => (this.input = ref)}
            onChange={e => {
              this.setState({
                ...this.state,
                taskAtHand: {
                  ...this.state.taskAtHand,
                  name: e.target.value
                }
              });
            }}
          />
          <Status
            text={
              this.state.taskAtHand.start &&
              this.state.taskAtHand.start.format("HH:mm")
            }
          />
        </div>
        <TaskList tasks={this.state.allTasks} onRemove={this.handleRemove} />
      </div>
    );
  }
}

export default App;
