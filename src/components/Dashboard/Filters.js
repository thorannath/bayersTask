import React, { Component } from 'react'
import Dashboard from './Dashboard';

export default class Filters extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
  }


  render() {
    return (
      <div className="filters">
        <div>
          State
        </div>
        <div>
          Payer Type
        </div>
        <div>
          Patient Cohort
        </div>
        <div>
          Medical Condition
        </div>
        <div>
          Medical Condition
        </div>
        <div>
          Treatment
        </div>
        <div>
          Treatment
        </div>
      </div>
    )
  }

}
