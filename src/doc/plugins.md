# Plugins API

## Framework

We use redux/react-redux, however, the framework boilerplate is hidden in the core and not exposed to plugins.

Our state shape is flat, that is, a reducer can only update the root state:

```
    ...return {...state, key1: value1, key2: value2 } 

```

and a component can only subscribe to first-level keys:

```
    app.connect(MyButton, [key1, key1]) 

```

The core (`app` module) provides these APIs for redux wiring:

### `app.connect(class, keysArray)`

connects the class to the store and binds given state keys to its props

### `app.perform(type, argsObject)`

performs an action. Invokes a hook, if exists (see `Plugin.action`), otherwise dispatches an object `{type, args}`.

### `app.set(argsObject)`

dispatches a trivial action which just updates the state from the args.

### `app.get(key)`

returns the key's value from the state

### `Plugin.init`

called after the main App is inited, but before the map init. This is where you declare your actions and reducers.

### `Plugin.reducer(type, fn)`

declares a reducer hook for the action `type`. The hook accepts `state` and an `args` object and should return an object to merge (NB: not the whole state). 

```
class Plugin extends app.Plugin {

    init() {
    
        this.reducer('processSomething', (state, {foo, bar}) => {
            ....
            return {blah: 125}   
        }
    }
}

// somewhere else

app.perform('processSomething', {foo: 11, bar: 22})

```

 


### `Plugin.action(type, fn)`

declares a hook for the action. The hook accepts a single args objects (as given to `app.perform`), it's recommended to destructure it for clarity:

```
class Plugin extends app.Plugin {

    init() {
    
        this.action('doSomething', ({foo, bar}) => ....
    }
}

// somewhere else

app.perform('doSomething', {foo: 11, bar: 22})

```

## Plugin

A plugin is a module in `src/plugins`. A plugin must export a class called `Plugin` extending `app.Plugin`.
UI plugins also export their visual components, which should be connected to the store via `app.connect`

```
class Plugin extends app.Plugin {
    ...
}

class MyButton extends React.Component {
    ...
}

export default {
    Plugin,
    MyButton: app.connect(MyButton, ['propOne', 'propTwo'])
}
```

### `Plugin` class

The `Plugin` class can do these things:

- declare action hooks (`Plugin.action`)
- declare custom reducers (`Plugin.action`)
- subscribe to map events (`app.map().on...`)
- update the state (via `app.set` or custom reducers)
- update the map
- call APIs
 
 NB: map-to-state updates are one-way, never update the map based on the state!
