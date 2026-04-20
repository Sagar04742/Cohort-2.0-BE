import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);

  function fetchData() {
    axios.get("https://day8-backend.onrender.com/api/notes").then((res) => {
      setNotes(res.data.notes);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    const { title, description } = e.target.elements;

    axios
      .post("https://day8-backend.onrender.com/api/notes", {
        title: title.value,
        description: description.value,
      })
      .then((res) => {
        console.log(res.data);
        fetchData(); // ✅ refresh after add
      });
  }

  function deleteHandler(noteId) {
    axios
      .delete("https://day8-backend.onrender.com/api/notes/" + noteId)
      .then(() => {
        fetchData(); // ✅ refresh after delete
      });
  }

  return (
    <>
      <form onSubmit={submitHandler}>
        <input name="title" type="text" placeholder="Enter title..." />
        <input
          name="description"
          type="text"
          placeholder="Enter description..."
        />
        <button>Submit</button>
      </form>

      <div className="notes">
        {notes.map((elem) => {
          return (
            <div className="note" key={elem._id}>
              <h1>{elem.title}</h1>
              <p>{elem.description}</p>

              {/* ✅ FIXED */}
              <button
                className="dlt"
                onClick={() => deleteHandler(elem._id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;