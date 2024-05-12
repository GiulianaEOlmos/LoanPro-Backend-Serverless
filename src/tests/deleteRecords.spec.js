// deleteRecord.test.js
const { handler } = require("../lambdas/deleteRecords");
const { deleteRecordById } = require("../helper/handleRecords");

jest.mock("../helper/handleRecords");

describe("deleteRecord handler", () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  it("returns 200 if record is successfully deleted", async () => {
    const recordID = "123";
    const userID = "456";
    deleteRecordById.mockResolvedValue();

    const event = {
      body: JSON.stringify({ recordID, userID }),
    };

    const expectedResponse = {
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

    const response = await handler(event);
    expect(response).toEqual(expectedResponse);
  });

  it("returns 401 if an error occurs", async () => {
    const recordID = "123";
    const userID = "456";
    const error = new Error("Database error");
    deleteRecordById.mockRejectedValue(error);

    const event = {
      body: JSON.stringify({ recordID, userID }),
    };

    const expectedResponse = {
      statusCode: 401,
      headers,
      body: JSON.stringify(
        {
          message: {},
          input: event,
        },
        null,
        2
      ),
    };

    const response = await handler(event);
    expect(response).toEqual(expectedResponse);
  });
});
