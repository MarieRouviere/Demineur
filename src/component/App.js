import React from 'react'

import Playground from './Playground'

import '../style.css'


class App extends React.Component {
    state = {
        playground: [],
        mode: 'pick',
    }
    render(){
        return(
            <div>
                <div>
                    <button type="button" className="btn btn-primary">Check case</button>
                    <button type="button" className="btn btn-danger">Mark bomb</button>
                    <button type="button" className="btn btn-warning">Unknown</button>
                    <button type="button" className="btn btn-success">Check neighbours</button>
                </div>
                <div><Playground /></div>
            </div>
        )
    }
}

export default App
