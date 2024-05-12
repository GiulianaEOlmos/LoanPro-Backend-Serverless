const { handler } = require("../lambdas/getUserData");
const { getUserById } = require("../helper/handleUsers");

jest.mock("../helper/handleUsers");

describe("getUserData handler", () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  it("returns 200 and user data if user is found", async () => {
    const email = "test@example.com";
    const user = { id: "123", email };
    getUserById.mockResolvedValue(user);

    const event = {
      body: JSON.stringify({ email }),
    };

    const expectedResponse = {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          user,
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
    const email = "test@example.com";
    const error = new Error("Database error");
    getUserById.mockRejectedValue(error);

    const event = {
      body: JSON.stringify({ email }),
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
