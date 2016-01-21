import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {ReduxRouter} from 'redux-router'
import {configureStore} from '../stores/configureStore'

let store = configureStore()

export default class Root extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter />
        </Provider>
      </div>
    )
  }

}
