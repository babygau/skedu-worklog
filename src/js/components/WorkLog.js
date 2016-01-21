import React, {Component} from 'react'
import {connect} from 'react-redux'
import {rebase} from '../firebase'
import DateTimeField from 'react-bootstrap-datetimepicker'
import {BootstrapTable, TableHeaderColumn, TableDataSet} from 'react-bootstrap-table'
import moment from 'moment'
import Rx from 'rx'
import _ from 'lodash'
import NotificationSystem from 'react-notification-system'
import {
  normaliseRanges,
  recursiveBinarySearch,
  rangeCheck,
  convertTime
} from '../util'


@connect(state => ({ user: state.user.data }))
export default class WorkLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      worklog: [],
      breaktime: 0,
      datePicker: {
        dateTime: moment().format('dddd, MMMM Do YYYY'),
        format: 'dddd, MMMM Do YYYY',
        inputFormat: 'dddd, MMMM Do YYYY',
        minDate: moment().subtract(2, 'w'),
        maxDate: moment(),
        viewMode: 'days',
        mode: 'date'
      },
      checkinPicker: {
        dateTime:moment().set({'hour': 9, 'minute': 0}).format('HHmm'),
        format: 'HHmm',
        inputFormat: 'hh:mm A',
        mode: 'time'
      },
      checkoutPicker: {
        dateTime:moment().set({'hour': 17, 'minute': 0}).format('HHmm'),
        format: 'HHmm',
        inputFormat: 'hh:mm A',
        mode: 'time'
      }
    }
    this.worklog = []
    this.intersections = []
    this.dataSet = new TableDataSet([{
      checkin: 0,
      checkout: 0,
      breaktime: 0,
      total: 0
    }])
    this._onDatePickerChange = this._onDatePickerChange.bind(this)
    this._onCheckInPickerChange = this._onCheckInPickerChange.bind(this)
    this._onCheckOutPickerChange = this._onCheckOutPickerChange.bind(this)
    this._onCheckInNow = this._onCheckInNow.bind(this)
    this._onCheckOutNow = this._onCheckOutNow.bind(this)
    this._onTimeBreakChange = this._onTimeBreakChange.bind(this)
    this._onAddNewItem = this._onAddNewItem.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onReset = this._onReset.bind(this)
  }
  _onDatePickerChange(date) {
    // React state don't have nested object
    // Make use of ES7 spread object
    this.worklog = []
    this.dataSet.setData([{
      checkin: 0,
      checkout: 0,
      breaktime: 0,
      total: 0
    }])
    return this.setState({ worklog: [], datePicker: { ...this.state.datePicker, dateTime: date } })
  }

  _onTimeBreakChange(e) {
    // Because `e.target.value` always return a string
    // Have to convert into number to match with type of
    // this.state.breaktime
    return this.setState({breaktime: Number(e.target.value)})
  }

  _onCheckInPickerChange(date) {
    // React state don't have nested object
    // Make use of ES7 spread object
    return this.setState({ checkinPicker: { ...this.state.checkinPicker, dateTime: date } })
  }

  _onCheckOutPickerChange(date) {
    // React state don't have nested object
    // Make use of ES7 spread object
    return this.setState({ checkoutPicker: { ...this.state.checkoutPicker, dateTime: date } })
  }
  _onCheckInNow() {
    return this.setState({ checkinPicker: { ...this.state.checkinPicker, dateTime: moment().format('HHmm') } })
  }

  _onCheckOutNow() {
    return this.setState({ checkoutPicker: { ...this.state.checkoutPicker, dateTime: moment().format('HHmm') } })
  }

  _onAddNewItem() {
    // `checkin` and `checkout` are converted into minutes
    // If checkin time is greater than checkout time, swap the time
    console.log('add new called!')
    let that = this
    let checkin_state = that.state.checkinPicker.dateTime; // Reserve `this`
    let checkout_state = that.state.checkoutPicker.dateTime;
    let checkin = moment(checkin_state, 'HHmm');
    let checkout = moment(checkout_state, 'HHmm');
    let checkin_as_minutes = moment.duration({ hours: checkin.hour(), minutes: checkin.minute() }).asMinutes();
    let checkout_as_minutes = moment.duration({ hours: checkout.hour(), minutes: checkout.minute() }, 'minutes').asMinutes();
    let breaktime_as_minutes = this.state.breaktime
    let unique_ranges = []
    let total_breaktime = 0

    if (checkin.isAfter(checkout)) {
      // ES6 destructuring
      [checkin, checkout] = [checkout, checkin]
      checkin_as_minutes = moment.duration({ hours: checkin.hour(), minutes: checkin.minute() }).asMinutes();
      checkout_as_minutes = moment.duration({ hours: checkout.hour(), minutes: checkout.minute() }, 'minutes').asMinutes();
      // Re-render the page when time is swapped
      this.setState({
        checkinPicker: {...this.state.checkinPicker, dateTime: checkin.format('HHmm')},
        checkoutPicker: {...this.state.checkoutPicker, dateTime: checkout.format('HHmm')}})
    }

    if (this.worklog.length === 0) {
      console.log(checkin_as_minutes)
      this.worklog.push({
        checkin: checkin_as_minutes,
        checkout: checkout_as_minutes,
        breaktime: breaktime_as_minutes,
        total: checkout_as_minutes - checkin_as_minutes - breaktime_as_minutes
      })
      // Update component state
      this.setState({worklog: this.worklog})
      // Update to the table
      this.dataSet.setData(_.chain(this.worklog)
                            .map(obj => ({
                              checkin: convertTime(obj.checkin),
                              checkout: convertTime(obj.checkout),
                              breaktime: obj.breaktime,
                              total: obj.total
                            }))
                            .value()
      )

    } else {
      this.worklog.push({
        checkin: checkin_as_minutes,
        checkout: checkout_as_minutes,
        breaktime: breaktime_as_minutes,
        total: checkout_as_minutes - checkin_as_minutes - breaktime_as_minutes
      })
      console.log('worklog before optimal', this.worklog)
      let temp_worklog = _.range(checkin_as_minutes, checkout_as_minutes)

      // Extract `checkin` and `checkout` values into an array
      // and then convert these arrays into ranges
      let temp_worklog_ranges = _.chain(this.worklog)
                           .map(obj => [obj.checkin, obj.checkout])
                           // Only retrieve checkin and checkout value of worklog
                           .map(arr => _.range(arr[0], arr[1]))
                           .value()

      // Remove duplicate array by using binary search
      // A trivial solution is to use Rx.Observable#distinct
      let worklog_duplicate_at_index = recursiveBinarySearch(temp_worklog_ranges.slice(0, temp_worklog_ranges.length - 1), temp_worklog)

      if (worklog_duplicate_at_index !== -1) {
        this.refs.notificationSystem.addNotification({
          message: 'Duplicate worklog has been found. Try another one!',
          level: 'error'
        })
        _.pullAt(this.worklog, worklog_duplicate_at_index)
        unique_ranges = _.pullAt(temp_worklog_ranges, worklog_duplicate_at_index)
      } else {
        console.log('not duplicated')
        unique_ranges = temp_worklog_ranges
      }
      // Need to reserve total breaktime
      // Because when time ranges are overlapped,
      // the breaktime for each range is not accurate
      // anymore when ranges are retransformed.
      // The solution is to reserve total breaktime
      // and divide it equally with total number of new
      // time ranges created after normalising original ranges
      total_breaktime = _.chain(this.worklog)
                          .map(arr => arr.breaktime)
                          .reduce((prev, curr) => {
                            return prev + curr
                          })
                          .value()
      // Check if ranges are overlapped
      let [intersections, ] = rangeCheck(unique_ranges)
      if (intersections.length <= 0) {
        // If not overlapped, so worklog is perfectly normalised
        // already, so just simply update the worklog to Firebase
        console.log(this.worklog)
        this.setState({worklog: this.worklog})
        // Update to the table
        this.dataSet.setData(_.chain(this.worklog)
                              .map(obj => ({
                                checkin: convertTime(obj.checkin),
                                checkout: convertTime(obj.checkout),
                                breaktime: obj.breaktime,
                                total: obj.total
                              }))
                              .value()
        )
      } else {
        // The algorithm is not good enough, because `intersections`
        // are lost after `this.worklog` is updated.
        // Need to find a way to reserve `intersections` after
        // `this.worklog` update

        // Start normalising ranges
        // Reset the worklog based on `optimal_ranges` and
        // `total_breaktime`

        // Reserved `intersections` state
        this.refs.notificationSystem.addNotification({
          message: 'Overlapped worklogs have been detected. We will try to optimize them to fit in system. If you are not happy with the optimized result, you just simply could click on reset button to do it again!',
          level: 'warning'
        })
        this.intersections = this.intersections.concat(intersections)
        console.log('reserved intersections', this.intersections)


        let optimal_ranges = normaliseRanges(unique_ranges, this.intersections)
        // Revert ranges into worklog `checkin` and `checkout`
        this.worklog = _.chain(optimal_ranges)
                         .map(arr => ({
                           checkin: arr[0],
                           checkout: arr[arr.length - 1],
                           breaktime: total_breaktime / optimal_ranges.length,
                           total: arr[arr.length - 1] - arr[0] - (total_breaktime / optimal_ranges.length)
                         }
                         ))
                         .value()
        console.log(this.worklog)
        this.setState({worklog: this.worklog})
        this.dataSet.setData(_.chain(this.worklog)
                              .map(obj => ({
                                checkin: convertTime(obj.checkin),
                                checkout: convertTime(obj.checkout),
                                breaktime: obj.breaktime,
                                total: obj.total
                              }))
                              .value()
        )
      }


    }
  }

  _onSubmit(e) {

    let that = this
    let {dateTime} = this.state.datePicker
    let dateTimeStamp = moment(dateTime, 'dddd, MMMM Do YYYY').unix()
    let {user} = this.props
    if (this.worklog.length == 0) {
      that.refs.notificationSystem.addNotification({
        message: 'There is no worklog, you cannot submit!',
        level: 'error'
      })
    } else {
      rebase.fetch(`worklogs/${user.uid}/${dateTimeStamp}`, {
        context: {},
        then(snapshot) {
          if (snapshot !== null) {
            that.refs.notificationSystem.addNotification({
              message: 'You already submitted the worklog',
              level: 'error'
            })
          } else {
            rebase.post(`worklogs/${user.uid}/${dateTimeStamp}`, {
              data: {
                worklog: that.state.worklog
              },
              then() {
                that.refs.notificationSystem.addNotification({
                  message: 'Data uploaded successfully',
                  level: 'success'
                })
              }
            })
          }

        }
      })
    }

  }

  _onReset(e) {
    this.dataSet.setData([{
      checkin: '0',
      checkout: '0',
      breaktime: '0',
      total: '0'
    }])
    this.worklog = []

  }

  render() {
    let {
          datePicker: {
            dateTime: dp_dateTime,
            viewMode: dp_viewMode,
            mode: dp_mode,
            format: dp_format,
            inputFormat: dp_inputFormat,
            minDate: dp_minDate,
            maxDate: dp_maxDate
          },

          checkinPicker: {
            dateTime: ci_dateTime,
            format: ci_format,
            inputFormat: ci_inputFormat,
            mode: ci_mode
          },

          checkoutPicker: {
            dateTime: co_dateTime,
            format: co_format,
            inputFormat: co_inputFormat,
            mode: co_mode
          }
        } = this.state
    return (
      <section className='app__main col-sm-9 col-md-9 col-lg-9'>
        <NotificationSystem ref='notificationSystem' />
        <div className='row'>
          <div className='row'>
            <div className='col-sm-9 col-md-9 col-lg-9'>
              <label htmlFor='datePicker'>Choose a date:</label>
              <DateTimeField
                  id='datePicker'
                  dateTime={dp_dateTime}
                  format={dp_format}
                  viewMode={dp_viewMode}
                  mode={dp_mode}
                  inputFormat={dp_inputFormat}
                  minDate={dp_minDate}
                  maxDate={dp_maxDate}
                  showToday={true}
                  onChange={ this._onDatePickerChange }

                  />
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-sm-9 col-md-9 col-lg-9'>
              <div className='panel panel-success'>
                <div className='panel-heading'>
                  <div className='panel-title'>Quick shortcut</div>
                </div>
                <div className='panel-body'>
                  <div className='col-sm-5 col-md-5 col-lg-5'>
                    <button className='btn btn-default' onClick={ this._onCheckInNow }>Check in now</button>
                  </div>
                  <div className='col-sm-5 col-md-5 col-lg-5'>
                    <button className='btn btn-default' onClick={ this._onCheckOutNow }>Check out now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-3 col-md-3 col-lg-3'>
              <div className='form-group'>
                <label htmlFor='checkin'>Check in</label>
                <DateTimeField
                  id='checkin'
                  dateTime={ci_dateTime}
                  format={ci_format}
                  mode={ci_mode}
                  inputFormat={ci_inputFormat}
                  onChange={ this._onCheckInPickerChange }
                />
              </div>
            </div>
            <div className='col-sm-3 col-md-3 col-lg-3'>
              <div className='form-group'>
                <label htmlFor='checkout'>Check out</label>
                <DateTimeField
                  id='checkout'
                  dateTime={co_dateTime}
                  format={co_format}
                  mode={co_mode}
                  inputFormat={co_inputFormat}
                  onChange={ this._onCheckOutPickerChange }
                />
              </div>
            </div>
            <div className='col-sm-2 col-md-2 col-lg-2'>
              <div className='form-group'>
                <label htmlFor='break'>Break time</label>
                <select className='form-control' onChange={this._onTimeBreakChange}>
                  <option value={0}>0 min</option>
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>1 hour</option>
                  <option value={75}>1 hour 15 mins</option>
                  <option value={90}>1 hour 30 mins</option>
                  <option value={115}>1 hour 45 mins</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
            </div>

            <div className='col-sm-1 col-md-1 col-lg-1'>
              <div className='form-group'>
                <label htmlFor='add'>Add</label>
                <button className='btn btn-default form-control' onClick={ this._onAddNewItem }><i id='add' className='glyphicon glyphicon-plus center-block'></i></button>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-9 col-md-9 col-lg-9'>
              <BootstrapTable data={this.dataSet}>
                <TableHeaderColumn dataField='checkin' isKey={true}>Checkin</TableHeaderColumn>
                <TableHeaderColumn dataField='checkout'>Checkout</TableHeaderColumn>
                <TableHeaderColumn dataField='breaktime'>Breaktime</TableHeaderColumn>
                <TableHeaderColumn dataField='total'>Total</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-9 col-md-9 col-lg-9'>
              <br />
              <div className='row'>
                <div className='col-sm-2 col-md-2 col-lg-2'>
                  <button id='reset-btn' className='btn btn-primary' onClick={this._onReset}><i className='material-icons right'>cloud</i>  Reset</button>
                </div>
                <div className='col-sm-offset-1 col-sm-2 col-md-offset-1 col-md-2 col-lg-offset-1 col-lg-2'>
                  <button id='submit-btn' className='btn btn-primary' onClick={this._onSubmit}><i className='material-icons right'>cloud</i>  Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
