import { createContext } from "react";

import { io, Socket } from "socket.io-client";
import constants from "../../data/constants";

export const socket = io(`http://${constants.server_ip}:5000`)

export const WebSocketContext = createContext<Socket>(socket)

export const WebSocketProvider = WebSocketContext.Provider