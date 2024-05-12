# Serverless Backend with AWS Lambda and DynamoDB

## Introduction

Arithmetic Calculator REST API project. This is a web platform designed to provide simple calculator functionality, including addition, subtraction, multiplication, division, square root operations, and a random string generation feature. Each functionality has a separate cost per request.

## Prerequisites

- Node.js
- AWS CLI
- Serverless Framework

## Installation

1. Clone the repository:

```bash
git clone https://github.com/GiulianaEOlmos/serverless-backend-truenorth
```

2. Navigate to the project directory:

```bash
cd serverless-backend-truenorth
```

3. Install the dependencies:

```bash
   npm install
```

## Deployment

1. Install the Serverless Framework globally:

```bash
npm install -g serverless
```

2. Configure your AWS credentials using the AWS CLI:

```bash
aws configure
```

3. Deploy the application:

```bash
serverless deploy
```

## Invoking Lambdas Locally

To invoke a lambda function locally using the Serverless Framework, use the `invoke local` command followed by the `--function` option and the name of the function:

```bash
serverless invoke local --function functionName
```

Replace `functionName` with the name of the function you want to invoke.

###

Here some examples

```bash
serverless invoke local --function getUserData --data "{\"body\": \"{\\\"email\\\": \\\"user3@gmail.com\\\"}\"}"
```

## API Endpoints

### `POST /v1/login`

#### Request

The request body must include the following properties:

- `email` (string): The user's email address.
- `password` (string): The user's password.

Example:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Response

#### Example (success):

```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "isActive": true,
    "password": "5f4dcc3b5aa765d61d8327deb882cf99"
    "balance": 100
  },
  "input": {
    "email": "user@example.com",
    "password": "password"
  }
}
```

### `POST /v1/getUserData`

#### Request

The request body must include the following properties:

- `email` (string): The user's email address.

Example:

```json
{
  "email": "user@example.com"
}
```

#### Response

##### Example (success):

```json
{
    "user": {
        "id": "c4ca4238a0b923820dcc509a6f75849b",
        "email": "user@example.com",
        "isActive": true,
        "password": "5f4dcc3b5aa765d61d8327deb882cf99"
        "balance": 100
    },
    "input": {
        "email": "user@example.com"
    }
}
```

### `POST /v1/newOperation`

#### Request

The request body must include the following properties:

- `userID` (string): The ID of the user performing the operation.
- `userBalance` (number): The current balance of the user.
- `cost` (number): The cost of the operation.
- `type` (string): The type of the operation. Can be one of the following: 'addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string'.
- `input` (object): The input values for the operation. This object should have the following properties:
  - `a` (number): The first input value. Used in all operation types except 'random_string'.
  - `b` (number): The second input value. Used in 'addition', 'subtraction', 'multiplication', and 'division' operations.

Example:

```json
{
  "userID": "c4ca4238a0b923820dcc509a6f75849b",
  "userBalance": 100,
  "cost": 10,
  "type": "addition",
  "input": {
    "a": 5,
    "b": 3
  }
}
```

#### Response

##### Example (success):

```json
{
  "userID": "c4ca4238a0b923820dcc509a6f75849b",
  "response": {
    "newBalance": 90,
    "result": 8
  }
}
```

### `POST /v1/getRecords`

#### Request

The request body must include the following properties:

- `userID` (string): The ID of the user for whom the records are to be fetched.

Example:

```json
{
  "userID": "c4ca4238a0b923820dcc509a6f75849b"
}
```

#### Response

##### Example (success):

```json
{
  "records": [
    {
      "id": "1",
      "userID": "c4ca4238a0b923820dcc509a6f75849b",
      "type": "addition",
      "amount": 10,
      "balance": 100,
      "operationResponse": 3,
      "date": "2022-01-01T00:00:00.000Z"
    }
    // More records...
  ],
  "input": {
    "userID": "c4ca4238a0b923820dcc509a6f75849b"
  }
}
```

### `POST /v1/deleteRecord`

#### Request

The request body must include the following properties:

- `recordID` (string): The ID of the record to be deleted.
- `userID` (string): The ID of the user performing the operation.

Example:

```json
{
  "recordID": "1",
  "userID": "c4ca4238a0b923820dcc509a6f75849b"
}
```

#### Response

##### Example (success):

```json
{
  "recordID": "1",
  "input": {
    "recordID": "1",
    "userID": "c4ca4238a0b923820dcc509a6f75849b"
  }
}
```

## Testing

To run the tests, use the following command:

```bash
npm test
```
