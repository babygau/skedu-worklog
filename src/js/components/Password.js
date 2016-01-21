import React, {Component} from 'react'

export default class MyProfile extends Component {

  render() {
    return (
      <section className='app__main col-sm-9 col-md-9 col-lg-9'>
        <div className='row'>
          <div className='form-group row'>
            <div className='col-sm-5 col-md-5 col-lg-5'>
              <label htmlFor='new_password'>My new password</label>
              <input id='new_password' type='password' className='form-control'/>
            </div>
          </div>
          <div className='form-group row'>
            <div className='col-sm-5 col-md-5 col-lg-5'>
              <label htmlFor='retype_password'>Confirm my password</label>
              <input id='retype_password' type='password' className='form-control'/>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6 col-md-5 col-lg-5'>
              <button className='btn btn-primary'><i className='material-icons right'>cloud</i>  Update Password</button>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
