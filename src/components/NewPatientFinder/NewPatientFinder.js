import { borderRadius, compose, flexbox, height, textAlign } from "@mui/system";
import axios from "axios";
import Cookies from 'js-cookie';
import * as constants from "../../Constant";
import { useSelector } from "react-redux";
import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { FormControlLabel, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import AccordianCheckbox from "../Inputs/AccordianCheckbox";
import Select from "react-select";
import FormGroup from "@mui/material/FormGroup";
import { invert } from "lodash";
import { FormLabel } from "@mui/material";
import { useState, useEffect } from "react";
import { Bar, PolarArea, Radar } from "react-chartjs-2";

//  constants for cohort and payertypes

const groupType = {
    Cohort: "cohort",
    PayerType: "paytype",
};

//consant colors for charts

const colorsRadar = ['#003f5c80', '#66519180', '#ff7c4380'];
const borderColor = ['#003f5c', '#665191', '#ff7c43']
const colors = ['#003f5c', '#665191', '#ff7c43']



//main component 

const NewPatientFinder = () => {

    //initialData for the json body   
    const initialDatajs = {
        preferenceId: "",
        preferenceName: "",
        groupBy: groupType.Cohort,
        states: [],
        cohorts: { ckd: true, diab: true, both: true },
        payType: { MCR: true, COM: true },
        treatmentSelected: "",
        medicalConditionsSelected: "",
        treatmentsOR: [],
        treatmentsAND: [],
        medicalConditionsAND: [],
        medicalConditionsOR: [],
    };


    //// selector from redux
    const treatments = useSelector(state => state.labels.treatments);
    const medicalConditions = useSelector(state => state.labels.medicalConditions);
    const treatment = useSelector(state => state.labels.treatments).map(data => ({ value: data.label_val, label: data.name }));
    const medicalCondition = useSelector(state => state.labels.medicalConditions).map(data => ({ value: data.label_val, label: data.name }));


    //all usestates of the component
    const [form, setForm] = useState({ ...initialDatajs });
    const [labelsOfTreatment, setLabelsOfTreatment] = useState({});
    const [labelsOfMedical, setLabelsOfMedical] = useState({});
    const states = invert(constants.States);
    const [selectioner, setSelection] = useState(["diab", "both", "ckd"]);
    const [chartTreatment, setChartTreatment] = useState({})
    const [chartMedical, setChartMedical] = useState({})
    const [selectedTreatment, setSelectedTreatment] = useState(treatment);
    const [selectedMedicalConditions, setSelectedMedicalConditions] = useState(medicalCondition);




    // set data with treatments and labels api
    useEffect(() => {
        let object = {};
        treatments.map(val => {
            object[val.label_val] = val.name;
        });
        setLabelsOfTreatment(object);
    }, [treatments]);


    useEffect(() => {
        let object = {};
        medicalConditions.map(val => {
            object[val.label_val] = val.name;
        });
        setLabelsOfMedical(object);
    }, [medicalConditions]);







    // all on change components 
    const onChangeForm = (data) => {
        setForm({ ...form, ...data });

    };

    const onChangeRadio = (event) => {
        let radio = event.target.value;

        if (radio === groupType.Cohort) {
            setSelection(["diab", "both", "ckd"])
        }
        else {
            setSelection(["MCR"])
        }
        onChangeForm({
            groupBy: event.target.value
        });

    };

    const onChangeTreatments = (data) => {
        let dat = { treatmentsOR: data }
        setForm({ ...form, ...dat })

    }

    const onChangeMedical = (data) => {
        let dat = { medicalConditionsOR: data }
        setForm({ ...form, ...dat })


    }

    const onChangeState = (data) => {
        onChangeForm({ states: data })

    }

    const reset = () => {
        setForm({ ...initialDatajs })
    }





    ////request body for API call

    const jsonForm = () => {
        const treatmentLabels = selectedTreatment.map(data => {
            let treatment = treatments.find(val => val.label_val == data.value);
            return treatment?.label;
        });
        const medicalConditionLabels = selectedMedicalConditions.map((data) => {
            let medicalCondition = medicalConditions.find(val => val.label_val == data.value);
            return medicalCondition?.label;
        });
        return {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
            jsonData: {
                group_condition: {
                    group_by: form.groupBy,
                    selection: selectioner
                },
                states: form.states ? form.states.map(data => data.value) : null,
                treatments: {
                    labels: treatmentLabels,
                    OR: form.treatmentsOR ? form.treatmentsOR.map(data => data.value) : null,
                    AND: null,
                },
                medical_conditions: {
                    labels: medicalConditionLabels,
                    OR: form.medicalConditionsOR ? form.medicalConditionsOR.map(data => data.value) : null,
                    AND: null,
                }
            }
        }


    }



    ////Api calls to bayer-njit-backend

    const callApi = () => {
        treatmentApi();

    }

    const treatmentApi = () => {

        let req = jsonForm();

        let url = constants.BACKEND_URL + '/patientfinder/treatments';
        axios.post(url, req)
            .then((response) => {

                let chartData = response.data.data;
                // console.log(response.data)
                chartData.treatments.labels.shift();
                chartData.treatments.data = chartData.treatments.data.map((e, i) => {
                    const ALL_DATA = e.data.shift();
                    const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
                    return { type: e.type, data: result };
                });
                const treatmentsChart = createChart(chartData.treatments);
                setChartTreatment({ ...treatmentsChart });
                medicalApi();

            }
            )
            .catch((error) => { console.log(error); }
            )


    }


    const medicalApi = () => {
        let url = constants.BACKEND_URL + '/patientfinder/medicals';
        let req = jsonForm();
        // console.log(req)
        // alert("2")
        axios.post(url, req)
            .then((response) => {

                let chartData = response.data.data;
                // console.log(response)
                chartData.medical_conditions.labels.shift();
                chartData.medical_conditions.data = chartData.medical_conditions.data.map((e, i) => {
                    const ALL_DATA = e.data.shift();
                    const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
                    return { type: e.type, data: result };
                });
                const medicalChart = createChart(chartData.medical_conditions);
                setChartMedical({ ...medicalChart });
                MedicalChart();

            }
            )
            .catch((error) => { console.log(error); }
            )
    }






    //chart data according to the needs
    const createChart = (obj) => {
        const chart = { labels: obj.labels, datasets: [] }
        obj.data.map((val, index) => {
            chart.datasets.push({
                label: val.type,
                backgroundColor: colorsRadar[index],
                borderColor: borderColor[index],
                data: val.data

            });

        })

        return chart;
    }

    //medical chart component 
    const MedicalChart = () => {
        var data = chartMedical;
        var lab = data.labels
        const splitdata = { labels: lab, datasets: [] };

        const options = {
            responsive: true,
            // maintainAspectRatio: false,
            indexAxis: 'y',
        }
        data.datasets?.map((user) => {
            splitdata.datasets.push({
                label: user.label,
                backgroundColor: user.borderColor,
                data: user.data

            })
            // console.log(splitdata)

        })


        return (
            <div>
                <h2 style={{ textAlign: "center", borderRadius: 20, backgroundColor: "#4d79ff", margin: "5px 30px", color: "white" }}>Medical report</h2>
                <div style={{
                    backgroundColor: '#db709380',
                    color: "white",
                    padding: 12,
                    transparency: 0.5,
                    margin: "3px",
                    borderRadius: 5,
                    color: '#2B2118',
                    lineHeight: 1.4,
                    letterSpacing: 0.2,
                    fontSize: '15px'
                }}>
                    This figure displays the prevalence of specific medication use among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medication classes to customize the display. Display groups can be presented by cohort (default) or by payor type.
                </div>
                <Bar options={options} data={splitdata} />

            </div>
        )
    }


    //treatments chart component 

    const TreatmentsChart = () => {

        const options = {
            responsive: true,
            // maintainAspectRatio: false,
            indexAxis: 'y',
        }


        return (<div>
            <h2 style={{ textAlign: "center", borderRadius: 20, backgroundColor: "#4d79ff", margin: "5px 30px", color: "white" }}>Treatment Chart</h2>
            <div style={{
                backgroundColor: '#db709380',
                color: "white",
                padding: 12,
                transparency: 0.5,
                margin: "3px",
                borderRadius: 5,
                color: '#2B2118',
                lineHeight: 1.4,
                letterSpacing: 0.2,
                fontSize: '15px'
            }}>
                This figure displays the prevalence of specific medical conditions among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medical conditions to customize the display. Display groups can be presented by cohort (default) or by payor type.
            </div>
            <Radar data={chartTreatment} />

        </div>
        )
    }




    return (
        <div style={styles.container}>
            <div style={styles.mainbar}>
                <TreatmentsChart />
                <MedicalChart />
            </div>

            <div style={styles.sidebar}>
                <h3 style={{ textAlign: "center" }}>New Patient Finder Definition</h3>

                <FormGroup className="formGroup" margin="20px">
                    <FormLabel style={{ color: "white" }} className="formLabel">
                        GROUP BY
                    </FormLabel>
                    <RadioGroup row value={form.groupBy} onClick={onChangeRadio}>
                        <FormControlLabel
                            value={groupType.Cohort}
                            control={<Radio color="default" />}
                            label={
                                <Typography variant="body2" color="white">
                                    Cohort
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            value={groupType.PayerType}
                            control={<Radio color="default" />}
                            label={
                                <Typography variant="body2" color="white">
                                    Payer
                                </Typography>
                            }
                        />
                    </RadioGroup>
                </FormGroup>

                <AccordianCheckbox name="States" data={form.states} labels={states} onChange={onChangeState} />
                <AccordianCheckbox name="Treatments with OR" data={form.treatmentsOR} labels={labelsOfTreatment} onChange={onChangeTreatments} />
                <AccordianCheckbox name="Medical Condition with OR" data={form.medicalConditionsOR} labels={labelsOfMedical} onChange={onChangeMedical} />
                <div style={{ marginTop: '20px', marginLeft: "70px" }}>
                    <button onClick={callApi} style={{ backgroundColor: "blue", color: 'white', padding: '20px', width: '100px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', fontWeight: "bold" }}> Update</button>
                    <button onClick={reset} style={{ color: "blue", backgroundColor: 'white', borderBottomRightRadius: '10px', width: '100px', borderTopRightRadius: '10px', padding: '20px', fontWeight: "bold" }}>Reset</button>
                </div>
            </div>
        </div>
    );
};


//styles components
const styles = {
    container: {
        display: "flex",
        // height: "100vh",
    },
    sidebar: {
        marginTop: "5px",
        marginRight: "3px",
        width: "25%",
        backgroundColor: "#4d79ff",
        color: "white",
        border: "5px",
        alignContent: "center",
        overflowY: 'scroll',
        //  overflowX:'hidden',
        borderRadius: "20px",
        padding: "10px",
    },
    mainbar: {
        width: "75%",
    },
};

export default NewPatientFinder;
