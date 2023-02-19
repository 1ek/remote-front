import './Buttons.scss'
// import { buttons } from '../../../data/buttons'
import { useEffect, useState } from 'react'

interface Device {
    id: number;
    name: string;
    token: string;
    host: string;
    port: number;
    interface?: null | string;
    active?: null | boolean;
}

const Buttons = () => {
    const clickHandler = (e: any) => {
        const url = `http://192.168.88.35:3228/api/device/SA1/button/${e.currentTarget.id}`
        // const url = 'https://jsonplaceholder.typicode.com/todos/1'
        console.log(e.currentTarget.id)
        fetch(url, {
            method: 'GET',
            mode: 'no-cors'
        }).then(res => console.log(res))
    }
    

    const [btns, setButtons] = useState<Object | null>(null)
    useEffect(() => {
        
        fetch('http://192.168.1.102:3228/api/devices/token/SA1').then(res => res.json()).then((device: Device) => {
            console.log(device)
            const btns_interface = JSON.parse(device.interface!)
            setButtons(btns_interface)
        })
    }, [])

    const renderButtons = (buttons: any) => {
        let button_list = []
        let sections: any[] = []
        Object.keys(buttons).forEach((section) => {
            sections.push(buttons[section])
            buttons[section].forEach((button: any) => {
                button_list.push(button)
            })
        })
        
        const rendered = sections.map((section, index) => {
            return (
                <div key={`section_${index}`} className={`section${index + 1}`} >
                    {section.map((button: any, i: any) => 
                        <button className={`device__button section${index + 1}__button${button.classname ? ` ${button.classname}` : ''}`} 
                                key={button.id + i} 
                                id={button.id}
                                onClick={clickHandler}>

                                {button.placeholder}

                        </button>)}
                </div>
            )
        })
        return rendered
    }
    

    return (
        <div className='buttons__container'>
            {btns ? renderButtons(btns) : null}
        </div>
    )
}
export default Buttons