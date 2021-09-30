import React from 'react'
import {Bar} from 'react-chartjs-2';

export const Graph = (props) => {    
        return (
            <div className="graph">
                    <Bar data={props.chartData}/>
            </div>
        )
}

export default Graph