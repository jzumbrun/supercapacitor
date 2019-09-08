import React from 'react'
import { each } from './util'

export default class Component extends React.Component{

    constructor(props){
        super(props)
        this.events = []
        this.loading = []
    }

    defaultCallback(data) {
        this.setState(data)
    }
    
    componentDidMount() {
        each(this.events, (event) => event[0].on(event[1], (this[event[2]] && this[event[2]].bind(this)) || this.defaultCallback.bind(this)))
    }

    componentWillUnmount() {
        each(this.events, (event) => event[0].off(event[1], (this[event[2]] && this[event[2]].bind(this)) || this.defaultCallback.bind(this)))
    }

    event(klass, name, callback) {
        this.events.push([klass, name, callback])
    }
}