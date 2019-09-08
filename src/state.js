import { each } from './util'


/**
 * State
 * A global store to save cross request state in.
 */
export default class State {
    constructor(){
        // Private state!
        // Keep this guy immutable outside of this class!
        this._state = {}
    }

    /**
     * Parse
     * Ensure JSON.parse does not parse undefineds
     */
    parse(val){
        return val === undefined ? null : JSON.parse(val)
    }

    /**
     * Get
     * Get a property
     */
    get(key) {
        // Parse each key
        if (key === undefined) {
            let parsed = {}
            each(this._state, (val, current_key) => parsed[current_key] = this.parse(val))
            return parsed
        }

        return this.parse(this._state[key])
    }

    /**
     * Set
     * Set a property
     */
    set(key, val) {
        // Do not allow undefineds
        if(val !== undefined) this._state[key] = JSON.stringify(val)
    }

    /**
     * Delete
     * Delete a property
     */
    delete(key) {
        delete this._state[key]
    }

    /**
     * Clear
     * Clear the state
     */
    clear() {
        this._state = {}
    }
}
