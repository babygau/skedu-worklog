import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushState} from 'redux-router'
import {rebase} from '../firebase'
import Rx from 'rx'
import {authenticationAction, userAction, adminAction} from '../actions/index'
import NotificationSystem from 'react-notification-system'

@connect(state => ({ isAuthenticated: state.authentication.isAuthenticated }))
export default class Login extends Component {
  constructor(props) {
    super(props)
    this._onForgetPassword = this._onForgetPassword.bind(this)
    this._onReset = this._onReset.bind(this)
  }

  static propTypes = {
    children: PropTypes.node
  }

  _onReset() {
    let that = this
    let email = $('#resetpwd-email-input').val()
    rebase.resetPassword({
      email: email
    }, error => {
      if (error) {
        switch (error.code) {
          case 'INVALID_USER':
            that.refs.notificationSystem.addNotification({
              message: 'You are not registered with this email address. Try again!',
              level: 'error'
            })
            break
          default:
            that.refs.notificationSystem.addNotification({
              message: 'You are not registered with this email address. Try again!',
              level: 'error'
            })
        }
      } else {
        that.refs.notificationSystem.addNotification({
          message: 'Error while reseting your password. Try again!',
          level: 'success'
        })
        $('#reset-password-dialog').modal('hide')
      }
    })
  }

  _onForgetPassword() {
    // TODO: Send reset email to user request
    $('#reset-password-dialog').modal('show')
  }


  componentDidMount() {
    // Reserve `this` binding
    let that = this

    let {dispatch} = this.props
    let email_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    // Basic form validation
    let login_stream = Rx.Observable.fromEvent($('#login-btn'), 'click')
    let email_stream = Rx.Observable.fromEvent($('#email-input'), 'keyup')
                                    .map(e => email_regex.test(e.target.value))

    let password_stream = Rx.Observable.fromEvent($('#password-input'), 'keyup')
                                       .map(e => e.target.value.length > 8)

    // Disable login button until input validations are satisfied
    //Rx.Observable.combineLatest(email_stream, password_stream)
        //.map(pair => pair.reduce((acc, curr) => acc && curr))
        //.subscribe(val => $('#login-btn').prop('disabled', !val))

    login_stream.subscribe(() => {

      $('#login-btn').button('loading')
      rebase.authWithPassword({
        email: $('#email-input').val(),
        password: $('#password-input').val()
      }, function(error, authData) {
        if (error) {
          $.noConflict()
          that.refs.notificationSystem.addNotification({
            message: 'Your email and password are not correct. Try again!',
            level: 'error'
          })
          $('#email-input').val('')
          $('#password-input').val('')
          $('#login-btn').prop('disabled', true)
          $('#login-btn').button('reset')
        } else {
          rebase.fetch(`users/${authData.uid}`, {
            context: {},
            then(snapshot) {
              that.refs.notificationSystem.addNotification({
                message: 'Successfully login',
                level: 'success'
              })
              // Dispatch user data
              dispatch(userAction({...snapshot, uid: authData.uid}))
              // Enable App page
              dispatch(authenticationAction(true))
              // Redirect to App Worklog
              dispatch(pushState(null, '/app/worklog'))

            }})
        }

      })
    })

  }



  render() {
    let {isAuthenticated} = this.props

    return isAuthenticated ?
      (
        <div>
        <NotificationSystem ref='notificationSystem'/>
        {this.props.children}
        </div>
      )

      :

      (
        <div className='login-page row'>
          <NotificationSystem ref='notificationSystem'/>

          <div className='modal fade' role='dialog' id='reset-password-dialog'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5>Send password reset to this email:</h5>
                </div>
                <div className='modal-body'>
                  <div className='form-group'>
                    <label htmlFor='resetpwd-email-input'>Email:</label>
                    <input className='form-control' id='resetpwd-email-input' type='text'/>
                  </div>
                </div>
                <div className='modal-footer'> 
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  <button type="button" onClick={this._onReset} id='resetpwd-btn' className="btn btn-primary">Send</button>
                </div>
              </div>
            </div>
          </div>

          <div className='modal fade' role='dialog' id='failed-login'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5>Oops! No worry!</h5>
                </div>
                <div className='modal-body'>
                  <p>My email and password are not correct</p>
                  <p>Let's do it again!</p>
                </div>
              </div>
            </div>
          </div>

          <div className='login-page__header col-md-12 col-lg-12'>Work Log Management</div>


          <div className='login-page__signin-form col-md-12 col-lg-12'>
            <div className='row'>
              <div className='form-group col-md-12 col-lg-12'>
                <label htmlFor='username'>Email: </label>
                <input className='form-control' id='email-input' type='text'/>
              </div>
            </div>
            <div className='row'>
              <div className='form-group col-md-12 col-lg-12'>
                <label htmlFor='password'>Password: </label>
                <input className='form-control' id='password-input' type='password'/>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-2 col-md-2 col-lg-2'>
                <button className='btn btn-primary' onClick={this._onForgetPassword}>Forgot password?</button>
              </div>
              <div className='col-sm-offset-1 col-sm-2 col-md-offset-1 col-md-2 col-lg-offset-1 col-lg-2'>
                <button id='login-btn' className='btn btn-primary' data-loading-text='Processing...'>Signin</button>
              </div>
            </div>
          </div>

        </div>
      )
  }
}
