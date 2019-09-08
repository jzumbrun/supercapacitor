import axios from 'axios'
import Event from './event'
import State from './state'
import Doh from './doh'
import { each } from './util'


/**
 * Store
 */
export default class Store {

    constructor(namespace) {
        // Store require a namespace
        if(namespace === undefined) throw new Error('Stores require a namespace')

        this.namespace = namespace

        this.state = new State()
    }

    /**
     * Get State helper facade
     */
    getState(key){
        return this.state.get(key)
    }

    /**
     * Set State helper facade
     */
    setState(keys){
        each(keys, (value, key) => {
            this.state.set(key, value)
        })
    }

    /**
     * Clear State
     */
    clearState(){
        this.state.clear()
    }

    /**
     * Delete State
     */
    deleteState(key){
        this.state.delete(key)
    }

    /**
     * Emit
     */ 
    emit(action, data){
        Event.emit(this.namespace + '.' + action, data)
    }
    
    /**
     * On
     */ 
    on(action, callback){
        Event.on(this.namespace + '.' + action, callback)
    }

    /**
     * Off
     */
    off(action, callback){
        Event.off(this.namespace + '.' + action, callback)
    }

    /**
     * Get
     */ 
    get(url, params = null){
        return this._request({url: url, method: 'GET', params: params})
    }

    /**
     * Post
     */ 
    post(url, data){
        return this._request({url: url, data: data, method: 'POST'})
    }

    /**
     * Put
     */ 
    put(url, data){
        return this._request({url: url, data: data, method: 'PUT'})
    }

    /**
     * Delete
     */ 
    delete(url, params = null){
        return this._request({url: url, method: 'DELETE', params: params})
    }

    /**
     * Request
     * Simple request
     */
    request(action, url, emit, options){
        this[action](url, options)
        .then((res) => {
            this.setState(res.data)
            this.emit(emit, res.data)
        })
        .catch(this.emitRequestError.bind(this))
    }

    /**
     * _Request
     * All ajax requests go through here
     * 
     */ 
    _request(options){
        return axios({
            url: options.url,
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: options.data,
            method: options.method
        })
    }

    /**
     * Emit Request Error
     * The Call to this should ALWAYS be super, not the child!
     */ 
    emitRequestError(xhr){
        Doh.emitRequestError(xhr)
    }

}