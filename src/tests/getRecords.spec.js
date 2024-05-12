// getRecords.test.js
const { handler } = require("../lambdas/getRecords");
const { getAllRecordsByUserId } = require("../helper/handleRecords");

jest.mock("../helper/handleRecords");

describe("getRecords handler", () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  it("returns 200 and not deleted records if records are found", async () => {
    const userID = "123";
    const records = [
      { id: "1", isDeleted: false },
      { id: "2", isDeleted: true },
      { id: "3", isDeleted: false },
    ];
    getAllRecordsByUserId.mockResolvedValue(records);

    const event = {
      body: JSON.stringify({ userID }),
    };

    const expectedResponse = {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          records: records.filter((record) => !record.isDeleted),
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
    const userID = "123";
    const error = new Error("Database error");
    getAllRecordsByUserId.mockRejectedValue(error);

    const event = {
      body: JSON.stringify({ userID }),
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
