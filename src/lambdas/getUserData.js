"use strict";

const CryptoJS = require("crypto-js");
const { getUserById } = require("../helper/handleUsers");
const { headers } = require("../helper/utils.js");

/**
 * @param {Object} event - The event object containing the request details.
 * @property {string} event.body - A JSON string containing the user data. This should be parsed using JSON.parse before accessing its properties.
 * @property {string} event.body.email - The email of the user.
 *
 * This function handles the request based on the details provided in the event object. The event.body is expected to be a JSON string, which is parsed into an object for further processing.
 */
module.exports.handler = async (event) => {
  console.log("event: ", event);

  const { email } = JSON.parse(event.body);

  var userID = CryptoJS.MD5(email).toString();
  console.log("userID: ", userID);

  try {
    const user = await getUserById(userID, email);
    console.log({ user });

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
