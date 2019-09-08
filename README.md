# Supercapacitor

Supercapacitor is a super simplified implementation of the flux pattern.
Its goal is to encourage Pub/Sub patterns and include a XHR managing library.

#### Examples

## Component -> Stores Communication
Implements the Flux pattern:

`Component -calls-> Store.method() -which-emits-an-event-that-> Components <-listen-to-`


### Component example
```

import { Component } from 'supercapacitor'
// Store full path to file based on root
import { SomethingStore } from './routes/something/stores/something_store'

module.exports = class Index extends Component {

    constructor(props){
        super(props)
        this.something = 'class variable'

        // this is how you init state in ES6
        this.state = {}
        
        // The event method will register an event for the componentDidMount and the
        // componentWillUnmount
        
        // Listen for the emit from the store on a successful ajax call
        // Name the listening method by the name of the emit prefixed with
        // "on" and suffixed with Success. This is just a convention, not a requirement.
        // The even call will take care of the Pub/Sub's on and off listeners during react's mounting and
        // unmounting lifecyles.
        If the 3rd param is not given a value the component's own setState() will be used instead.
        this.event('SomethingStore', 'getSomething.success', this.onGetSomethingSuccess.bind())
    }

    // Only use DidMount, ie not WillMount
    // DidMount ensures the dom is really ready for the component
    // whereas WillMount is more like a constructor which we already have
    componentDidMount() {
       // We are overwriting the parent's componentDidMount so ensure you call 
       // super here otherwise events will not be registered to listen 
       super.componentDidMount()

        // Calls to a store
        SomethingStore.getSomething({
            'something_id': this.props.params.something_id
        })
    }

    // The listener bound function will usually update the state which forces a re-render
    onGetSomethingSuccess: function(data) {
        this.setState({
            something: data.something
        });
    }

    render() {
        return {...stuff...}
    }

}
```

### Store example
```

import { Store } from 'supercapacitor'

module.exports = class SomethingStore extends Store {

    constructor(){
        // The namespace ensures the emits are globally namespaced
        // The name should reflect the file's location
        super('somethings.stores.something')
    }

    getSomething(post_data){
        this.post('/some/endpoint', post_data)
        .then((data) => {
            // !!! ONLY CALL EMITS!!! or call another store method
            // Name the emit via the store method name and add .success
            // Pass the data as the second param which transcribes to the first
            // param of the listening functions.
            this.emit('getSomething.success', data)

            // Or set the data to the store's state via this.setState(data)
            // It can later be used by components by calling SomethingStore.getState()
            // Still send an emit, though.
            // Just remember that stores are singletons. There is only one instance
            // for them in the app at a time.
            // If you need multiple records for the same store because there are multiple
            // instances of a component in the render tree, just create an array
            // in the current store and manage the state with that.
        })
        // Errors are bubbled up to the Store class which displays alerts globally
        .catch(this.emitRequestError.bind(this))
    }
}
// The "new" creates a "singleton" for the app
// that allows it to share data from
// file to file via SomethingStore = require('file/path')
module.exports = new SomethingStore()

```