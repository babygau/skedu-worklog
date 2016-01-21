import React, {Component, PropTypes} from 'react'
import SideBar from './SideBar'
import {connect} from 'react-redux'


@connect(state => ({ isAuthenticated: state.authentication.isAuthenticated }))
export default class App extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    let {isAuthenticated} = this.props
    return isAuthenticated ? (
      <div className='row app'>
        <SideBar />
        {/*
          Let React Router figure out which component it will render
        */}
        { this.props.children }
      </div>
    ) : false
  }
}
