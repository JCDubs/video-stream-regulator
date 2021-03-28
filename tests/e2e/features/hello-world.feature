Feature: Hello World

    Scenario: Attempt POST with a valid content path
        Given The lambda service is running on "localhost" and port 3000
        And I set the request body as "validHelloRequestBody.json"
        When I POST to "/dev/hello"
        Then response code should be 200
        And response body key "message" should contain value "Hello Frederic, welcome to the exciting Serverless world!"
