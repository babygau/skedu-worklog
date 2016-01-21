import {createStore, compose, applyMiddleware} from 'redux'
import {reduxReactRouter} from 'redux-router'
import {routes} from '../routes'
import {createHistory} from 'history' // Favor for Redux Router
import {devTools} from 'redux-devtools'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {rootReducer} from '../reducers'


export function configureStore(initialState) {

  const finalCreateStore = compose(
    reduxReactRouter({routes, createHistory}),
    applyMiddleware(thunkMiddleware, createLogger()),
    devTools()
    )(createStore)

  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
