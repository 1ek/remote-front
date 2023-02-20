import { memo, useState, useEffect } from "react";

interface CursorProps {
    x: number;
    y: number;
    s: {
        innerWidth: number;
        innerHeight: number;
    };
    name: string;
}

const Cursor = memo(({ x, y, s, name}: CursorProps) => {
    
    

    return <div className='cursor' style={{
        transition: 'transform 0.5s cubic-bezier(.17,.93,.38,1)',
        transform: `translateX(${x * s.innerWidth}px) translateY(${y * s.innerHeight}px)`
        // transform: `translateX(${x}px) translateY(${y}px)`
        }}>
            <span className='cursor_name'>{name}</span>
            <div className='cursor_dot'></div>
            </div>

                

})

export default Cursor

