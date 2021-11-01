import React from 'react'
import './Introduction.css';
import studyDesign from './study_design.png';

const Introduction = () => {
    return (
        <div>
            <div id="content" className="section">
                <h2>Content</h2>
                <ul>
                    <li><a href="#objective">Objective</a></li>
                    <li><a href="#patient_selection">Patient Selection</a></li>
                    <li><a href="#study_design">Study Design</a></li>
                    <li><a href="#optum_administrative_claims_database">Optum Administrative Claims Database</a></li>
                </ul>
            </div>
            <hr />

            <div id="objective" className="section">
                <h2> Objective </h2>
                <div id="introduction">
                    <h3>Introduction</h3>
                    <p>
                        The CKD Population Navigator is a data visualization and analytics tool based upon the results of a retrospective, cross-sectional analysis of the Optum Administrative claims database to describe the Chronic Kidney Disease and Type 2 Diabetes patient landscape within the database in the year 2019. The tool allows users to explore the following characteristics in the type 2 diabetes (T2D), chronic kidney disease (CKD), and CKD and T2D populations: demographic, clinical (i.e., events, comorbidities), medication use, and kidney labs.
                    </p>
                </div>
                <div>
                    <h3>Objective</h3>
                    <p>
                        Understand the demographic and clinical characteristics of individuals with Type II Diabetes(T2D), Chronic Kidney Disease (CKD), and CKD w/ T2D within a commercial/medicare advantage claims database.
                    </p>
                </div>
                <p className="back"> Back to <a href="#content">Content</a></p>
            </div>
            <hr />

            <div id="patient_selection" className="section">
                <h2> Patient Selection </h2>
                <ul>
                    <li>Cohort: T2D without CKD
                        <ul>
                            <li> Inclusion: At least 1 diagnosis code for T2D in 2019</li>
                            <li>Exclusion: &lt;18 years of age; diagnosis of CKD in 2019</li>
                        </ul>

                    </li>
                    <li>Cohort: CKD without T2D
                        <ul>
                            <li>Inclusion: At least 1 diagnosis code for CKD in 2019</li>
                            <li>Exclusion: &lt;18 years of age; diagnosis of T2D in 2019</li>
                        </ul>
                    </li>
                    <li>Cohort: CKD and T2D
                        <ul>
                            <li>Inclusion: At least 1 diagnosis code for CKD and 1 diagnosis code for T2D in 2019</li>
                            <li>Exclusion: &lt;18 years of age</li>
                        </ul>
                    </li>
                </ul>
                <p>Note: Continuous eligibility was not a requirement for any cohort.</p>
                <p className="back"> Back to <a href="#content">Content</a></p>
            </div>
            <hr />

            <div id="study_design" className="section">
                <h2>Study Design</h2>
                <p>Study design: Cross-sectional analysis</p>
                <p>Study period: 1 January 2019 – 31 December 2019</p>

                <img alt="background" src={studyDesign} style={{margin:30}}/>
                <p>All analyses are descriptive in nature and displayed using tables and figures. Descriptive analyses of the data were performed using summary statistics. Measures including clinical events, comorbidities, provider types, and medication use are reported as the number and percentage of patients in a cohort who had a particular demographic or clinical characteristic, or had visited a provider specialty of interest.</p>
                <p className="back"> Back to <a href="#content">Content</a></p>
            </div>
            <hr />

            <div id="optum_administrative_claims_database" className="section">
                <h2> Optum Administrative Claims Database </h2>
                <p>More information about Optum administrative claims dataset</p>
                <ul>
                    <li>Data from January 2007 to present</li>
                    <li>Health plan-based</li>
                    <li>Includes between 12.4 to 14 million unique commercial members each year</li>
                    <li>~3.5 million Medicare enrollment in 2015 with steady growth</li>
                    <li>Represents ~25% of Medicare Advantage enrollment in the United States</li>
                </ul>
                <p className="back"> Back to <a href="#content">Content</a></p>
            </div>
            <hr />
        </div>
    )
}

export default Introduction
