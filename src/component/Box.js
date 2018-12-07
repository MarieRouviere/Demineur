import React from 'react'

import '../style.css'

const Box = (props) => {
    return (
        <span className='Box' onClick={() => console.log("pon", props)}>{props.value}</span>
    )
}

export default Box
