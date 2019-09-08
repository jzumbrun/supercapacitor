import Event from './event'
import { each } from './util'

/**
 * Doh
 * A global lib for errors
 */
class Doh {

    /**
     * Errors
     */
    errors(err){
        var errors = [],
            messages = err || {}
        messages.errors = messages.errors || {}

        each(messages.errors, (error) => {
            errors.push({type:'warning', message: error.reason || error.message})
        })
        return errors
    }

    /**
     * Emit Request Error
     * The Call to this should ALWAYS be super, not the child!
     */ 
    emitRequestError(error){
        error = error || {response: {}}
        switch (error.response.status){
            case 401:
            case 406:
                // Set a special emit here so we can do something about expired tokens.
                Event.emit('store.request.error.signout', [{type:'warning', message: 'unauthorized'}])
                break

            case 404:
            case 410: // in case of a 410 Gone, the site requested has been removed. redirect to landing page
                Event.emit('store.request.error.landing', this.errors(error.response.data))
                break

            case 500:
                // 500s need to go to not found so we have a page that
                // does not call to the server creating an infinite loop
                Event.emit('store.request.error.notfound')
                break

            case 503: // in case of a 503 Service Unavailable, redirect to maintenance page
                Event.emit('store.request.error.maintenance')
                break

            default:
                Event.emit('store.request.error', this.errors(error.response.data))
                break
        }
    }

}

export default new Doh()
