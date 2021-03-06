import React, { useEffect, useRef, useState } from 'react'
import { TextField } from '@material-ui/core'
import io from 'socket.io-client'
import './App.css';

function App() {
  const [ state, setState ] = useState({ message: "", name: ""})
  const [ chat, setChat ] = useState([])

  const socketRef = useRef()

  useEffect(
    () => {
      socketRef.current = io.connect("http://localhost:5000/"  )
      socketRef.current.on('message', ({ name, message }) => {
        setChat([...chat, { name, message } ])
      })
      return () => socketRef.current.disconnect()
    },
    [ chat ]
  )

  const onTextChange = (e) => {
    setState({...state, [e.target.name]: e.target.value })
  }

  const onMessageSubmit = async (e) => {
    const { name, message } = state
    socketRef.current.emit('message', { name, message})
    e.preventDefault()
    const body = { name, message };
    const response = await fetch("http://localhost:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/JSON"},
      body: JSON.stringify(body)
    });
    console.log(response)
    setState({ message: "", name })
  }

  const renderChat = () => {
    return chat.map(({ name, message }, index ) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ))
  }


  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>

        <div className="name-field">
          <TextField name="name" onChange={(e) => onTextChange(e)} value={state.username} label="Name" />
        </div>

        <div>
          <TextField name="message" onChange={(e) => onTextChange(e)} value={state.message} label="Message" id="outlined-multiline-static" variant="outlined" />
        </div>

        <button>Send Message</button>
      </form>

      <div className="render-chat">
        <h1>Chat</h1>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;
