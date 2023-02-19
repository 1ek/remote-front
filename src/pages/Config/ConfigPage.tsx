import { useEffect, useState } from "react"
import Navigation from "../../components/Navigation/Navigation"
import '../../components/Buttons/Buttons.scss'

interface Device {
    id: number;
    name: string;
    token: string;
    host: string;
    port: number;
    interface?: null | string;
    active?: null | boolean;
}

interface Scan {
    ips_scan_list: string[];
    scan_time: string;
}

const ConfigPage = () => {
    const [devices, setDevices] = useState<Device[] | null>(null)
    const [scan, setScan] = useState<Scan | null>(null)

    useEffect(() => {
        fetch('http://localhost:3228/api/devices', {
            method: 'GET'
        }).then(res => res.json()).then((data: Device[]) => {
            setDevices(prev => data)
            console.log(data)
        })
    }, [])

    const scanHandler = () => {
        fetch('http://localhost:3228/api/network/scan', {
            method: 'GET'
        }).then(res => res.json()).then(data => setScan(data))
    }

    const renderScan = (scan: Scan) => {
        const ips = scan.ips_scan_list.map(ip => <li>{ip}</li>)
        return <div>
            <h3>Найденные устройства:</h3>
            <ul>
                {ips}
            </ul>
            <h4>Время сканирования: {scan.scan_time}</h4>


        </div>
    }

    return (
        <div>
            <Navigation/>
            <h1>Настройки</h1> 
            <div>
                <h2>Устройства</h2>
                <ul>
                    {devices?.map((device: Device) => {
                        return <li key={device.id}>{device.name} {device.token} {device.host} {device.port}</li>
                    })}
                </ul>
            </div>
            <div>
                <h2>Сеть</h2>
                <h3>Сканирование</h3>
                <button onClick={scanHandler} className="device__button button__unique">Сканировать</button>
                {scan ? renderScan(scan): null}
                

            </div>



            
        </div>
    )
}

export default ConfigPage
