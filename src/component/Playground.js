import React from 'react'

import Box from './Box'

import '../style.css'

const RandInt = (max) => {
    return Math.floor(Math.random() * (max))
}

const getNeighbours = (x, y, playground) => {
    const h = playground.length
    const w = playground[0].length
    if(y > h || y < 0 || x < 0 || x > w){
        return []
    }
    let neighbours = []
    if( y > 0) {
        if (x > 0){
            neighbours.push(playground[y-1][x-1])
        }
        neighbours.push(playground[y-1][x])
        if (x < w-1){
            neighbours.push(playground[y-1][x+1])
        }
    }
    if (x > 0){
        neighbours.push(playground[y][x-1])
    }
    neighbours.push(playground[y][x])
    if (x < w-1){
        neighbours.push(playground[y][x+1])
    }
    if( y < h-1) {
        if (x > 0){
            neighbours.push(playground[y+1][x-1])
        }
        neighbours.push(playground[y+1][x])
        if (x < w-1){
            neighbours.push(playground[y+1][x+1])
        }
    }
    return (neighbours)
}

const createPlayground = (width, height, bombs = 1) =>
{
    // Create playground.
    let playground = []
    for(let i = 0; i < height; i++){
        playground[i] = []
        for(let j = 0; j < width; j++){
            playground[i][j] = {
                x : j,
                y : i,
                key : i * width + j,
                val : 0,
                open : true,
            }
        }
    }
    // Place bombs.
    let nbBombs = Math.max(1, Math.min( bombs, width * height -1))
    let x = 0
    let y = 0
    while(nbBombs > 0){
        x = RandInt(width)
        y = RandInt(height)
        if (playground[y][x].val === 0)
        {
            playground[y][x].val = -1
            nbBombs--
        }
    }
    // Set box value based on bombs proximity
    playground.map(row => row.map( box => {
        if (box.val === 0){
            const neighbours = getNeighbours(box.x, box.y, playground)
            neighbours.map(neighbour => {if(neighbour.val === -1){box.val++}})
        }
    }))
    return(
        playground
    )
}

const drawRow = (row) =>
{
    return(
        <div key={row[0].y} >
            {row.map( box => (<Box key={box.key} value={box.open ? box.val : ""} />))}
        </div>
    )
}

class Playground extends React.Component {
    state = {
        playground: createPlayground(10, 5, 10),
    }
    render(){
        return(
            <div className="Playground">{this.state.playground.map(row => drawRow(row))}</div>
        )
    }
}

export default Playground
