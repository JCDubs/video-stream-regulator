#!/bin/bash

echo "Starting Video Stream Service Serverless Application"

rm -rf out.log
yarn start >> out.log &

# Wait for service to start; this is an invalid request which should always return 400 when service is running
RETRY=40
INCREMENT=0
while [ -z $(grep "server ready: http://localhost:3000" out.log) ];
do 
    # Add timeout to exit after N seconds/iterations
    printf '.'
    ((INCREMENT++))
    sleep 1
    if [ $INCREMENT -ge $RETRY ]; then echo "RETRY EXCEEDED" && exit 1; fi;
done

echo "Video Stream Service Serverless Application running."
echo "Sarting e2e tests..."
# Execute Acceptance Tests
yarn cucumber

# # Capture the PID of the serverless process
read pid <<< $(ps | grep ".bin/sls offline" | grep -v grep | awk '{print $1}')

# # Kill the serverless process
echo "Tearing down Video Stream Service Serverless Application [" $pid "]"
kill $pid
exit 0