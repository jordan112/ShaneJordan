# shanejordan.com

## Deploy to prod

    npm run build

    aws s3 cp build s3://ui-shanejordan-source --recursive

    > don't forget to auth a session first
