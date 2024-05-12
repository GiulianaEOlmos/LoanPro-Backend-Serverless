"use strict";

const { getAllRecordsByUserId } = require("../helper/handleRecords");
const { headers } = require("../helper/utils.js");

/**
 * @param {Object} event - The event object containing the details of the user.
 * @property {string} event.body - A JSON string containing the user data. This should be parsed using JSON.parse before accessing its properties.
 * @property {string} event.body.userID - The unique identifier of the user for whom the records are to be fetched.
 */
module.exports.handler = async (event) => {
  const { userID } = JSON.parse(event.body);
  try {
    const records = await getAllRecordsByUserId(userID);

    const notDeletedRecords = records.filter(
      (record) => record.isDeleted !== true
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          records: notDeletedRecords,
          input: event,
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.log(error);
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
