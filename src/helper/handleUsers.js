const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * UserModel is an object that represents a user in the system.
 *
 * @typedef {Object} UserModel
 * @property {string} userID - The unique identifier for the user.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password. This should be stored securely and never displayed in plain text.
 * @property {boolean} isActive - A flag indicating whether the user's account is active.
 * @property {number} balance - The current balance of the user's account.
 */

async function getUserById(userId) {
  const params = {
    TableName: "Users",
    Key: {
      userID: userId,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();

    return data.Item;
  } catch (error) {
    console.error(`Error getting user with id ${userId}: `, error);
  }
}

async function updateUserBalance(userId, newBalance) {
  try {
    const params = {
      TableName: "Users",
      Key: {
        userID: userId,
      },
      UpdateExpression: "set balance = :b",
      ExpressionAttributeValues: {
        ":b": newBalance,
      },
      ReturnValues: "UPDATED_NEW",
    };

    console.log({ params, newBalance, userId });
    await dynamoDB.update(params).promise();

    console.log(`Balance updated for user with id ${userId}: `);
  } catch (error) {
    console.error(
      `Error updating balance: ${newBalance} for user with id ${userId}: `,
      error
    );
    throw error;
  }
}

module.exports = { getUserById, updateUserBalance };
