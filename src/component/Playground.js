import React from 'react'

import Box from './Box'

import '../style.css'

const getClassName = (status, val) => {
  switch(status) {
    case 1:
      switch(val) {
        case 0:
          return 'ZeroBox'
        case -1:
          return 'BoxBomb'
        default:
          return 'Box'
      }
    case 2:
      return 'FlagBomb'
    case 3:
      return 'FlagSuspicious'
    default:
      return 'BoxClose'
  }
}

const getValue = (status, val) => {
  switch(status) {
    case 1:
    return val
    case 2:
      return 'B'
    case 3:
      return '?'
    default:
      return '-'
  }
}

const drawRow = (row, props) =>(
  <div key={row[0].y} >
    {row.map( box => (
      <Box
        key={box.key}
        value={getValue(box.status, box.val)}
        boxPressed={props.boxPressed}
        box={box}
        className={getClassName(box.status, box.val)}
      />
    ))}
  </div>
)

const Playground = (props) => {
  if(props.playground.length === 0) {
    return (
      <div>Create a new playground</div>
    )
  }
  return(
    <div className="Playground">{props.playground.map(row => drawRow(row, props))}</div>
  )
}

export default Playground
