"use strict";

const CryptoJS = require("crypto-js");
const { getUserById } = require("../helper/handleUsers");
const { headers } = require("../helper/utils.js");

/**
 * @param {Object} event - The event object containing operation details.
 * @property {string} event.body - A JSON string containing the operation details.
 * @property {string} event.body.email - The email of the user trying to log in.
 * @property {string} event.body.password - The password of the user trying to log in.
 * The 'event.body' property should be parsed using JSON.parse before accessing its properties.
 */
module.exports.handler = async (event) => {
  console.log(JSON.stringify(event));

  const { email, password } = JSON.parse(event.body);

  var userID = CryptoJS.MD5(email).toString();
  console.log("userID: ", userID);

  const passwordHash = CryptoJS.MD5(password).toString();
  console.log("passwordHash: ", passwordHash);

  try {
    const user = await getUserById(userID, email);
    console.log({ user });

    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          message: "The user does not exist",
        }),
      };
    }

    if (user.password !== passwordHash) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          message: "Unauthorized",
        }),
      };
    }

    if (!user.isActive) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          message: "This user is inactive",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          user: user,
          input: event,
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify(
        {
          message: error,
          input: event,
        },
        null,
        2
      ),
    };
  }
};
