import React, {Component} from 'react'

import {Link} from 'react-router'
import {connect} from 'react-redux'
import {pushState} from 'redux-router'
import {rebase} from '../firebase'
import {authenticationAction, userAction} from '../actions'

// React Redux wrapper
@connect(state => ({
  isAuthenticated: state.isAuthenticated,
  username: state.user.data.firstname,
  isAdmin: state.user.data.isAdmin
  }))
export default class SideBar extends Component {

  constructor(props) {
    super(props)
    this._logOutHandler = this._logOutHandler.bind(this)
    // Toggle the LeftNav
    //this.refs.leftNav.toggle();

  }


  _logOutHandler(event) {
    event.preventDefault()
    // Injected by React Redux
    let {dispatch} = this.props
    rebase.unauth()
    dispatch(userAction({}))
    dispatch(authenticationAction(false))
    dispatch(pushState(null, '/'))

  }

  componentDidMount() {
    let {isAdmin} = this.props
    if (isAdmin)
      $('#admin-section').show()
    else
      $('#admin-section').hide()
  }

  render() {
    console.log(this.props.username)
    return (
      <sidebar className='app__sidebar col-sm-3 col-md-3 col-lg-3'>
        <ul>
          <li><h3>{this.props.username}</h3></li>
          <li><Link to='/app/worklog'><i className='small material-icons'>note_add</i> Submit Work Log</Link></li>
          <li><Link to='/app/view-worklog'><i className='small material-icons'>note_add</i> View Work Log</Link></li>
          <li><Link to='/app/profile'><i className='small material-icons'>perm_identity</i> My Profile</Link></li>
          <li><Link to='/app/password'><i className='small material-icons'>verified_user</i> Change Password</Link></li>
          <li id='admin-section'>
            <div>
              <a href='#admin' data-toggle='collapse'><i className='small material-icons'>supervisor_account</i> User Management</a>
            </div>
            <div className='collapse' id='admin'>
              <div>
                <Link to='/app/newuser'><i className='small material-icons'>supervisor_account</i> Add User</Link>
              </div>
              <div>
                <Link to='/app/viewusers'><i className='small material-icons'>supervisor_account</i> View Users</Link>
              </div>
            </div>
          </li>
          <li><a href='#' onClick={ this._logOutHandler }><i className='small material-icons'>settings_power</i> Logout</a></li>
        </ul>
      </sidebar>
    )
  }
}
