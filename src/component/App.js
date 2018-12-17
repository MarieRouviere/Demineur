import React from 'react'
import { connect } from 'react-redux'

import Playground from './Playground'
import Victory from './Victory'
import GameOver from './GameOver'
import SwitchMode from './SwitchMode'
import CreatePlayground from './CreatePlayground'

const RandInt = (max) => {
  return Math.floor(Math.random() * (max))
}

const checkCoords = (x, y, width, height) =>
  x >= 0 && x < width && y >= 0 && y < height && [x, y]

const getNeighboursCoords = (x, y, width, height) =>
    [
        checkCoords(x - 1, y - 1, width, height),
        checkCoords(x, y - 1, width, height),
        checkCoords(x + 1, y - 1, width, height),
        checkCoords(x - 1, y, width, height),
        checkCoords(x + 1, y, width, height),
        checkCoords(x - 1, y + 1, width, height),
        checkCoords(x, y + 1, width, height),
        checkCoords(x + 1, y + 1, width, height),
    ].filter(Array.isArray)

const getNeighbours = (x, y, playground) => {
  const h = playground.length
  const w = playground[0].length
  return getNeighboursCoords(x, y, w, h).map(([x, y]) => playground[y][x])
}

const createPlayground = (width, height, nbBombs = 1) =>
{
  // Compute bombs.
  nbBombs = Math.max(1, Math.min( nbBombs, width * height -1))
  // Nb box to open
  const bombs = {}
  while(nbBombs > 0){
    const key = RandInt(width) + ( RandInt(height) * width)
    if (bombs[key]) continue
    bombs[key] = true
    nbBombs--
  }
  // Create playground.
  let playground = []
  for(let i = 0; i < height; i++){
    playground[i] = []
    for(let j = 0; j < width; j++){ 
      const key = i * width + j
      playground[i][j] = {
        x : j,
        y : i,
        key : key,
        // Set box value based on bombs proximity
        val : - bombs[key] || getNeighboursCoords(j, i, width, height)
          .map( ([x, y]) => bombs[x + width * y] || 0)
          .reduce( (acc, v) => {
              return acc + v } ),
        // Box status: 0: hidden, 1: open, 2: bomb, 3: suspicious)
        status : 0,
      }
    }
  }
  return(
    playground
  )
}

class App extends React.Component {
  state = {
    playground: [],
    mode: 'ONE',
    bombFlagged: 0,
    gameOver: false,
  }
  render(){
    const getUpperPart = mode =>{
      switch(mode) {
        case 'VICTORY':
          return <div><Victory /></div>
        case 'GAME_OVER':
          return <div><GameOver /></div>
        default:
          return <SwitchMode callback={this.props.changeModeActionCreator} />
      }
    }
    return(
      <div>
        {getUpperPart(this.props.mode)}
        <CreatePlayground changePlayground={this.props.changePlayground} createPlayground={this.props.createPlayground} />
        <div><Playground playground={this.props.playground}
          boxPressed={ (x,y) => this.props.boxPressed(x, y, this.props.playground, this.props.mode)}/></div>
      </div>
    )
  }
}

const changePlaygroundActionCreator = (playground) => {
  return {
    type: 'CHANGE_PLAYGROUND',
    payload: playground,
  }
}

const changeModeActionCreator = (mode) => {
  return {
    type: 'CHANGE_MODE',
    payload: mode,
  }
}

// DOTO: real game over
const checkCase = (x, y, playground) =>{
  if (playground[y][x].status !== 0){
    return playground
  }
  let newPlayground = playground.map(row =>
    row.map( box => box.x === x && box.y ===y ? {...box, status : 1 } : box))
  const box = newPlayground[y][x]
  if (box.val === -1){
    console.log("PERDU")
  }
  if (box.val === 0){
    const neighbours = getNeighbours(x, y, newPlayground)
    neighbours.forEach(neighbour => newPlayground = checkCase(neighbour.x, neighbour.y, newPlayground))
  }
  return newPlayground
}

const flagBox = (x, y, playground, mode) => {
  const status = playground[y][x].status
  if  ( status !== 0 && status !== 2 && status !== 3){
    return playground
  }
  switch(mode) {
    case 'BOMB':
      return playground.map( row =>
        row.map( box =>
          box.x === x && box.y === y ? {...box, status : status === 2 ? 0 : 2} : box
      ))
    case 'SUSPICIOUS':
    return playground.map( row =>
      row.map( box =>
        box.x === x && box.y === y ? {...box, status : status === 3 ? 0 : 3} : box
    ))
    default:
      return playground
  }
}

 const checkNeighbours = (x, y, playground) =>{
  if (playground[y][x].status !== 1 ){
    return playground
  }
  let newPlayground = playground.map(row => row.map( box => box))
  const neighbours = getNeighbours(x, y, newPlayground)
  neighbours.forEach(neighbour => newPlayground = checkCase(neighbour.x, neighbour.y, newPlayground))
  return newPlayground
}

const boxPressed = (x, y, playground, mode) => {
  switch(mode){
    case "ONE":
      return checkCase(x, y, playground)
    case "ALL":
      return checkNeighbours(x, y, playground)
    case "BOMB":
      return flagBox(x, y, playground, mode)
    case "SUSPICIOUS":
      return flagBox(x, y, playground, mode)
    default:
      return playground
  }
}

const stateToProps = (state) => {
  return {
    playground: state.playground,
    mode: state.mode,
  }
}

const dispatchToProps = (dispatch) => {
  return {
    createPlayground: (width, height, nbBombs) => {
      dispatch(changePlaygroundActionCreator(createPlayground(width, height, nbBombs)))
    },
    changePlayground: (playground) => {
      dispatch(changeModeActionCreator("ONE"))
    },
    changeModeActionCreator: (mode) => {
      dispatch(changeModeActionCreator(mode))
    },
    boxPressed: (x, y, playground, mode) => {
      const newPlayground = boxPressed(x, y, playground, mode)
      dispatch(changePlaygroundActionCreator(newPlayground))
      const gameOver = newPlayground.filter(row => row.filter(box => box.status === 1 && box.val === -1).length > 0).length > 0
      if(gameOver) {
        dispatch(changeModeActionCreator("GAME_OVER"))
      }
      else {
        const victory = newPlayground.filter(row => row.filter(box => box.status !== 1 && box.val !== -1).length > 0).length === 0
        if(victory) {
          dispatch(changeModeActionCreator("VICTORY"))
        }
      }
    }
  }
}

export default connect(stateToProps, dispatchToProps)(App)
