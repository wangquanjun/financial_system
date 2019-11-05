import React, { Component } from 'react'
import { connect } from "dva";


@connect(state => ({
  commonLanguage: state.common.commonLanguage
}))
export default class unopen extends Component {
  render() {
    return (
      <div className="upopen-page">
          <img src="/image/unopen.png" alt=""/>
          <div className="unopen">
            {this.props.commonLanguage.common_comingsoon}
          </div>
      </div>
    )
  }
}

