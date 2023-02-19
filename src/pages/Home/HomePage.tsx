import Buttons from '../../components/Buttons/Buttons'
import Screen from '../../components/Screen/Screen'
import Navigation from '../../components/Navigation/Navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import {Socket, io} from 'socket.io-client'
import Cursor from '../../components/Cursor/Cursor'

import constants from '../../../data/constants'

interface DataToServer {
    sender?: string;
    room: string;
    cursor: {
        transX: number;
        transY: number;
    }
}

interface UserInstance {
    userId: string;
    room: string;
    cursor: {
        transX: number;
        transY: number;
    }
}


import './HomePage.scss'

const HomePage = () => {
    const inpRef = useRef<any>()

    const [windowSize, setWindowSize] = useState(getWindowSize())

    const [coords, setCoords] = useState({x: 0, y: 0})

    const [users, setUsers] = useState<UserInstance[] | []>([])

    const [connectedUsers, setConnectedUsers] = useState(0)
  

    const socketRef = useRef<Socket | null>(null)

    const connect = () => {
        socketRef.current?.emit('joinRoom', 'test')
    }

    const disconnect = () => (
        socketRef.current?.emit('leaveRoom', 'test')
    )



    useEffect(() => {
        console.log(coords)
        socketRef.current = io(`http://${constants.server_ip}:5000`)
        socketRef.current.on('connect', () => {
            console.log('connect')
        })
        // socketRef.current.on('onMessage', message => {
        //     // x = message.body.transX
        //     // y = message.body.transY
        //     // console.log(x)
        //     setCoords({x: message.body.transX, y: message.body.transY})
        // })
        socketRef.current.on('joinedRoom', message => {
            setConnectedUsers(message.users)
            const user: UserInstance = {
                userId: message.userId,
                room: 'test',
                cursor: {
                    transX: 0, 
                    transY: 0
                }
            }
            setUsers(prev => [...prev, user])
            console.log(message)
        })
        socketRef.current.on('leftRoom', message => {
            setConnectedUsers(message.users)
            console.log(message)
        })
        socketRef.current.on('dataToClient', (message: DataToServer) => {
            console.log(message)
            const x = message.cursor.transX
            const y = message.cursor.transY
            setUsers((prev: any) => {
                const user = prev.map((user: UserInstance) => {
                   if (user.userId == message.sender) {
                    return {...user, cursor: {transX: message.cursor.transX, transY: message.cursor.transY}}
                   }
                   return user
                })
                return user
            })

        })



        function handleWindowResize() {
          setWindowSize(getWindowSize());
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);
 


    const transformCoords = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const transX = e.clientX / windowSize.innerWidth
        const transY = e.clientY/ windowSize.innerHeight
        const data: DataToServer = {
            room: 'test',
            sender: socketRef.current?.id, 
            cursor: {
                transX: Number(transX),
                transY: Number(transY)
            }
        }
        // const transX = e.clientX 
        // const transY = e.clientY
        socketRef.current?.emit('dataToServer', data)  

    }, [])

    return(
        <div onMouseMove={e => transformCoords(e)} className="app__container">
        <div className='device__container'>
            <Navigation/>
            <div className='room__container'>
                <input ref={inpRef} type="text" />
                <button onClick={connect} className='device__button '>Connect to room</button>
                <button onClick={disconnect} className='device__button '>Disconnect</button>

                <h4>Пользватели: {connectedUsers}</h4>
            </div>
            <Screen url={`ws://${constants.server_ip}:6080/websockify?token=SA1`}/>
            <Buttons/>
            <h3 style={{position: 'fixed', top: '60px', left: '0px'}}>{windowSize.innerWidth}</h3>
            <h3 style={{position: 'fixed', top: '80px', left: '0px'}}>{windowSize.innerHeight}</h3>
            {users.map(user => {
                if (user.userId !== socketRef.current?.id) {
                    return <Cursor x = {Number(user.cursor.transX)} y = {Number(user.cursor.transY)} s = {{innerWidth: windowSize.innerWidth, innerHeight: windowSize.innerHeight}}></Cursor>
                }
            })}
            {/* <Cursor x = {Number(coords.x)} y = {Number(coords.y)} s = {{innerWidth: windowSize.innerWidth, innerHeight: windowSize.innerHeight}}/> */}
        </div>
    </div>
    )
}

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}

export default HomePage