import { useEffect, useState } from "react"
import Navigation from "../../components/Navigation/Navigation"
import '../../components/Buttons/Buttons.scss'
import './ConfigPage.scss'

import constants from "../../../data/constants"

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

    const [loading, setLoading] = useState<boolean>(false)


    useEffect(() => {
        fetch(`http://${constants.server_ip}:${constants.server_port}/api/devices`, {
            method: 'GET'
        }).then(res => res.json()).then((data: Device[]) => {
            setDevices(prev => data)
            console.log(data)
        })
    }, [])

    const scanHandler = () => {
        setLoading(true)
        setScan(null)
        fetch(`http://${constants.server_ip}:${constants.server_port}/api/network/scan`, {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            setLoading(false)
            setScan(data)
        })
    }

    const renderScan = (scan: Scan) => {
        const ips = scan.ips_scan_list.map(ip => <li>{ip}</li>)
        return <div className="scan__result">
            <h3>Найденные устройства:</h3>
            <ul>
                {ips}
            </ul>
            <h4>Время сканирования: <span className="scan__time">{scan.scan_time}</span></h4>


        </div>
    }

    return (
        <div className="config__container">
            <Navigation/>
            <h1>Настройки</h1> 
            <div className="config__devices">
                <h2>Устройства</h2>
                <ul className="devices__list">
                    {devices?.map((device: Device) => {
                        return <li key={device.id}>{device.name} {device.token} {device.host} {device.port}</li>
                    })}
                </ul>
            </div>
            <div className="config__scan">
                <h2>Сеть</h2>
                <h3>Сканирование</h3>
                <button disabled={loading} onClick={scanHandler} className="device__button button__unique">Сканировать</button>
                {loading ? 'Сканирование...' : null}
                {scan ? renderScan(scan) : null}
                

            </div>
        </div>
    )
}

export default ConfigPage
