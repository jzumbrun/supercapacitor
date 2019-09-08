# Supercapacitor

![Supercapacitor](https://github.com/jzumbrun/supercapacitor-app/blob/master/public/assets/images/logo.svg?sanitize=1)

Supercapacitor is a super simplified implementation of the flux pattern.
Its goal is to encourage Pub/Sub patterns and include a XHR managing library.

Visit [Supercapacitor App](https://github.com/jzumbrun/supercapacitor-app) for an full example app.
#### Examples

## Component -> Stores Communication
Implements the Flux pattern:

`Component -calls-> Store.method() -which-emits-an-event-that-> Components <-listen-to-`

Note: the action dispatcher has been replace in favor of good old class method calls to simplify the pattern.

## Why?
I wanted to make the simplest version of a unidirectional react data store implementation that can fetch data from the server and inform components of the update. One that is clean, easy to follow and has no foreign concepts.

## What about hooks? Are you bucking the hooks gooey goodness?
I love using BOTH classes and functional components. I think classes are clean and easy to organize complex logic and I think functional components are great for simple logic-less components that only use props. I like to keep ALL state out of functional components if possible. This helps me create a better mental model as to what the component's purpose is.

### Component example
```

import { Component } from 'supercapacitor'
import { SomethingStore } from './stores/something_store'

export default class Index extends Component {

    constructor(props){
        super(props)

        this.state = {}
        
        // The event method will register an event for the componentDidMount and the
        // componentWillUnmount
        
        // Listen for the emit from the store on a successful ajax call
        // The `this.connect()` call will take care of the Pub/Sub's on and off listeners during react's mounting and
        // unmounting lifecyles automatically.
        // If the 3rd param is not given a function the component's own setState() will be used instead.
        // this.connect(SomethingStore, 'getSomething.success')
        // OR
        // If the the 3rd param is a function, then the return data from the store will populate the
        // callback's first param.
        // Name the listening method by the name of the emit prefixed with
        // "on" and suffixed with Success. This is just a convention, not a requirement.
        this.connect(SomethingStore, 'getSomething.success', this.onGetSomethingSuccess.bind(this))
        
    }

    // Only use DidMount, ie not WillMount
    // DidMount ensures the dom is really ready for the component
    // whereas WillMount is more like a constructor which we already have
    componentDidMount() {
       // We are overwriting the parent's componentDidMount so ensure you call 
       // super here otherwise events will not be registered to listen 
       super.componentDidMount()

        // Calls to a store to get data. Notice there is no return value here.
        // The return value will come in the first param of the `this.connect` callback ie,
        // onGetSomethingSuccess: function(/* here -> */ data), or if a callback is not set,
        // this component will re-render with the data populated in `this.state`
        SomethingStore.getSomething({
            'something_id': this.props.params.something_id
        })
    }

    // The callback bound function will usually update the state which forces a re-render
    onGetSomethingSuccess: function(data) {
        this.setState({
            something: data.something
        });
    }

    render() {
        return <div>{this.state.something}</div>
    }

}
```

### Store example
```

import { Store } from 'supercapacitor'

class SomethingStore extends Store {

    constructor(){
        // The namespace ensures the emits are globally namespaced
        // The name should reflect the file's location
        super('somethings.stores.something')
    }

    getSomething(options={}){
        // To keep the simplicity of the flux pattern, we do not dispatch TO the store.
        // This eliminates "action.js" files that loses context as to the resources
        // they are acting upon. We simply call a store's method.
        // Due to this flexibility we are leaving it up to the developer to NOT RETURN FROM THIS METHOD!
        // But simply emit back to listening controllers.
        
        // This first option is all one needs to get data.
        // The data will be set to the store's state, and the 'getSomething.success' will be emitted.
        this.request('get', `/some/endpoint/${options.something_id}`, 'getSomething.success')
        
        OR for more control use:
        
        this.get(`/some/endpoint/${options.something_id}`)
        .then((response) => {
            // !!! ONLY CALL EMITS!!! or call another store method
            // Name the emit via the store method name and add .success
            // Pass the data as the second param which transcribes to the first
            // param of the listening functions.
            this.emit('getSomething.success', response.data)

            // Or set the data to the store's state via this.setState(response.data)
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
export default new SomethingStore()

```

### Simplest example

#### Simplest Component example
```

import { Component } from 'supercapacitor'
import SomethingStore from './stores/something_store'

export default class Index extends Component {

    constructor(props){
        super(props)
        this.state = {something: null}
        this.connect(SomethingStore, 'getSomething.success')
    }

    componentDidMount() {
       super.componentDidMount()
       SomethingStore.getSomething({
           'something_id': this.props.params.something_id
       })
    }

    render() {
        return <div>{this.state.something}</div>
    }

}
```

### Simplest Store example
```

import { Store } from 'supercapacitor'

class SomethingStore extends Store {

    constructor() {
        super('somethings.stores.something')
    }

    getSomething(options={}) {
        this.request('get', `/some/endpoint/${options.something_id}`, 'getSomething.success')
    }
}

export default new SomethingStore()

```
