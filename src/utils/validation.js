const containsNumbers = num => (value) => {
  let numberOfNumbers = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (/\d/.test(value.charAt(i))) {
      numberOfNumbers += 1;
    }
  }
  return numberOfNumbers >= num;
};

const containsLetters = num => (value) => {
  let numberOfLetters = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (value.charAt(i).match(/[a-z]/i)) {
      numberOfLetters += 1;
    }
  }
  return numberOfLetters >= num;
};

const hasNoSymbols = (value) => {
  const lettersAndNumbers = /^[0-9a-zA-Z]+$/;
  for (let i = 0; i < value.length; i += 1) {
    if (!value.charAt(i).match(lettersAndNumbers)) {
      return false;
    }
  }
  return true;
};

const containsCharacters = num => (value) => {
  const validChars = '!@#$%^&*'.split('');
  let numberOfChars = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (validChars.includes(value.charAt(i))) {
      numberOfChars += 1;
    }
  }
  return numberOfChars >= num;
};

/**
 * Validate E-Mail
 * https://github.com/manishsaraan/email-validator/blob/master/index.js
 * @param {string} email E-Mail Address
 * @return {boolean} Valid
 */
const validateEmail = (email) => {
  const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;

  if (email.length > 254) return false;

  const valid = tester.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");
  return !domainParts.some(part => part.length > 63);
};

module.exports = {
  containsCharacters,
  containsLetters,
  containsNumbers,
  validateEmail,
  hasNoSymbols,
};
