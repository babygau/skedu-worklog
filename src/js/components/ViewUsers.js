import React, {Component} from 'react'
import {connect} from 'react-redux'
import {pushState} from 'redux-router'
import {editUserAction, editWorklogAction} from '../actions'
import {rebase} from '../firebase'
import DateTimeField from 'react-bootstrap-datetimepicker'
import {BootstrapTable, TableHeaderColumn, TableDataSet} from 'react-bootstrap-table'
import moment from 'moment'
import Rx from 'rx'
import _ from 'lodash'

@connect(state => ({}))
export default class ViewUsers extends Component {

  constructor(props) {
    super(props)
    this.state = {allusers: []}
    this.dataSet = new TableDataSet([])
    this._onRowSelected = this._onRowSelected.bind(this)
  }

  _onRowSelected(row, isSelected) {
    let {allusers} = this.state
    let {dispatch} = this.props
    let [editUser] = _.filter(allusers, (obj) => obj.key === row.key)
    rebase.fetch(`worklogs/${row.key}`, {
      context: {},
      asArray: true,
      then(editWorklog) {
        editWorklog = _.chain(editWorklog).map(editObj => {
          return _.map(editObj.worklog, subObj => {
            return {...subObj, date: moment.unix(Number(editObj.key)).format('DD/MM/YYYY')}
          })
        }).flatten().reverse().value()
        dispatch(editWorklogAction(editWorklog))
        dispatch(editUserAction(editUser))
        dispatch(pushState(null, `/app/edit/user/${row.key}`))
      }
    })
  }

  componentWillMount() {
    let that = this
    rebase.fetch('users', {
      context: {},
      asArray: true,
      queries: {
        orderByChild: 'firstname'
      },
      then(snapshot) {
        that.setState({allusers: snapshot})
        snapshot = _.chain(snapshot)
          .map(obj => ({
            key: obj.key,
            firstname: obj.firstname,
            lastname: obj.lastname,
            email: obj.email,
            address: obj.address
          }))
          .value()
        that.dataSet.setData(snapshot)
      }
    })
  }

  render() {
    let that = this

    return (
      <section className='app__main col-sm-9 col-md-9 col-lg-9'>
        <div className='row'>
          <div className='col-sm-12 col-md-12 col-lg-12'>
            <h4>Employees Info: </h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-md-12 col-lg-12'>
            <BootstrapTable striped={true} hover={true} data={this.dataSet} selectRow={{mode: 'checkbox', clickToSelect: true, hideSelectColumn: true, onSelect: that._onRowSelected}}>
              <TableHeaderColumn dataField='key' width='0' isKey={true} hidden={true}>Key</TableHeaderColumn>
              <TableHeaderColumn dataAlign='center' width='150' dataField='firstname'>First Name</TableHeaderColumn>
              <TableHeaderColumn dataAlign='center' width='150' dataField='lastname'>Last Name</TableHeaderColumn>
              <TableHeaderColumn dataAlign='left' width='300' dataField='email'>Email</TableHeaderColumn>
              <TableHeaderColumn dataAlign='left' width='300' dataField='address'>Address</TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
      </section>
    )
  }
}
