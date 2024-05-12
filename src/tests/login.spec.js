const CryptoJS = require("crypto-js");
const { handler } = require("../lambdas/login");
const { getUserById } = require("../helper/handleUsers");

jest.mock("../helper/handleUsers");

describe("handler", () => {
  const event = {
    body: JSON.stringify({
      email: "test@example.com",
      password: "password",
    }),
  };

  it("returns 200 and user data if login is successful", async () => {
    const user = {
      password: CryptoJS.MD5("password").toString(),
      isActive: true,
    };
    getUserById.mockResolvedValue(user);

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          user,
          input: event,
        },
        null,
        2
      ),
    });
  });

  it("returns 401 if user does not exist", async () => {
    getUserById.mockResolvedValue(null);

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "The user does not exist",
      }),
    });
  });

  it("returns 401 if password is incorrect", async () => {
    const user = {
      password: CryptoJS.MD5("wrongPassword").toString(),
      isActive: true,
    };
    getUserById.mockResolvedValue(user);

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    });
  });

  it("returns 401 if user is inactive", async () => {
    const user = {
      password: CryptoJS.MD5("password").toString(),
      isActive: false,
    };
    getUserById.mockResolvedValue(user);

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "This user is inactive",
      }),
    });
  });
});
