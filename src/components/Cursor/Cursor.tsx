import { memo, useState, useEffect } from "react";

interface CursorProps {
    x: number;
    y: number;
    s: {
        innerWidth: number;
        innerHeight: number;
    }
}

const Cursor = memo(({ x, y, s }: CursorProps) => {
    console.log(x, y)
    

    return <div className='test' 
                style={{
                    transition: 'transform 0.5s cubic-bezier(.17,.93,.38,1)',
                    transform: `translateX(${x * s.innerWidth}px) translateY(${y * s.innerHeight}px)`
                    // transform: `translateX(${x}px) translateY(${y}px)`

                }}></div>
    return <h1></h1>

})

export default Cursor