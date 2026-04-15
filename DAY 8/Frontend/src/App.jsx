import React from "react";
import { useState } from "react";
import axios from 'axios'



const App = () => {
  const [notes, setNotes] = useState([
    { title: "text 1 ", description: "description 1" },
    { title: "text 2 ", description: "description 2" },
    { title: "text 3 ", description: "description 3" },
  ]);

  axios.get('http://localhost:3000/api/notes')
  .then((res)=>{
    setNotes(res.data.notes)
  })

  return (
    <>
      <div className="notes">
        {notes.map((elem, index) => {
          return (
            <div className="note" key={index}>
              <h1>{elem.title}</h1>
              <p>{elem.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
