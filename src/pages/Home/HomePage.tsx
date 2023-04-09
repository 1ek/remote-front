import Buttons from '../../components/Buttons/Buttons'
import Screen from '../../components/Screen/Screen'
import Cursor from '../../components/Cursor/Cursor'
import Lab from '../../components/Lab/Lab'

import constants from '../../../data/constants'

import { useEffect, useRef, useState, useContext } from 'react'
import { WebSocketContext } from '../../contexts/WebSocketContext'

import useSession from '../../hooks/useSession'

import './HomePage.scss'
import NavLinks from '../../components/Navigation/NavLinks'




const HomePage = () => {
    const socket = useContext(WebSocketContext)
    

    const inpRef = useRef<HTMLInputElement>(null)
    const labRef = useRef<any>(null)

    const [windowSize, setWindowSize] = useState(getWindowSize())

    const {session, connect, disconnect, sendCoords} = useSession(socket)

    

    useEffect(() => {
        
        function handleWindowResize() {
          setWindowSize(getWindowSize());
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []); 
 


    return(
        <div onMouseMove={e => sendCoords(e, inpRef.current?.value)} className="app__container" ref={labRef}>
            <div className='fixed'>
                <Buttons/>  
                <nav className='nav'>
                    <NavLinks/>
                    <div className='room__container'>
                        <input ref={inpRef} type="text" style={{display: `${!session.connected ? 'block': 'none'}`}}/>
                        {!session.connected ? <button onClick={()=> connect(inpRef.current?.value)} className='device__button '>Connect to room</button> : null }
                        {session.connected ? <button onClick={disconnect} className='device__button '>Disconnect</button> : null}
                        <h4>Пользватели: {session.connectedIDs.length}</h4>
                    </div>
                    <div>
                        <h3 >{windowSize.innerWidth}</h3>
                        <h3 >{windowSize.innerHeight}</h3>
                    </div>
                </nav>
            </div>

            
            <div style={{ width: '100vw', height: '100vh',display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Lab>
                <Screen url={`ws://${constants.server_ip}:6080/websockify?token=SA1`}/>
            </Lab>
            </div>

            
            {session.users.map(user => {
                if ((user.userId !== socket.id) && session.connected ) {
                    return <Cursor key={user.userId} x = {Number(user.cursor.transX)} y = {Number(user.cursor.transY)} s = {{innerWidth: windowSize.innerWidth, innerHeight: windowSize.innerHeight}} name = {user.sender!}></Cursor>
                }
            })}
        </div>
    )
}

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}

export default HomePage