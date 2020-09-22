// Function Checking if email is valid or not
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
  }
  // Function Checking if string is empty or not
  const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
  }

  exports.validateSignupData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
      errors.email = 'Please fill it in'
    } else if (!isEmail(data.email)) {
      errors.email = 'Please fill a valid Email address'
    }

    if (isEmpty(data.password)) errors.password = 'Please fill it in';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must be the same';
    if (isEmpty(data.userHandle)) errors.userHandle = 'Please fill it in';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true :  false
    }
  }

  exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Please fill it in';
    if(isEmpty(data.password)) errors.password = 'Please fill it in';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true :  false
    }
  }