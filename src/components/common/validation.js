exports.validateName = (nameString)=>{
    /**
     * Validation function for Name in Form
     * NOTE: Element with id as in `messageBoxId`, must be set to `{visibility: hidden}` style before running this function.
     * @function: validateName
     * @param {string} nameString - string for name value which is required to validate
     * @returns {Object} {
     *   error: true if there is an error else false (incase of no errors in validation).
     *   message: indicating why the error has occured
     * }
     */
    nameString = nameString.trim();
    const errorStatus = {error: false, message: ""}, namePattern = /^[a-zA-Z\s0-9]+$/, maxLength = 128;
    if(!namePattern.test(nameString) || nameString.length > maxLength){
        errorStatus.message = `Name must only contain (0-9), (A-Z), (a-z) or spaces with max ${maxLength} characters.`;
        errorStatus.error = true;
    }
    return errorStatus;
}

exports.validateEmail = (nameString)=>{
    /**
     * Validation function for Name in Form
     * NOTE: Element with id as in `messageBoxId`, must be set to `{visibility: hidden}` style before running this function.
     * @function: validateName
     * @param {string} nameString - string for name value which is required to validate
     * @returns {Object} {
     *   error: true if there is an error else false (incase of no errors in validation).
     *   message: indicating why the error has occured
     * }
     */
    nameString = nameString.trim();
    const errorStatus = {error: false, message: ""}, namePattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, maxLength = 128;
    if(!namePattern.test(nameString) || nameString.length > maxLength){
        errorStatus.message = `Enter a valid email!`;
        errorStatus.error = true;
    }
    return errorStatus;
}