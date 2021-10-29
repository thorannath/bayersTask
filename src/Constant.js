/* TODO: 
   1. Convert all constants to dynamic fetched values, based on the API calls for route /value. 
      Refer to API Documentation.
   2. Store the bakend api link within a constant and replace it with the magic constants used around the applications
   3. 
*/
export const Paytype = [ "MCR", "COM" ];


export const Patient_Cohort = ['ckd', 'diab', 'both'];

export const groupType = {
    Cohort: 'cohort',
    PayerType:'paytype'
}

export const groupBy = {
    POP:'pop',
    PAY_TYPE:'paytyp'
}


export const Logic = {
    AND:'AND',
    OR:'OR'
}

export const colors = ['#23B5D3', '#F7B801', '#495F41'];

export const labelTypes = {
    TREATMENT:'treatment',
    MEDICAL_CONDITION:'medical_condition'
}

export const routes = {
    Introduction: '/app/introduction',
    Dashboard: '/app/dashboard',
    Patient_Finder: '/app/patient-finder',
    Home:'/app/home',
}

export const messageTypes = {
    SUCCESS:'success',
    ERROR:'error'
}

export const States = [
    'WY',
    'WV',
    'WI',
    'WA',
    'VT',
    'VA',
    'UT',
    'UN',
    'TX',
    'TN',
    'SD',
    'SC',
    'RI',
    'PA',
    'OR',
    'OK',
    'OH',
    'NY',
    'NV',
    'NM',
    'NJ',
    'NH',
    'NE',
    'ND',
    'NC',
    'MS',
    'MO',
    'MN',
    'MI',
    'ME',
    'MD',
    'MA',
    'LA',
    'KY',
    'KS',
    'IN',
    'IL',
    'ID',
    'IA',
    'HI',
    'GA',
    'FL',
    'DC',
    'CT',
    'CO',
    'CA',
    'AZ',
    'AR',
    'AL'
];
