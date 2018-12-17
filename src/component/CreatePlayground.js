import React from 'react'
import { Button } from "@blueprintjs/core";

class CreatePlayground extends React.Component{
  state = {
    width : 10,
    heigth : 10,
    nbBombs : 15,
  }
  clampBombs = () => {
    this.setState({nbBombs: Math.max(Math.min(this.state.nbBombs, (this.state.heigth * this.state.width) -1), 1)})
  }
  render(){
    return(
      <div>
        <label>Width
          <input className='bp3-input' type='number' required value={this.state.width}
            onChange={ async (event) => {
              await this.setState({width: Math.max(event.target.value, 1)})
              this.clampBombs()
            }}
          />
        </label>
        <label>Height
          <input className='bp3-input' type='number' required value={this.state.heigth}
            onChange={ async (event) => {
              await this.setState({heigth: Math.max(event.target.value, 1)})
              this.clampBombs()
            }}
          />
        </label>
        <label>NbBombs
          <input className='bp3-input' type='number' required value={this.state.nbBombs}
            onChange={ async (event) => {
              await this.setState({nbBombs: event.target.value})
              this.clampBombs()
            }}
          />
        </label>
        <Button intent="success" text="New playground" onClick={() =>
          this.props.changePlayground(this.props.createPlayground(this.state.width, this.state.heigth, this.state.nbBombs))
        } />
      </div>
    )
  }
}

export default CreatePlayground