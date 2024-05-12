const axios = require("axios");
const { handler } = require("../lambdas/newOperation");
const { updateUserBalance } = require("../helper/handleUsers");
const { createRecord } = require("../helper/handleRecords");
const { v4: uuidv4 } = require("uuid");

jest.mock("axios");
jest.mock("../helper/handleUsers");
jest.mock("../helper/handleRecords");
jest.mock("uuid");

describe("handler", () => {
  const event = {
    body: JSON.stringify({
      userID: "testUser",
      userBalance: 100,
      cost: 10,
      type: "addition",
      input: {
        a: 5,
        b: 3,
      },
    }),
  };

  it("returns 200 and operation result if operation is successful", async () => {
    updateUserBalance.mockResolvedValue();
    createRecord.mockResolvedValue();
    uuidv4.mockReturnValue("testUUID");

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          userID: "testUser",
          response: {
            newBalance: 90,
            result: 8,
          },
        },
        null,
        2
      ),
    });
  });

  it('returns a random string when the operation type is "random_string"', async () => {
    const eventWithRandomString = {
      body: JSON.stringify({
        ...JSON.parse(event.body),
        type: "random_string",
      }),
    };

    axios.get.mockResolvedValue({ data: "randomStringFromAPI" });
    updateUserBalance.mockResolvedValue();
    createRecord.mockResolvedValue();
    uuidv4.mockReturnValue("testUUID");

    const result = await handler(eventWithRandomString);

    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          userID: "testUser",
          response: {
            newBalance: 90,
            result: "randomStringFromAPI",
          },
        },
        null,
        2
      ),
    });
  });

  it("returns 401 and error message if an error is thrown", async () => {
    updateUserBalance.mockRejectedValue("Error message");

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: "Error message",
          input: event,
        },
        null,
        2
      ),
    });
  });
});
