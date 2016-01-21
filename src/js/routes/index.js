import React from 'react'
import {Route} from 'react-router'

// Import React components
import Login from '../components/Login'
import App from '../components/App'
import MyProfile from '../components/MyProfile'
import Password from '../components/Password'
import WorkLog from '../components/WorkLog'
import ViewWorkLog from '../components/ViewWorkLog'
import NewUser from '../components/NewUser'
import ViewUsers from '../components/ViewUsers'
import EditUser from '../components/EditUser'

export const routes = (
  <Route path='/' component={Login}>
    <Route path='app' component={App}>
      <Route path='worklog' component={WorkLog} />
      <Route path='view-worklog' component={ViewWorkLog} />
      <Route path='profile' component={MyProfile} />
      <Route path='password' component={Password} />
      <Route path='newuser' component={NewUser} />
      <Route path='viewusers' component={ViewUsers} />
      <Route path='edit/user/:uid' component={EditUser} />
    </Route>
  </Route>
)
