#!/usr/bin/env bash

SECRETS=`/home/ubuntu/.local/bin/aws secretsmanager get-secret-value --secret-id "prod/zephyr-api" --region us-west-2 | jq -rc '.SecretString'`

RESULT=""

for s in $(echo $SECRETS | /usr/bin/jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]"); do
    RESULT="$RESULT$s\n"
done

printf $RESULT

echo $RESULT > /home/ubuntu/app/.env
