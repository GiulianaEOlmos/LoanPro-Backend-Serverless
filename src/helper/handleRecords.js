const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * RecordModel is an object that represents a record of a user operation in the system.
 *
 * @typedef {Object} RecordModel
 * @property {string} id - The unique identifier for the record.
 * @property {string} userID - The unique identifier for the user who performed the operation.
 * @property {string} type - The type of operation performed. This can be "addition", "subtraction", "multiplication", "division", "square_root", or "random_string".
 * @property {number} amount - The cost of the operation.
 * @property {number} balance - The balance of the user's account before the operation was performed.
 * @property {string|number} operationResponse - The result of the operation. This can be a string or a number, depending on the operation type.
 * @property {string} date - The date when the operation was performed.
 */

async function createRecord(record) {
  try {
    const params = {
      TableName: "Records",
      Item: record,
    };
    await dynamoDB.put(params).promise();

    console.log(`Record created for user with id ${record.userID}: `, record);
    return record;
  } catch (error) {
    console.error(
      `Error creating record for user with id ${record.userID}: `,
      error
    );
    throw error;
  }
}

async function getAllRecordsByUserId(userID) {
  try {
    const params = {
      TableName: "Records",
      FilterExpression: "userID = :userID",
      ExpressionAttributeValues: {
        ":userID": userID,
      },
    };

    const data = await dynamoDB.scan(params).promise();
    console.log(`Records retrieved for user with id ${userID}: `, data.Items);
    return data.Items;
  } catch (error) {
    console.error(
      `Error retrieving records for user with id ${userID}: `,
      error
    );
    throw error;
  }
}

async function deleteRecordById(recordID, userID) {
  try {
    const params = {
      TableName: "Records",
      Key: {
        id: recordID,
        userID: userID,
      },
      UpdateExpression: "set isDeleted = :d",
      ExpressionAttributeValues: {
        ":d": true,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamoDB.update(params).promise();
    console.log(
      `Record with id ${recordID} and userID ${userID} soft-deleted successfully.`
    );
  } catch (error) {
    console.error(
      `Error soft-deleting record with id ${recordID} and userID ${userID}: `,
      error
    );
    throw error;
  }
}


module.exports = { createRecord, getAllRecordsByUserId, deleteRecordById };
