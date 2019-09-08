import React from 'react'
import { each } from './util'

export default class Component extends React.Component{

    constructor(props){
        super(props)
        this.connections = []
        this.loading = []
    }

    defaultCallback(data) {
        this.setState(data)
    }
    
    componentDidMount() {
        each(this.connections, (connection) => connection[0].on(connection[1], (this[connection[2]] && this[connection[2]].bind(this)) || this.defaultCallback.bind(this)))
    }

    componentWillUnmount() {
        each(this.connections, (connection) => connection[0].off(connection[1], (this[connection[2]] && this[connection[2]].bind(this)) || this.defaultCallback.bind(this)))
    }

    connect(klass, name, callback) {
        this.connections.push([klass, name, callback])
    }
}