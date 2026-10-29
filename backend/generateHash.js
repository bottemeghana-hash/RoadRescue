const bcrypt = require("bcryptjs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the admin password to generate its hash: ", async (password) => {
  try {
    if (!password) {
      console.log("Password cannot be empty.");
      return;
    }

    const hash = await bcrypt.hash(password, 12);
    console.log("\nAdmin password hash:");
    console.log(hash);
  } catch (error) {
    console.error("Unable to generate password hash.");
  } finally {
    rl.close();
  }
});