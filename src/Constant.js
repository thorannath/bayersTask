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

export const MESSAGE_TYPES = {
    CREATE_PREFERENCE:'CREATE_PREFERENCE',
    VIEW_PREFERECNE:'VIEW_PREFERECNE',
    EDIT_PREFERENCE:'EDIT_PREFERENCE'
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



export const States = {'Alabama': 'AL', 'Alaska': 'AK', 'Arkansas': 'AR', 'Arizona': 'AZ', 'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'}