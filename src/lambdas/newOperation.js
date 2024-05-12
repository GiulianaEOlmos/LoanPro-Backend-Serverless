"use strict";

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { updateUserBalance } = require("../helper/handleUsers");
const { createRecord } = require("../helper/handleRecords");
const { headers } = require("../helper/utils.js");

async function handleOperation(event) {
  const { userID, type, input, cost, userBalance } = JSON.parse(event.body);

  let result, newBalance;

  try {
    switch (type) {
      case "addition":
        result = input.a + input.b;
        break;
      case "subtraction":
        result = input.a - input.b;
        break;
      case "multiplication":
        result = input.a * input.b;
        break;
      case "division":
        if (input.b === 0) {
          throw new Error("Division by zero is not allowed");
        }
        result = input.a / input.b;
        break;
      case "square_root":
        if (input.a < 0) {
          throw new Error("Square root of negative number is not allowed");
        }
        result = Math.sqrt(input.a);
        break;
      case "random_string":
        await axios
          .get(
            "https://www.random.org/strings/?num=1&len=20&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new"
          )
          .then((response) => {
            result = response.data.trim();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      default:
        throw new Error(`Unsupported operation type: ${type}`);
    }

    newBalance = userBalance - cost;

    return {
      userID,
      type,
      newBalance,
      result,
      cost,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Object} event - The event object containing operation details.
 * @property {string} event.body - A JSON string containing the operation details.
 * @property {string} event.body.userID - The ID of the user performing the operation.
 * @property {number} event.body.userBalance - The current balance of the user.
 * @property {number} event.body.cost - The cost of the operation.
 * @property {('addition'|'subtraction'|'multiplication'|'division'|'square_root'|'random_string')} event.body.type - The type of the operation.
 * @property {Object} event.body.input - The input values for the operation.
 * @property {number} event.body.input.a - The first input value. Used in all operation types.
 * @property {number} event.body.input.b - The second input value. Used in 'addition', 'subtraction', 'multiplication', and 'division' operations.
 *
 * This function handles different types of operations based on the 'type' property of the event object.
 * For 'addition', 'subtraction', 'multiplication', and 'division', both 'a' and 'b' properties of the 'input' object are used.
 * For 'square_root', only the 'a' property of the 'input' object is used.
 * For 'random_string', the 'input' object is not used.
 *
 * The 'event.body' property should be parsed using JSON.parse before accessing its properties.
 */
module.exports.handler = async (event) => {
  try {
    const { userID, type, result, newBalance, cost } = await handleOperation(
      event
    );

    console.log({ userID, type, result, newBalance });

    const record = {
      id: uuidv4(),
      userID,
      type,
      amount: cost,
      balance: newBalance,
      operationResponse: result,
      date: new Date().toISOString(),
    };

    const promises = [
      updateUserBalance(userID, newBalance),
      createRecord(record),
    ];

    await Promise.all(promises);

    const response = {
      newBalance,
      result,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          userID,
          response,
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
