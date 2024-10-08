require("dotenv").config();

const { User } = require("../../models/user");
const { getUserByUserName } = require("../../services/auth");
const { sendResponse } = require("../../utils/response");

// Batch check if usernames exist in the database
const checkUsernamesInDatabase = async (usernames) => {
  const existingUsers = await User.find(
    { username: { $in: usernames } },
    "username"
  );
  const existingUsernames = existingUsers.map((user) => user.username);
  return existingUsernames;
};

// Suggest username alternatives and check them in batch
const suggestUsernames = async (username) => {
  const suggestions = new Set(); // Use a Set to avoid duplicates
  let attempts = 0;

  while (suggestions.size < 3 && attempts < 5) {
    const batch = [];
    for (let i = 0; i < 5; i++) {
      // Randomly choose between a 3-digit or 4-digit number
      const randomNumber =
        Math.random() < 0.5
          ? Math.floor(Math.random() * 1000) // 3-digit number
          : Math.floor(Math.random() * 9000) + 1000; // 4-digit number

      const suggestion = `${username}${randomNumber}`;

      // Ensure the total length is between 4 and 25 characters
      if (suggestion.length >= 4 && suggestion.length <= 25) {
        batch.push(suggestion);
      }
    }

    const existingUsernames = await checkUsernamesInDatabase(batch);

    // Filter out the usernames that are already taken
    batch.forEach((suggestion) => {
      if (!existingUsernames.includes(suggestion) && suggestions.size < 3) {
        suggestions.add(suggestion);
      }
    });

    attempts++;
  }

  return Array.from(suggestions); // Convert Set back to Array
};

// Check if username is available or suggest alternatives
const checkUsername = async (req, res) => {
  let { username } = req.query;

  if (!username) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "Username is required.",
      title: "Request failed",
    });
  }

  // Ensure username is lowercase and validate length
  username = username.trim().toLowerCase();
  // Check base username length
  if (username.length < 4) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "Username must be greater than 4",
      title: "Request failed",
    });
  }

  try {
    // Check if the username exists in the database
    const user = await getUserByUserName(username);

    if (user) {
      // Username taken, suggest alternatives that don't exist
      const suggestions = await suggestUsernames(username);
      // console.log("suggestions", suggestions);
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: `User with username ${username} is already taken.`,
        title: "Request Sucessfull",
        Response: suggestions,
      });
    }

    // Username available
    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: `${username} is available.`,
      title: "Request successful",
    });
  } catch (error) {
    console.error("Error checking username:", error?.message || error);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error.message || "Error checking username",
      title: "Request failed",
    });
  }
};

module.exports = { checkUsername };
