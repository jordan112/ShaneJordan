# shanejordan.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/f8623624-cfff-4980-a2de-2c548a34db74/deploy-status)](https://app.netlify.com/sites/eloquent-wescoff-3fc01a/deploys)

## Deploy to prod

    npm run build

    aws s3 cp build s3://ui-shanejordan-source --recursive

    > don't forget to auth a session first
