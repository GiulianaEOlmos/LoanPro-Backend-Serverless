const AWS = require("aws-sdk");
const {
  createRecord,
  getAllRecordsByUserId,
  deleteRecordById,
} = require("../helper/handleRecords");

describe("Record operations", () => {
  beforeEach(() => {
    AWS.DynamoDB.DocumentClient.prototype.put = jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve() });
    AWS.DynamoDB.DocumentClient.prototype.scan = jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve({ Items: [] }) });
    AWS.DynamoDB.DocumentClient.prototype.update = jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve() });
  });

  it("creates a record", async () => {
    const mockRecord = {
      id: "test-id",
      userID: "test-user-id",
      type: "addition",
      amount: 10,
      balance: 100,
      operationResponse: 110,
      date: "2022-01-01",
    };

    await createRecord(mockRecord);

    expect(AWS.DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledWith({
      TableName: "Records",
      Item: mockRecord,
    });
  });

  it("gets all records by user id", async () => {
    const mockUserID = "test-user-id";

    await getAllRecordsByUserId(mockUserID);

    expect(AWS.DynamoDB.DocumentClient.prototype.scan).toHaveBeenCalledWith({
      TableName: "Records",
      FilterExpression: "userID = :userID",
      ExpressionAttributeValues: {
        ":userID": mockUserID,
      },
    });
  });

  it("deletes a record by id", async () => {
    const mockRecordID = "test-record-id";
    const mockUserID = "test-user-id";

    await deleteRecordById(mockRecordID, mockUserID);

    expect(AWS.DynamoDB.DocumentClient.prototype.update).toHaveBeenCalledWith({
      TableName: "Records",
      Key: {
        id: mockRecordID,
        userID: mockUserID,
      },
      UpdateExpression: "set isDeleted = :d",
      ExpressionAttributeValues: {
        ":d": true,
      },
      ReturnValues: "UPDATED_NEW",
    });
  });
});
