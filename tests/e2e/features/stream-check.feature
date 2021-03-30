Feature: Hello World

    Scenario: Attempt GET with user that exceeds the max of three streams
        Given The lambda service is running on "localhost" and port 3000
        When I GET "streams/check/d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f"
        Then response code should be 200
        And response body key "canWatch" should contain value "false"
        And response body key "numOfStreams" should contain value "3"
    
    Scenario: Attempt GET with user that does not exceed the max of three streams
        Given The lambda service is running on "localhost" and port 3000
        When I GET "streams/check/c9d09a26a5967a384fbbb8d10322c8ea49d3be976926930f549d0950"
        Then response code should be 200
        And response body key "canWatch" should contain value "true"
        And response body key "numOfStreams" should contain value "1"

    Scenario: Attempt GET with user that is not currently streaming
        Given The lambda service is running on "localhost" and port 3000
        When I GET "streams/check/c9d09a26a5967a384fbbb8d10322c8ea49d3be976926930f549d0953"
        Then response code should be 200
        And response body key "canWatch" should contain value "true"
        And response body key "numOfStreams" should contain value "0"
