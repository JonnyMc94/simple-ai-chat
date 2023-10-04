import { insertUser, getUser } from "utils/sqliteUtils.js";

export default async function (req, res) {
  // Check if the method is POST.
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username } = req.body;

  // validation
  if (!username) {
    return res.status(400).json({ error: "User name is required." });
  }

  try {
    // Check user existance
    const user = await getUser(username);
    if (user) {
      return res.status(200).json(
        { 
          success: false, 
          message: "User exist." 
        });
    }

    const password = generateRandomString(8);
    await insertUser(username, password, "", "");  // password, settings, last_login
                                                   // insertUser will also check the user existance

    // No error
    return res.status(200).json(
      { 
        success: true,
        message: "User \"" + username + "\" is created with password \"" + password + "\""
      });
  } catch (error) {
    console.error("Error inserting user:", error);
    return res.status(500).json({ error: "An error occurred while adding the user." });
  }
}

function generateRandomString(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
