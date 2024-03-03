import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  // const socket = useMemo(() => io("http://localhost:5000"), []);
  const socket = useMemo(() => io("https://socket-0yd8.onrender.com/"), []);

  // const socket = io('https://socket-huwp.vercel.app');
  // const socket = io("https://socket-huwp.vercel.app", {
  //   transports: ["websocket"],
  // });

// const socket = io("https://socket-huwp.vercel.app", {
//   transports: ["polling", "websocket"],
//   reconnection:true,
//   path:"/socket",
//   reconnectionAttempts:5
// });

// const socket = io("http://localhost:5000", {
//   transports: ["polling", "websocket"],
//   reconnection:true,
//   path:"/socket",
//   reconnectionAttempts:5
// });


// Rest of your code remains the same


  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on("receive-message", (data) => {
      // console.log("received Message: ", data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (m) => {
      console.log(m);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage(message);
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h3" component="div" gutterBottom>
          Welcome To Socket.io
        </Typography>
        <Typography variant="h4" component="div" mb={5}>
          {socketId}
        </Typography>
        <form
          action=""
          style={{ marginBottom: "2rem" }}
          onSubmit={joinRoomHandler}
        >
          <Typography variant="h5">Join Room</Typography>
          <TextField
            id="outlined-basic"
            label="Room Name"
            variant="outlined"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Button variant="contained" color="success" type="submit">
            Join
          </Button>
        </form>
        <form onSubmit={submitHandler}>
          <TextField
            id="outlined-basic"
            label="message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Room ID"
            variant="outlined"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <Button variant="contained" color="success" type="submit">
            Send
          </Button>
        </form>
        <Stack direction={"column"}>
          {messages &&
            messages.map((message) => (
              <Typography variant="h3">{message}</Typography>
            ))}
        </Stack>
      </Container>
    </>
  );
};

export default App;
