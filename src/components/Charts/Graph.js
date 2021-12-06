import React from 'react'
import { Bar } from 'react-chartjs-2';
import './Charts.css';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from 'jspdf'
import { Button } from '@mui/material';

export const Graph = (props) => {
     const options = {
          responsive: true,
          maintainAspectRatio: false,
     }

     const downloadGraph = () => {
          var url_base64jp = document.getElementById(props.name+'-graph').toDataURL("image/jpg");
          var doc = new jsPDF();
          doc.text(`${props.name.charAt(0).toUpperCase() + props.name.slice(1)} chart`,60 ,15)
          doc.addImage(url_base64jp, 15, 40, 180, 100);
          doc.save(props.name+'-chart.pdf');    
     }

     return (
          <div className="graph-container">
               {Object.keys(props.chartData).length !=0 && <Button id={props.name+'-download'}
                    onClick={downloadGraph}
                    className="download-icon"
                    style={{color:'royalblue'}}
                    title="Download">
                    <FileDownloadIcon/>
                    Download
               </Button>}
               <Bar className="graph" id={props.name+'-graph'} options={options} data={props.chartData} />
          </div>
     )
}

export default React.memo(Graph)