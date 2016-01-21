import React, {Component} from 'react'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'
import Rx from 'rx'
import {createPickerState} from '../util'
import {rebase} from '../firebase'

// OK, Trying to do form validation in RxJS way
// This might overkill but I think its worth for learning
// The trivial ways is get form values from `this.state`
// and do validation based on these value
// The RxJS way is to convert all form input into Observable
// stream and do validation by combining those stream together

export default class NewUser extends Component {

  constructor(props) {
    super(props)
    this.state = {
      errorlog: 'Error',
      firstname: '',
      lastname: '',
      gender: 'Male',
      address: '',
      email: '',
      homephone: '',
      mobile: '',
      ssn: '',
      datePicker: createPickerState(),
      ssnPicker: createPickerState({
        format: 'MM/YYYY',
        viewMode: 'months',
        mode: 'date'
      }),
      bankname1: '',
      bankname2: '',
      holdername1: '',
      holdername2: '',
      bsb1: '',
      bsb2: '',
      accno1: '',
      accno2: '',
      isAdmin: false
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
    this._addNewUser = this._addNewUser.bind(this)
    this._resetInput = this._resetInput.bind(this)
    this._onNext = this._onNext.bind(this)
    this._onPrev = this._onPrev.bind(this)
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

  componentDidMount() {

    $('#add-tabs a').click(function(e) {
      e.preventDefault()
      $(this).tab('show')
    })

    let email_regex_pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    let phone_regex_pattern = /^\D*0(\D*\d){9}\D*$/

    let firstname_regex = this.firstname_stream.map(e => e.length > 3)

    let lastname_regex = this.lastname_stream.map(e => e.length > 3)

    let address_regex = this.address_stream.map(e => e.length > 3)

    let email_regex = this.email_stream.map(e => email_regex_pattern.test(e))

    let homephone_regex = this.homephone_stream.map(e => phone_regex_pattern.test(e))

    let mobile_regex = this.mobile_stream.map(e => phone_regex_pattern.test(e))

    let ssn_regex = this.ssn_stream.map(e => e.length > 3)

    let bankname1_regex = this.bankname1_stream.map(e => e.length > 3)

    let bankname2_regex = this.bankname2_stream.map(e => e.length > 3)

    let holdername1_regex = this.holdername1_stream.map(e => e.length > 3)

    let holdername2_regex = this.holdername2_stream.map(e => e.length > 3)

    let bsb1_regex = this.bsb1_stream.map(e => e.length > 3)

    let bsb2_regex = this.bsb2_stream.map(e => e.length > 3)

    let accno1_regex = this.accno1_stream.map(e => e.length > 6)

    let accno2_regex = this.accno2_stream.map(e => e.length > 6)

    let bank1_regex = Rx.Observable.combineLatest(bankname1_regex, holdername1_regex, bsb1_regex, accno1_regex, (a, b, c, d) => a && b && c && d)

    let bank2_regex = Rx.Observable.combineLatest(bankname2_regex, holdername2_regex, bsb2_regex, accno2_regex, (a, b, c, d) => a && b && c && d)

    // Validate form before creating new user
    // Rx.Observable.combineLatest(firstname_regex, lastname_regex, address_regex, homephone_regex, mobile_regex, email_regex, ssn_regex, (a, b, c, d, e, f, g) => a && b && c && d && e && f && g).subscribe(val => $('#addnew-btn').prop('disabled', !val))

    // Add new user
    let user_info = [
      this.firstname_stream.startWith(''),
      this.lastname_stream.startWith(''),
      this.dob_stream.startWith(moment().format('DD/MM/YYYY')),
      this.address_stream.startWith(''),
      this.gender_stream.startWith('Male'),
      this.email_stream.startWith(''),
      this.homephone_stream.startWith(''),
      this.mobile_stream.startWith(''),
      this.ssn_stream.startWith(''),
      this.ssn_expirydate_stream.startWith(moment().format('MM/YYYY')),
      this.bankname1_stream.startWith(''),
      this.bankname2_stream.startWith(''),
      this.holdername1_stream.startWith(''),
      this.holdername2_stream.startWith(''),
      this.bsb1_stream.startWith(''),
      this.bsb2_stream.startWith(''),
      this.accno1_stream.startWith(''),
      this.accno2_stream.startWith('')
    ]

    let add_new_user_stream = Rx.Observable.combineLatest(user_info, function(...val) {
      return {
        firstname: val[0],
        lastname: val[1],
        dob: val[2],
        address: val[3],
        gender: val[4],
        email: val[5],
        homephone: val[6],
        mobile: val[7],
        ssn: val[8],
        ssn_expirydate: val[9],
        bankname1: val[10],
        bankname2: val[11],
        holdername1: val[12],
        holdername2: val[13],
        bsb1: val[14],
        bsb2: val[15],
        accno1: val[16],
        accno2: val[17]
      }
    })

    let add_new_btn_stream = Rx.Observable.fromEvent($('#addnew-btn'), 'click')
    add_new_btn_stream.withLatestFrom(add_new_user_stream, (_, data) => data)
                      .subscribe((stream_data) => this._addNewUser(stream_data))
  }

  _addNewUser(stream_data) {
    $('#addnew-btn').button('loading')
    rebase.createUser({
      email: stream_data.email,
      password: '123456789'
    }, (error, user_data) => {
      if (error) {
        console.log('Cannot create a new user')
        this.setState({errorlog: error.toString()})
        $('#addnew-btn').button('reset')
        $('#failed-addnew').modal('show')

      } else {
        $('#addnew-btn').button('reset')
        rebase.post(`users/${user_data.uid}`, {
          data: {
            firstname: stream_data.firstname,
            lastname: stream_data.lastname,
            address: stream_data.address,
            gender: stream_data.gender,
            homephone: stream_data.homephone,
            mobile: stream_data.mobile,
            email: stream_data.email,
            password: '123456789',
            dob: stream_data.dob,
            ssn: stream_data.ssn,
            ssn_expirydate: stream_data.ssn_expirydate,
            bankname1: stream_data.bankname1,
            bankname2: stream_data.bankname2,
            holdername1: stream_data.holdername1,
            holdername2: stream_data.holdername2,
            bsb1: stream_data.bsb1,
            bsb2: stream_data.bsb2,
            accno1: stream_data.accno1,
            accno2: stream_data.accno2,
            isAdmin: false
          },
          then() {
            console.log('successfully add new user')
          }
        })

      }

    })
  }

  _resetInput() {
    // This is not a great idea
    // The state still remain even reseting input values

    $('#firstname-input').val('')
    $('#lastname-input').val('')
    $('#email-input').val('')
    $('#homephone-input').val('')
    $('#mobile-input').val('')
    $('#ssn-input').val('')
    $('#address-input').val('')
  }

  render() {

    let {
      errorlog,
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
                <p>{errorlog}</p>
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
                      <input id='bsb1-input' onChange={this._onBSB1Change} value={bsb1} type='text' className='form-control'/>
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
                  <button className='btn btn-primary' id='addnew-btn' data-loading-text='Processing...'><i className='material-icons small'>cloud</i>  Add new user</button>
                </div>
              </div>
            </div>

            <div id='basic-info' className='tab-pane fade in active'>
              <br/>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='firstname-input' className='control-label'>First Name</label>
                  <input id='firstname-input' onChange={this._onFirstNameChange} type='text' className='form-control'/>
                </div>

                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='lastname-input' className='control-label'>Last Name</label>
                  <input id='lastname-input' onChange={this._onLastNameChange} type='text' className='form-control'/>
                </div>
              </div>

              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='dob' className='control-label'>Date Of Birth</label>
                  <DateTimeField
                    dateTime={dp_dateTime}
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
                  <input id='address-input' onChange={this._onAddressChange} type='text' className='form-control'/>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='gender'>Gender:</label><br />
                  <label htmlFor='gender' className='radio-inline'><input type='radio' name='gender' onChange={this._onGenderChange} value='Male' defaultChecked/>Male</label>
                  <label htmlFor='gender' className='radio-inline'><input type='radio' name='gender' onChange={this._onGenderChange} value='Female'/>Female</label>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='homephone-input' className='control-label'>Home Phone</label>
                  <input id='homephone-input' onChange={this._onHomePhoneChange} type='tel' className='form-control'/>
                </div>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='mobile-input' className='control-label'>Contact Number</label>
                  <input id='mobile-input' onChange={this._onMobileChange} type='tel' className='form-control'/>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='email-input' className='control-label'>Email</label>
                  <input id='email-input' onChange={this._onEmailChange} type='email' className='form-control'/>
                </div>
              </div>

              <div className='form-group row'>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='ssn-input' className='control-label'>License Number</label>
                  <input id='ssn-input' onChange={this._onSSNChange} type='text' className='form-control'/>
                </div>
                <div className='col-sm-5 col-md-5 col-lg-5'>
                  <label htmlFor='ssn-expirydate-input' className='control-label'>Expiry Date</label>
                  <DateTimeField
                    dateTime={ssn_dateTime}
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
