import React, {Component} from 'react'
import {connect} from 'react-redux'
import {rebase} from '../firebase'
import DateTimeField from 'react-bootstrap-datetimepicker'
import {BootstrapTable, TableHeaderColumn, TableDataSet} from 'react-bootstrap-table'
import moment from 'moment'
import Rx from 'rx'
import _ from 'lodash'
import NotificationSystem from 'react-notification-system'
import {convertTime} from '../util'

@connect(state => ({ user: state.user.data }))
export default class ViewWorkLog extends Component {

  constructor(props) {
    super(props)
    this.state = {currentWeek: moment()}
    this.weekCounter = 0
    this.dataSet = new TableDataSet([])
    this._onPrev = this._onPrev.bind(this)
    this._onNext = this._onNext.bind(this)
  }

  _onPrev(e) {
    let that = this
    let {user} = this.props
    let {currentWeek} = this.state
    rebase.fetch(`worklogs/${user.uid}`, {
      context: {},
      asArray: true,
      queries: {
        orderByKey: true,
        startAt: moment().weekday(that.weekCounter - 7).startOf('week').unix().toString(),
        endAt: moment().weekday(that.weekCounter - 7).endOf('week').unix().toString()
      },
      then(snapshot) {
        if (snapshot.length > 0) {
          snapshot = getWorklog(snapshot)
          that.dataSet.setData(snapshot)
          that.weekCounter -= 7
          that.setState({currentWeek: currentWeek.subtract(1, 'weeks')})
        } else {
          that.weekCounter -= 7
          that.setState({currentWeek: currentWeek.subtract(1, 'weeks')})
          that.refs.notificationSystem.addNotification({
            message: 'There is no worklog to see next!',
            level: 'warning'
          })
        }

      }
    })
  }

  _onNext(e) {
    let that = this
    let {user} = this.props
    let {currentWeek} = this.state
    rebase.fetch(`worklogs/${user.uid}`, {
      context: {},
      asArray: true,
      queries: {
        orderByKey: true,
        startAt: moment().weekday(that.weekCounter + 7).startOf('week').unix().toString(),
        endAt: moment().weekday(that.weekCounter + 7).endOf('week').unix().toString()
      },
      then(snapshot) {
        if (snapshot.length > 0) {
          snapshot = getWorklog(snapshot)
          that.dataSet.setData(snapshot)
          that.weekCounter += 7
          that.setState({currentWeek: currentWeek.add(1, 'weeks')})
        } else {
          that.weekCounter += 7
          that.setState({currentWeek: currentWeek.add(1, 'weeks')})
          that.refs.notificationSystem.addNotification({
            message: 'There is no worklog to see next!',
            level: 'warning'
          })
        }
      }
    })
  }

  componentDidMount() {
    let that = this
    let {user} = this.props
    rebase.fetch(`worklogs/${user.uid}`, {
      context: {},
      asArray: true,
      queries: {
        orderByKey: true,
        startAt: moment().startOf('week').unix().toString(),
        endAt: moment().endOf('week').unix().toString()
      },
      then(snapshot) {
        snapshot = getWorklog(snapshot)
        that.dataSet.setData(snapshot)
      }
    })
  }
  render() {
    let {currentWeek} = this.state
    return (
      <section className='app__main col-sm-9 col-md-9 col-lg-9'>
      <NotificationSystem ref='notificationSystem' />
        <div className='row'>
          <h4>Week {currentWeek.week()}: {currentWeek.startOf('week').format('DD/MM/YYYY')} - {currentWeek.endOf('week').format('DD/MM/YYYY')}</h4>
        </div>
        <div className='row'>
          <BootstrapTable data={this.dataSet}>
            <TableHeaderColumn dataAlign='center' dataField='day' isKey={true}>Day</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center' dataField='checkin'>Checkin</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center' dataField='checkout'>Checkout</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center' dataField='breaktime'>Breaktime</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center' dataField='total'>Total</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <br/>
        <div className='row'>
          <div className='col-sm-2 col-md-2 col-lg-2'>
            <button id='prev-btn' className='btn btn-primary' onClick={this._onPrev}>Previous</button>
          </div>
          <div className='col-sm-offset-1 col-sm-2 col-md-offset-1 col-md-2 col-lg-offset-1 col-lg-2'>
            <button id='next-btn' className='btn btn-primary' onClick={this._onNext}>Next</button>
          </div>
        </div>
      </section>
    )
  }
}

function getWorklog(snapshot) {

  snapshot = _.chain(snapshot).map(obj => {
    // Display multiple worklong
    // Still buggy
    if (obj.worklog.length >= 2) {
      return {
        day: moment.unix(Number(obj.key)).format('dddd'),
        checkin: _.reduce(obj.worklog, (prev, curr) => {
          return convertTime(prev.checkin) + ', ' + convertTime(curr.checkin)
        }),
        checkout: _.reduce(obj.worklog, (prev, curr) => {
          return convertTime(prev.checkout) + ', ' + convertTime(curr.checkout)
        }),
        breaktime: 0,
        total: 0
      }
    // Display single worklog
    } else {
      return {
        day: moment.unix(Number(obj.key)).format('dddd'),
        checkin: convertTime(obj.worklog[0].checkin),
        checkout: convertTime(obj.worklog[0].checkout),
        breaktime: obj.worklog[0].breaktime,
        total: Math.floor(obj.worklog[0].total / 60).toString() + ':' + (obj.worklog[0].total % 60).toString()
      }
    }
  }).value()
  return snapshot
}
