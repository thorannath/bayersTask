import React, { useState, useEffect } from 'react';
import SankeyDiagram from '../Charts/SankeyDiagram';
import * as d3 from 'd3';
import NewSankeyDiagram from '../Charts/NewSankeyDiagram';

const styles = {
  container: {
    padding: '50px 20px 20px 20px'
  },
  section: {
    borderTop: '2px dotted grey',
    marginTop: '20px',
    paddingTop: '20px'
  },
  infoBox: {
    backgroundColor: 'rgb(183,206,206, 0.5)',
    padding: 12,
    transparency: 0.5,
    borderRadius: 5,
    color: '#2B2118',
    lineHeight: 1.4,
    letterSpacing: 0.2,
    fontSize: '15px'
  }
}


const MedicationSequence = () => {

  const [data, setData] = useState(null);

  useEffect(()=>{
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_sankey.json").then((res) => {
      setData(res);
    });
  },[])

  return (
    <div style={styles.container}>
      <h2> Medication Sequence </h2>
      <div style={styles.infoBox}>
        <b>Instructions</b><br />
        This page provides an overview of the sankey diagram. Need to add the description about the sankey diagram.</div>
      <div>
        {
          data && <SankeyDiagram data={data} />
        } 
      </div>
      <div>
        {
          data && <NewSankeyDiagram data={data}/>
        }
      </div>
    </div>
  );
};

export default MedicationSequence;
