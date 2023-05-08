import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useSocket } from "../../../context/SocketContext";
import "./PlayOnline.css";

const PlayOnline = () => {
  const navigate = useNavigate();
  const { isLoggedIn, username } = useAuth();
  const { handleJoinRoom } = useSocket();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (roomCode === "") {
      setError("Room code must not be empty!");
      return;
    }

    try {
      const joined = await handleJoinRoom({
        room: roomCode,
        user: isLoggedIn ? username : "Guest",
      });
      if (joined) navigate(`/gameroom/${roomCode}`);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <section id="play-online">
      <div className="online-options">
        <h1>Join a Room</h1>
        <div className="play-online-input-wrapper">
          {error && <span className="play-online-error-message">*{error}</span>}
          <input
            type="text"
            placeholder="Enter room code..."
            onChange={(e) => setRoomCode(e.target.value)}
          ></input>
        </div>
        <button onClick={handleJoin}>Join Game</button>
      </div>
    </section>
  );
};

export default PlayOnline;
