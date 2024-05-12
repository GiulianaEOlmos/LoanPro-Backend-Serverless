"use strict";

const { deleteRecordById } = require("../helper/handleRecords");
const { headers } = require("../helper/utils.js");
/**
 * @param {Object} event - The event object containing the details of the record.
 * @property {string} event.body - A JSON string containing the record data. This should be parsed using JSON.parse before accessing its properties.
 * @property {string} event.body.recordID - The unique identifier of the record to be deleted.
 * @property {string} event.body.userID - The unique identifier of the user performing the operation.
 */
module.exports.handler = async (event) => {
  const { recordID, userID } = JSON.parse(event.body);

  try {
    await deleteRecordById(recordID, userID);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          recordID,
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
