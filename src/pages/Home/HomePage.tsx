import Buttons from '../../components/Buttons/Buttons'
import Screen from '../../components/Screen/Screen'
import Navigation from '../../components/Navigation/Navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import {Socket, io} from 'socket.io-client'
import Cursor from '../../components/Cursor/Cursor'


import './HomePage.scss'

const HomePage = () => {
    const [windowSize, setWindowSize] = useState(getWindowSize())

    const [coords, setCoords] = useState({x: 4, y: 4})
  

    const socketRef = useRef<Socket | null>(null)



    useEffect(() => {
        setCoords({x: 412, y: 412})
        console.log(coords)
        socketRef.current = io('http://192.168.1.102:5000')
        socketRef.current.on('connect', () => {
            console.log('connect')
        })
        socketRef.current.on('onMessage', message => {
            // x = message.body.transX
            // y = message.body.transY
            // console.log(x)
            setCoords({x: message.body.transX, y: message.body.transY})
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
        // const transX = e.clientX 
        // const transY = e.clientY
        socketRef.current?.emit('newMessage', {transX, transY})  

    }, [])

    return(
        <div onMouseMove={e => transformCoords(e)} className="app__container">
        <div className='device__container'>
            <h3>{windowSize.innerWidth}</h3>
            <h3>{windowSize.innerHeight}</h3>
            <Navigation/>
            <Screen url={`ws://192.168.88.35:6080/websockify?token=SA1`}/>
            <Buttons/>
            <Cursor  x = {Number(coords.x)} y = {Number(coords.y)} s = {{innerWidth: windowSize.innerWidth, innerHeight: windowSize.innerHeight}}/>
        </div>
    </div>
    )
}

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}

export default HomePage