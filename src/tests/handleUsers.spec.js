const AWS = require("aws-sdk");
const { getUserById, updateUserBalance } = require("../helper/handleUsers");

describe("User operations", () => {
  beforeEach(() => {
    AWS.DynamoDB.DocumentClient.prototype.get = jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve({ Item: {} }) });
    AWS.DynamoDB.DocumentClient.prototype.update = jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve() });
  });

  it("gets a user by id", async () => {
    const mockUserId = "test-user-id";

    await getUserById(mockUserId);

    expect(AWS.DynamoDB.DocumentClient.prototype.get).toHaveBeenCalledWith({
      TableName: "Users",
      Key: {
        userID: mockUserId,
      },
    });
  });

  it("updates user balance", async () => {
    const mockUserId = "test-user-id";
    const mockNewBalance = 100;

    await updateUserBalance(mockUserId, mockNewBalance);

    expect(AWS.DynamoDB.DocumentClient.prototype.update).toHaveBeenCalledWith({
      TableName: "Users",
      Key: {
        userID: mockUserId,
      },
      UpdateExpression: "set balance = :b",
      ExpressionAttributeValues: {
        ":b": mockNewBalance,
      },
      ReturnValues: "UPDATED_NEW",
    });
  });
});
