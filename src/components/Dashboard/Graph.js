import React, { useEffect, useState } from 'react'
import {Bar} from 'react-chartjs-2';

export const Graph = (props) => {    
        return (
            <div className="graph">
                    <Bar
                        data={props.chartData}
                        options={{
                            title: {
                                display: true,
                                text: 'Average Rainfall per month',
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }}
                    />
                
            </div>
        )
}

export default Graph