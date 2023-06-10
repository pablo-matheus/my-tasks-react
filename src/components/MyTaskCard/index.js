import { useState, useEffect } from "react";
import { BsTrash, BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";

import config from "../../config.json";

import "./index.css";

function MyTaskCard() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(config.apiUrl + "/tasks")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setTasks(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = {
      id: Math.random(),
      title,
      dueDate,
      done: false,
    };

    await fetch(config.apiUrl + "/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTasks((prevState) => [...prevState, task]);

    setTitle("");
    setDueDate("");
  };

  const handleDelete = async (id) => {
    await fetch(config.apiUrl + "/tasks/" + id, {
      method: "DELETE",
    });

    setTasks((prevState) => prevState.filter((task) => task.id !== id));
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const handleEdit = async (task) => {
    task.done = !task.done;

    const data = await fetch(config.apiUrl + "/tasks/" + task.id, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTasks((prevState) =>
      prevState.map((task) => (task.id === data.id ? (task = data) : task))
    );
  };

  return (
    <div className="Task-Card">
      <div className="Task-Card-Header">
        <h1>My Tasks</h1>
      </div>
      <div className="Task-Form">
        <h2>Insert your next task:</h2>
        <form onSubmit={handleSubmit}>
          <div className="Form-Control">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              name="title"
              placeholder="What do you have to do?"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            ></input>
          </div>
          <div className="Form-Control">
            <label htmlFor="due-date">Due Date:</label>
            <input
              type="text"
              name="due-date"
              placeholder="What is the due date?"
              onChange={(e) => setDueDate(e.target.value)}
              value={dueDate || ""}
              required
            ></input>
          </div>
          <input type="submit" value="Create Task"></input>
        </form>
      </div>
      <div className="Task-List">
        <h2>Task list:</h2>
        {tasks.length === 0 && <p>You don't have tasks!</p>}
        {tasks.map((task) => (
          <div className="Task" key={task.id}>
            <h3 className={task.done ? "Task-Done" : ""}>{task.title}</h3>
            <p>Due Date: {task.dueDate}</p>
            <div className="Actions">
              <span onClick={() => handleEdit(task)}>
                {!task.done ? (
                  <BsCheckCircle></BsCheckCircle>
                ) : (
                  <BsCheckCircleFill></BsCheckCircleFill>
                )}
              </span>
              <BsTrash onClick={() => handleDelete(task.id)}></BsTrash>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTaskCard;
