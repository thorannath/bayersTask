import React from 'react'
import { Bar } from 'react-chartjs-2';

export const Graph = (props) => {
     const options = {
          responsive: true,
          maintainAspectRatio: false,
     }

     return ( <div className="graph-container"><Bar className="graph" options={options} data={props.chartData}/></div> )
}

export default Graph