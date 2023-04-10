import { useRef, useState, FC} from 'react'

import RFB from '../../noVNC/core/rfb'

import './Screen.scss'
import '../Buttons/Buttons.scss'

import constants from '../../../data/constants'


const Screen: FC<{ url: string}> = ({ url }) => {

    // interface RFBOptions {
    //     credentials: {
    //         username?: string;
    //         password?: string;
    //         target?: string;
    //     };
    //     wsProtocols: string[];
    // }
    
    enum Events {
        connect,
        disconnect,
        credentialsrequired,
    }
    

    const [loading, setLoading] = useState(false)
    const [connected, setConnected] = useState(false)

    const screen = useRef<HTMLDivElement>(null)
    const rfb = useRef<RFB | null>(null)
    const device_url = useRef<string| null>(null)

    const setRfb = (_rfb: RFB | null) => {
        rfb.current = _rfb;
    }

    const getRfb = () => {
        return rfb.current;
    }


    const onConnect = () => {
        console.log('CONNECTED')
        setLoading(false)
        setConnected(true)
    }

    const onDisconnect = () => {
        console.log('DISCONNECTED')
        setLoading(false)
        setConnected(false)
    }

    const onCredentialsrequired = () => {
        const session = getRfb()
        // const pass = prompt('PASSWORD REQUIRED:')
        if (session) {
            session.sendCredentials({password: '894129'})
        }
    }

    const events = {
        connect: onConnect,
        disconnect: onDisconnect,
        credentialsrequired: onCredentialsrequired
    }


    
    const connect = () => {
        // if (!device_url) { throw 'URL is required' }
        // const res_url = `ws://${constants.server_ip}:6080/websockify?token=SA1`
        const res_url = `ws://192.168.88.228:6080/websockify?token=SA1`
        const _rfb = new RFB(screen.current, url)

        _rfb.clipViewport = true
        _rfb.scaleViewport = true
        _rfb.qualityLevel = 9
        _rfb.viewOnly = false
        _rfb.compressionLevel = 0
        _rfb.background = '#000'
        // _rfb.qualityLevel = 9
        console.log(_rfb)
        setRfb(_rfb)

        const addEventListeners = (_rfb: RFB) => {
            (Object.keys(events) as (keyof typeof Events)[]).forEach(event => {
                _rfb.addEventListener(event, events[event])
            })
        }

        addEventListeners(_rfb)

        setLoading(true)
    }

    const disconnect = () => {
        const session = getRfb()
        console.log(session)
        if (!session) {
            console.error('There is no session to disconnect from')
            return
        }

        const removeEventListeners = (_rfb: RFB) => {
            (Object.keys(events) as (keyof typeof Events)[]).forEach(event => {
                _rfb.removeEventListener(event, events[event])
            })
        }

        removeEventListeners(session)
      
        session.disconnect()
        setRfb(null)
        setConnected(false)
    }

    return (
        <div className="screen__container">
            <div className="dashboard">
                {connected ? <h3 className='connected'>CONNECTED</h3> : null}
                {loading ? <h3 className='loading'>Loading...</h3> : null}
                <button className='device__button button__dark' onClick={disconnect}>DISCONNECT</button>
            </div>
            <div ref={screen} className="novnc_canvas">
                {!loading && !connected ? 
                    <div className="screen_placeholder">
                        <button disabled={loading} className='device__button button__unique' onClick={() => connect()}>CONNECT</button>
                    </div> 
                : null}
            </div>
            
        </div>
    )
}

export default Screen