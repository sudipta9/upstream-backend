const generatePassword = () => {
  var password = "";
  const str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";
  for (let i = 1; i <= 16; i++) {
    var char = Math.floor(Math.random() * str.length + 1);
    password += str.charAt(char);
  }
  return password;
};

module.exports = generatePassword;
