<p align="center">
<a href="#" target="_blank">
<img alt="React Memory" title="React Memory" src="https://i.imgur.com/2aF8IOn.png" width="248">
</a>
</p>
<p align="center"> A <b>human memory</b> based centralized storage for react.</p>

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![HitCount](http://hits.dwyl.io/ajainvivek/react-memory.svg)](http://hits.dwyl.io/ajainvivek/react-memory)

## Installation

React Memory is available as an [npm package](https://www.npmjs.com/package/react-memory).

```sh
npm install react-memory --save
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<!-- just memory(): -->
<script src="//unpkg.com/react-memory/dist/react-memory.umd.js"></script>
```

You can find the library on `window.memory`.

### Demo

* [Codesandbox: Simple Example](https://codesandbox.io/s/40pn25njx7)
* [Codesandbox: Example showcasing memory working using router](https://codesandbox.io/s/0m06x87v00)

### Usage

```js
import { createMemory, Provider, connect } from 'react-memory'

const memory = createMemory({
  sensory: {
    _count: 0
  },
  short: {
    count: 0
  },
  long: {
    $count: 0
  }
});

// If actions is a function, it gets passed the memory:
let actions = memory => ({
  // Actions can just return a state update:
  incrementSensory(state) {
    return { _count: state._count + 1 }
  },

  incrementShort({count}) {
    return { count: count + 1 }
  },

  // Async actions can be pure async/promise functions:
  async incrementLong(state) {
    return new Promise((resolve) => {
      resolve($count: state.$count + 1);
    });
  }
})

const App = connect(['_count', 'count', '$count'], actions)(
  ({ _count, count, $count, incrementSensory, incrementShort, incrementLong }) => (
    <div>
      <p>Sensory: {_count}</p>
      <p>Short: {count}</p>
      <p>Long: {$count}</p>
      <button onClick={incrementSensory}>Increment Sensory</button>
      <button onClick={incrementShort}>Increment Short</button>
      <button onClick={incrementLong}>Increment Long</button>
    </div>
  )
)

export default () => (
  <Provider memory={memory}>
    <App />
  </Provider>
)
```

## How it works?

Mimicking the human memory model onto to the centralized store to process and retrieve the data. The data stored in central memory is categoried and initialized with all the required props for each category. Then the data is stored and retrieved based on the flow diagram.

![React Memory Flow](https://i.imgur.com/SpGwALm.png)

#### Sensory Memory

Sensory memory is the shortest-term element of memory. It has the ability to retain data only for the duration of component lifecycle. On component unmount the value resets to its initial state.

#### Short Term (Working) Memory

It is readily-available state for the duration of application lifecycle.

#### Long Term Memory

Long-term memory is, obviously enough, intended for storage of information over a long period of time. The values are decoded and stored in localStorage for later retrieval.

### API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### createMemory

Creates a new memory with default initialized values for each memory category.

**Parameters**

* `$0` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**
  * `$0.sensory`
  * `$0.short`
  * `$0.long`
* `config` (optional, default `{}`)
* `state` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Mandatory initial state (optional, default `{sensory:{},short:{},long:{}}`)

**Examples**

```javascript
let memory = createMemory({
     sensory: { _count: 0 },
     short: { count: 0 },
     long: { $count: 0 }
  });
  memory.subscribe( state => console.log(state) );
  memory.setState({ _count: 5, $count: 6 });
  memory.getState(); Proxy Lookup Object { _count: 5, count: 0, $count: 6}
  memory.snapshot('sensory'); { _count: 5 }
  memory.resetSensory();
  memory.snapshot('sensory'); { _count: 0 }
  memory.resetLong();
  memory.snapshot('long'); { $count: 0 }
```

Returns **memory**

#### unsubscribe

Remove the subscribed listener function

**Parameters**

* `listener` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** function to be detached from subscribed listeners

#### subscribe

Register a listener function so it can be called when state is changed

**Parameters**

* `listener` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** function to be attached to list of subscribed listeners

#### resetSensory

Reset the sensory memory

#### resetLong

Reset the long term memory

#### setState

Update the partial state from the current proxy/state, and call the registered listeners

**Parameters**

* `update` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Partial values to be updated to the memory

#### getState

Get the current state of the memory

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** state - current state of the memory

#### snapshot

To retrieve specific type from the memory

**Parameters**

* `type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** memory type i.e sensory, short, long

#### connect

Wire a component up to the memory. Passes state as props, re-renders on change.

**Parameters**

* `mapStateToProps` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** Memory state to be mapped the respective props using array with comma seperated values.
* `actions` **([Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))?** Action functions (pure state mappings), or a factory returning them. Every action function gets current state as the first parameter.

**Examples**

```javascript
const Foo = connect([foo, bar])(({ foo, bar }) => <div />);
```

```javascript
const actions = { someAction };
const Foo = connect([foo, bar], actions)(({ foo, bar, someAction }) => <div />);
```

Returns **Component** ConnectedComponent

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If not, just open a [new clear and descriptive issue](../../issues/new).

### License

[MIT License](LICENSE.md) © [Ajain Vivek](https://chaicode.com/)
