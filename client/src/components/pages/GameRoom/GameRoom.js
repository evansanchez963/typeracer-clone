import { useState, useEffect } from "react";
import { useSocket, useRoomCode } from "../../../context/SocketContext";
import {
  GameroomStatusInfo,
  UserProgressBar,
} from "../../../features/multiplayer/components/index";
import {
  useRoomStatus,
  useClientStatus,
  useTimers,
  useFetch,
} from "../../../features/multiplayer/hooks/index";
import "./GameRoom.css";

const GameRoom = () => {
  const [userRoster, setUserRoster] = useState({});

  const socket = useSocket();
  const roomCode = useRoomCode();

  const {
    finishLine,
    isRoomStarted,
    isRoomEnded,
    clientFinish,
    endRoom,
    resetRoom,
  } = useRoomStatus();
  const {
    isClientReady,
    isClientStarted,
    isClientEnded,
    readyClient,
    endClient,
    resetClient,
  } = useClientStatus(isRoomStarted, isRoomEnded);
  const {
    countdown,
    countdownOn,
    gameTimer,
    gameTimerOn,
    startCountdown,
    resetTimers,
  } = useTimers(isRoomStarted, isRoomEnded);
  const { isLoading, loadError, text } = useFetch(roomCode, userRoster);

  const roomStatus = {
    finishLine,
    isRoomStarted,
    isRoomEnded,
    clientFinish,
    endRoom,
  };
  const clientStatus = {
    isClientReady,
    isClientStarted,
    isClientEnded,
    readyClient,
    endClient,
  };
  const timers = {
    countdown,
    countdownOn,
    gameTimer,
    gameTimerOn,
    startCountdown,
  };
  const restart = () => {
    resetRoom();
    resetClient();
    resetTimers();
  };

  const updateJoinedUsers = (data) => {
    const userInfo = {};
    for (const client in data) {
      userInfo[client] = data[client];
    }
    setUserRoster(userInfo);
  };

  const renderUsers = () => {
    return (
      <div className="user-list">
        {Object.keys(userRoster).map((client) => {
          return (
            <div key={client} className="user">
              {userRoster[client]} {socket.id === client ? "(you)" : ""}
              <UserProgressBar></UserProgressBar>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    socket.on("get_user_roster", updateJoinedUsers);
    socket.emit("connect_to_room", { room: roomCode });

    return () => socket.off("get_user_roster", updateJoinedUsers);
  }, [socket, roomCode]);

  if (loadError) {
    return <div id="multiplayer-error-screen">Error: {loadError.message}</div>;
  } else if (isLoading) {
    return <div id="multiplayer-loading-screen">Loading...</div>;
  } else
    return (
      <section id="game-room">
        <div className="multiplayer-wrapper">
          <div className="multiplayer-typing-section">
            <GameroomStatusInfo
              roomStatus={roomStatus}
              clientStatus={clientStatus}
              timers={timers}
            ></GameroomStatusInfo>
            {renderUsers()}

            <div className="multiplayer-typing-box">{text}</div>
          </div>
        </div>
      </section>
    );
};

export default GameRoom;
