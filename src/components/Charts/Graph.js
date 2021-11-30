import React from 'react'
import { Bar } from 'react-chartjs-2';
import './Charts.css';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const Graph = (props) => {

     console.log(props);
     const options = {
          responsive: true,
          maintainAspectRatio: false,
     }

     const downloadGraph = () => {
          /*Get image of canvas element*/
          var url_base64jp = document.getElementById(props.name+'-graph').toDataURL("image/jpg");
          var a = document.getElementById(props.name+'-download');
          /*insert chart image url to download button (tag: <a></a>) */
          a.href = url_base64jp;
     }

     return (
          <div className="graph-container">
               {Object.keys(props.chartData).length !=0 && <a id={props.name+'-download'}
                    onClick={downloadGraph}
                    download={props.name+'-chart.jpg'}
                    href=""
                    className="download-icon"
                    title="Download">
                    <FileDownloadIcon />
               </a>}
               <Bar className="graph" id={props.name+'-graph'} options={options} data={props.chartData} />
          </div>
     )
}

export default React.memo(Graph)