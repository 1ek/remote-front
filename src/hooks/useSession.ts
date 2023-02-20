import { useEffect, useState, useReducer, useCallback } from "react"
import { Socket } from "socket.io-client"
import sessionReducer from "../reducers/sessionReducer";


interface Session {
    connected: boolean;
    connectedIDs: string[];
    users: UserInstance[];
}

interface UserInstance {
    sender?: string;
    userId?: string;
    room: string;
    cursor: {
        transX: number;
        transY: number;
    }
}


const initial: Session = {
    connected: false,
    connectedIDs: [],
    users: []
}

const useSession = (socket: Socket) => {
    const [session, dispatch] = useReducer(sessionReducer, initial)


    const connect = (sender: string | undefined) => {
        dispatch({type: 'connect', payload: {socket, sender}})
    }
    
    const disconnect = () => {
        dispatch({type: 'disconnect', payload: {socket}})
    }


    const sendCoords = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, sender: string | undefined) => {
        const windowSize = window
        const transX = e.clientX / windowSize.innerWidth
        const transY = e.clientY/ windowSize.innerHeight
        const data: UserInstance = {
            sender: sender,
            room: 'test',
            userId: socket.id, 
            cursor: {
                transX: Number(transX),
                transY: Number(transY)
            }
        }
        socket.emit('dataToServer', data)  
    }, [session.users])


    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected from hook')
        })

        socket.on('joinedRoom', message => {
            dispatch({type: 'setConnectedIDs', payload: {message}})
            dispatch({type: 'joined', payload: {message}}) 
        })

        socket.on('leftRoom', message => {
            dispatch({type: 'setConnectedIDs', payload: {message}})
            dispatch({type: 'left', payload: {message}})
        })

        socket.on('dataToClient', (message: UserInstance) => {
            dispatch({type: 'setClientData', payload: {message}})
        })

        return () => {
            console.log('Unsubscribing + clean up')
            // socket.off('connect')
            // socket.off('joinedRoom')
            // socket.off('leftRoom')
            // socket.off('dataToClient')
        }

    },[])

    
    return { session, connect, disconnect, sendCoords }
}

export default useSession

