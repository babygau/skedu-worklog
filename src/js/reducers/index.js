import {combineReducers} from 'redux'
import {routerStateReducer} from 'redux-router'
import {ADMIN_ACTION, USER_ACTION, AUTHENTICATION_ACTION, EDIT_USER_ACTION, EDIT_WORKLOG_ACTION} from '../actions'

function authenticationReducer(
  state = {
    type: AUTHENTICATION_ACTION,
    isAuthenticated: false
  }, action) {

  switch(action.type) {

    case AUTHENTICATION_ACTION:
      return Object.assign(
        {},
        state,
        { isAuthenticated: action.isAuthenticated }
      )
    default:
      return state
  }


}

function adminReducer(
  state = {
    type: ADMIN_ACTION,
    data: []
  }, action) {

  switch(action.type) {

    case ADMIN_ACTION:
      return {
        ...state,
        data: action.admin
      }
    default:
      return state
  }

}

function userReducer(
  state = {
    type: USER_ACTION,
    data: {}
  }, action) {

  switch(action.type) {

    case USER_ACTION:
      return {
        ...state,
        data: action.user
      }
    default:
      return state
  }
}

function editUserReducer(
  state = {
    type: EDIT_USER_ACTION,
    data: {}
  }, action) {
  switch (action.type) {
    case EDIT_USER_ACTION:
      return {
        ...state,
        data: action.editUser
      }
    default:
      return state
  }
}

function editWorklogReducer(
  state = {
    type: EDIT_WORKLOG_ACTION,
    data: []
  }, action) {
  switch (action.type) {
    case EDIT_WORKLOG_ACTION:
      return {
        ...state,
        data: action.editWorklog
      }
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  router: routerStateReducer,
  authentication: authenticationReducer,
  editUser: editUserReducer,
  editWorklog: editWorklogReducer,
  user: userReducer,
  admin: adminReducer })
