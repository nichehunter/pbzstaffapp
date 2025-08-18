export function randomCode(index1, index2) {
  const code = ("" + Math.random()).substring(index1, index2);

  return code;
}

export function generateRandomPassword(word) {
  const numbers = "0123456789";
  const specialChar = "@";
  const numDigits = 3;
  let digits = "";

  // Generate 3 random digits
  for (let i = 0; i < numDigits; i++) {
    digits += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  let password = word + specialChar + digits;

  // If the combined length of the word, special character, and digits is less than 8, add more random digits
  while (password.length < 8) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return password;
}

export function getFirstWord(sentence) {
  const words = sentence.trim().split(" ");
  if (words.length > 0) {
    return words[0].toLowerCase();
  }
  return "";
}

export function otpCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  // Function to get a random element from a given string
  const getRandomElement = (str) =>
    str.charAt(Math.floor(Math.random() * str.length));

  // Generate 3 random letters and 3 random numbers
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += getRandomElement(letters);
    code += getRandomElement(numbers);
  }

  // Shuffle the code to mix letters and numbers
  code = code
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return code;
}

export function lifeTime(time) {
  const lifeTime = time * 60 * 1000; // 3 minutes in milliseconds

  return lifeTime;
}

// export function startCountdown(props) {
//   const{setExpiryTime, setIsActive, duration} = props

//   const now = new Date().getTime();
//   const endTime = now + duration;
//   setExpiryTime(endTime);
//   setIsActive(true);
// }
