import React from 'react'

import '../style.css'

const Box = (props) => {
  return (
    <span className={props.className} onClick={() => props.boxPressed(props.box.x, props.box.y)}>{props.value}</span>
  )
}

export default Box
