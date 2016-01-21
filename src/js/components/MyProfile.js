import React, {Component} from 'react'
import {rebase} from '../firebase'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'
import Rx from 'rx'
import {connect} from 'react-redux'
import {createPickerState} from '../util'
@connect(state => ({
  myprofile: state.user.data
}))
export default class MyProfile extends Component {
  constructor(props) {
    super(props)
    let {uid, firstname, lastname, gender, homephone, mobile, dob, address, email, ssn, ssn_expirydate, isAdmin, bankname1, bankname2, holdername1, holdername2, bsb1, bsb2, accno1, accno2} = this.props.myprofile
    this.state = {
      uid: uid,
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      dob: dob,
      address: address,
      email: email,
      homephone: homephone,
      mobile: mobile,
      ssn: ssn,
      ssn_expirydate: ssn_expirydate,
      datePicker: createPickerState(),
      ssnPicker: createPickerState({
        format: 'MM/YYYY',
        viewMode: 'months',
        mode: 'date'
      }),
      bankname1: bankname1,
      bankname2: bankname2,
      holdername1: holdername1,
      holdername2: holdername2,
      bsb1: bsb1,
      bsb2: bsb2,
      accno1: accno1,
      accno2: accno2,
      isAdmin: isAdmin
    }

    this.firstname_stream = new Rx.Subject()
    this.lastname_stream = new Rx.Subject()
    this.address_stream = new Rx.Subject()
    this.gender_stream = new Rx.Subject()
    this.email_stream = new Rx.Subject()
    this.homephone_stream = new Rx.Subject()
    this.mobile_stream = new Rx.Subject()
    this.dob_stream = new Rx.Subject()
    this.ssn_stream = new Rx.Subject()
    this.ssn_expirydate_stream = new Rx.Subject()
    this.bankname1_stream = new Rx.Subject()
    this.bankname2_stream = new Rx.Subject()
    this.holdername1_stream = new Rx.Subject()
    this.holdername2_stream = new Rx.Subject()
    this.bsb1_stream = new Rx.Subject()
    this.bsb2_stream = new Rx.Subject()
    this.accno1_stream = new Rx.Subject()
    this.accno2_stream = new Rx.Subject()
    this._onFirstNameChange = this._onFirstNameChange.bind(this)
    this._onLastNameChange = this._onLastNameChange.bind(this)
    this._onAddressChange = this._onAddressChange.bind(this)
    this._onSSNChange = this._onSSNChange.bind(this)
    this._onHomePhoneChange = this._onHomePhoneChange.bind(this)
    this._onMobileChange = this._onMobileChange.bind(this)
    this._onEmailChange = this._onEmailChange.bind(this)
    this._onDatePickerChange = this._onDatePickerChange.bind(this)
    this._onSSNPickerChange = this._onSSNPickerChange.bind(this)
    this._onGenderChange = this._onGenderChange.bind(this)
    this._onBankName1Change = this._onBankName1Change.bind(this)
    this._onBankName2Change = this._onBankName2Change.bind(this)
    this._onHolderName1Change = this._onHolderName1Change.bind(this)
    this._onHolderName2Change = this._onHolderName2Change.bind(this)
    this._onBSB1Change = this._onBSB1Change.bind(this)
    this._onBSB2Change = this._onBSB2Change.bind(this)
    this._onAccNo1Change = this._onAccNo1Change.bind(this)
    this._onAccNo2Change = this._onAccNo2Change.bind(this)
    this._onNext = this._onNext.bind(this)
    this._onPrev = this._onPrev.bind(this)
    this._onUpdate = this._onUpdate.bind(this)
  }

  _onNext() {
    $('#add-tabs a[href="#bank-info"]').tab('show')
  }

  _onPrev() {
    $('#add-tabs a[href="#basic-info"]').tab('show')
  }

  _onFirstNameChange(e) {
    this.firstname_stream.onNext(e.target.value)
    this.setState({firstname: e.target.value})
  }

  _onLastNameChange(e) {
    this.lastname_stream.onNext(e.target.value)
    this.setState({lastname: e.target.value})
  }

  _onAddressChange(e) {
    this.address_stream.onNext(e.target.value)
    this.setState({address: e.target.value})
  }

  _onEmailChange(e) {
    this.email_stream.onNext(e.target.value)
    this.setState({email: e.target.value})
  }

  _onSSNChange(e) {
    this.ssn_stream.onNext(e.target.value)
    this.setState({ssn: e.target.value})
  }

  _onHomePhoneChange(e) {
    this.homephone_stream.onNext(e.target.value)
    this.setState({homephone: e.target.value})
  }

  _onMobileChange(e) {
    this.mobile_stream.onNext(e.target.value)
    this.setState({mobile: e.target.value})
  }

  _onGenderChange(e) {
    this.gender_stream.onNext(e.target.value)
    this.setState({gender: e.target.value})
  }

  _onDatePickerChange(date) {
    this.dob_stream.onNext(date)
    // React state don't have nested object
    // Make use of ES7 spread object
    this.setState({ datePicker: { ...this.state.datePicker, dateTime: date } })
  }

  _onSSNPickerChange(date) {
    this.ssn_expirydate_stream.onNext(date)
    // React state don't have nested object
    // Make use of ES7 spread object
    this.setState({ ssnPicker: { ...this.state.ssnPicker, dateTime: date } })
  }
  _onBankName1Change(e) {
    this.bankname1_stream.onNext(e.target.value)
    this.setState({bankname1: e.target.value})
  }

  _onBankName2Change(e) {
    this.bankname2_stream.onNext(e.target.value)
    this.setState({bankname2: e.target.value})
  }

  _onHolderName1Change(e) {
    this.holdername1_stream.onNext(e.target.value)
    this.setState({holdername1: e.target.value})
  }

  _onHolderName2Change(e) {
    this.holdername2_stream.onNext(e.target.value)
    this.setState({holdername2: e.target.value})
  }

  _onBSB1Change(e) {
    this.bsb1_stream.onNext(e.target.value)
    this.setState({bsb1: e.target.value})
  }

  _onBSB2Change(e) {
    this.bsb2_stream.onNext(e.target.value)
    this.setState({bsb2: e.target.value})
  }

  _onAccNo1Change(e) {
    this.accno1_stream.onNext(e.target.value)
    this.setState({accno1: e.target.value})
  }

  _onAccNo2Change(e) {
    this.accno2_stream.onNext(e.target.value)
    this.setState({accno2: e.target.value})
  }

  _onUpdate(e) {
    let that = this
    let {
      uid,
      firstname,
      lastname,
      address,
      email,
      gender,
      dob,
      homephone,
      mobile,
      ssn,
      ssn_expirydate,
      bankname1,
      bankname2,
      holdername1,
      holdername2,
      bsb1,
      bsb2,
      accno1,
      accno2,
      isAdmin
    } = this.state
    console.log(uid)

    $('#update-btn').button('loading')
    rebase.post(`users/${uid}`, {
      data: {
        firstname: firstname,
        lastname: lastname,
        address: address,
        gender: gender,
        homephone: homephone,
        mobile: mobile,
        email: email,
        password: '123456789',
        dob: dob,
        ssn: ssn,
        ssn_expirydate: ssn_expirydate,
        bankname1: bankname1,
        bankname2: bankname2,
        holdername1: holdername1,
        holdername2: holdername2,
        bsb1: bsb1,
        bsb2: bsb2,
        accno1: accno1,
        accno2: accno2,
        isAdmin: isAdmin
      },
      then() {
        $('#update-btn').button('reset')
        that.forceUpdate()
        console.log('successfully update profile')
      }
    })

  }


  componentDidMount() {

    $('#add-tabs a').click(function(e) {
      e.preventDefault()
      $(this).tab('show')
    })
  }

  render() {

    let that = this
    let {
      firstname,
      lastname,
      address,
      email,
      gender,
      dob,
      homephone,
      mobile,
      ssn,
      ssn_expirydate,
      datePicker: {
        dateTime: dp_dateTime,
        viewMode: dp_viewMode,
        mode: dp_mode,
        format: dp_format,
        inputFormat: dp_inputFormat,
        maxDate: dp_maxDate
      },

      ssnPicker: {
        dateTime: ssn_dateTime,
        format: ssn_format,
        inputFormat: ssn_inputFormat,
        minDate: ssn_minDate,
        viewMode: ssn_viewMode,
        mode: ssn_mod
      },
      bankname1,
      bankname2,
      holdername1,
      holdername2,
      bsb1,
      bsb2,
      accno1,
      accno2} = this.state

    return (
      <section className='app__main col-sm-9 col-md-9 col-lg-9'>
        <div className='modal fade' role='dialog' id='failed-addnew'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5>Oops! No worry!</h5>
              </div>
              <div className='modal-body'>
                <p>Error Title</p>
                <p>Error Content</p>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <ul id='add-tabs' className='nav nav-tabs'>
            <li><a className='active' href='#basic-info'>Basic Information</a></li>
            <li><a href='#bank-info'>Bank Detail</a></li>
          </ul>
        </div>
        <div className='row'>
          <div className='tab-content col-sm-12 col-md-12 col-lg-12'>
            <div id='bank-info' className='tab-pane fade'>
              <br/>
              <div className='row'>
                <div className='col-sm-6 col-md-6 col-lg-6'>

                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='bankname1-input' className='control-label'>Bank Name #1</label>
                      <input id='bankname1-input' onChange={this._onBankName1Change} value={bankname1} type='text' className='form-control'/>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='holdername1-input' className='control-label'>Holder Name #1</label>
                      <input id='holdername1-input' onChange={this._onHolderName1Change} value={holdername1} type='text' className='form-control'/>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='bsb1-input' className='control-label'>BSB Number #1</label>
                      <input id='bsb1-input' onChange={this._onBSB1Change} value={bsb1}  type='text' className='form-control'/>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='accountnumber1-input' className='control-label'>Account Number #1</label>
                      <input id='accountnumber1-input' onChange={this._onAccNo1Change} value={accno1} type='text' className='form-control'/>
                    </div>
                  </div>
                </div>

                <div className='col-sm-6 col-md-6 col-lg-6'>

                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='bankname2-input' className='control-label'>Bank Name #2</label>
                      <input id='bankname2-input' onChange={this._onBankName2Change} value={bankname2} type='text' className='form-control'/>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='holdername2-input' className='control-label'>Holder Name #2</label>
                      <input id='holdername2-input' onChange={this._onHolderName2Change} value={holdername2} type='text' className='form-control'/>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='bsb2-input' className='control-label'>BSB Number #2</label>
                      <input id='bsb2-input' onChange={this._onBSB2Change} value={bsb2} type='text' className='form-control'/>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                      <label htmlFor='accountnumber2-input' className='control-label'>Account Number #2</label>
                      <input id='accountnumber2-input' onChange={this._onAccNo2Change} value={accno2} type='text' className='form-control'/>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-3 col-md-3 col-lg-3'>
                  <button className='btn btn-primary' id='back-btn' onClick={this._onPrev}><i className='material-icons small'>navigate_before</i>Go Back</button>
                </div>
                <div className='col-sm-3 col-md-3 col-lg-3'>
                  <button className='btn btn-primary' id='update-btn' onClick={this._onUpdate} data-loading-text='Processing...'><i className='material-icons small'>cloud</i>Update</button>
                </div>
              </div>
            </div>

            <div id='basic-info' className='tab-pane fade in active'>
              <br/>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='firstname-input' className='control-label'>First Name</label>
                  <input id='firstname-input' onChange={this._onFirstNameChange} value={firstname} type='text' className='form-control' disabled />
                </div>

                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='lastname-input' className='control-label'>Last Name</label>
                  <input id='lastname-input' onChange={this._onLastNameChange} value={lastname} type='text' className='form-control' disabled />
                </div>
              </div>

              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='dob' className='control-label'>Date Of Birth</label>
                  <DateTimeField
                    dateTime={dob}
                    viewMode={dp_viewMode}
                    mode={dp_mode}
                    format={dp_format}
                    inputFormat={dp_inputFormat}
                    maxDate={dp_maxDate}
                    onChange={this._onDatePickerChange}/>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='address-input'>Address:</label><br />
                  <input id='address-input' onChange={this._onAddressChange} value={address} type='text' className='form-control'/>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='gender'>Gender:</label><br />
                  <label htmlFor='gender' className='radio-inline'><input type='radio' name='gender' onChange={this._onGenderChange} value='Male' checked={gender == 'Male'}/>Male</label>
                  <label htmlFor='gender' className='radio-inline'><input type='radio' name='gender' onChange={this._onGenderChange} value='Female' checked={gender == 'Female'}/>Female</label>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='homephone-input' className='control-label'>Home Phone</label>
                  <input id='homephone-input' onChange={this._onHomePhoneChange} value={homephone} type='tel' className='form-control'/>
                </div>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='mobile-input' className='control-label'>Contact Number</label>
                  <input id='mobile-input' onChange={this._onMobileChange} value={mobile} type='tel' className='form-control'/>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='email-input' className='control-label'>Email</label>
                  <input id='email-input' onChange={this._onEmailChange} value={email} type='email' className='form-control'/>
                </div>
              </div>

              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='ssn-input' className='control-label'>License Number</label>
                  <input id='ssn-input' onChange={this._onSSNChange} value={ssn} type='text' className='form-control'/>
                </div>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='ssn-expirydate-input' className='control-label'>Expiry Date</label>
                  <DateTimeField
                    dateTime={ssn_expirydate}
                    format={ssn_format}
                    inputFormat={ssn_inputFormat}
                    minDate={ssn_minDate}
                    viewMode={ssn_viewMode}
                    mode={ssn_mod}
                    onChange={this._onSSNPickerChange} />
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-3 col-md-3 col-lg-3'>
                  <button className='btn btn-primary' id='next-btn' onClick={this._onNext}><i className='material-icons small'>navigate_next</i>Next</button>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>
    )


  }
}
