# WEBFLOW-SCRAPER (⚠️ Proof of Concept)

Scrape the website automatically by publishing the webflow project and upload it over SFTP to a webserver.

## Why?

Due to european legal reasons (GDPR) some of our customers are insecure about webflow hosting.
We wanted a solution where we could still design and develop with webflow but not be bound to the hosting.

## What you need

- Payed Webflow plan
- Hoster with SSH support, PHP 8.0
- Github account

## Usage

1. Fork the project on Github
- WEBFLOW_BASE_URL: staging URL of your Webflow project. This is used to replace the placeholder %WEBFLOW_BASE_URL% in the .env file with the actual URL where the project is hosted.
-ADDITIONAL_URLS: additional URLs of files that should be saved on your server. This is used to replace the placeholder %ADDITIONAL_URLS% in the .env file with the actual URLs of the files that need to be saved.
- WEBFLOW_SITE_ID: site ID of your Webflow project. This is used to replace the placeholder %WEBFLOW_SITE_ID% in the .env file with the actual site ID of your project.
- PERSONAL_ACCESS_TOKEN: a GitHub access token used for authentication. This is used to replace the placeholder %PERSONAL_ACCESS_TOKEN% in the .env file with the actual token value.
- REPOSITORY_VENDOR: the name of your repository, consisting of two strings: "vendor/repository". This secret is used to replace the placeholder %REPOSITORY_VENDOR% in the .env file with the actual vendor name.
- REPOSITORY_NAME: the name of your repository, consisting of two strings: "vendor/repository". This secret is used to replace the placeholder %REPOSITORY_NAME% in the .env file with the actual repository name.
- WORKFLOW_FILE: the name of the file located in .github/workflows. This secret is used to replace the placeholder %WORKFLOW_FILE% in the .env file with the actual name of the workflow file.
- BRANCH: the name of the GitHub branch. This secret is used to replace the placeholder %BRANCH% in the .env file with the actual branch name.
- MAIN_FOLDER_NAME: basically the URL of your Webflow project without "https://" and without trailing "/". This secret is used to replace the placeholder %MAIN_FOLDER_NAME% in the .htaccess file with the actual URL of your Webflow project.
- PUBLIC_URL: the domain on which the main site should run. This secret is used to replace the placeholder %PUBLIC_URL% in the .htaccess file with the actual domain on which the main site should run.



2. Add Github project secrets https://docs.github.com/en/actions/security-guides/encrypted-secrets
- `REMOTE_HOST` host of server
- `REMOTE_PORT` port of server (most likely 22)
- `REMOTE_USER` username of SFTP-User
- `REMOTE_TARGET` which folder to save the project ot
- `SERVER_SSH_PRIVATE_KEY` used to authenticate sftp user (https://www.cyberciti.biz/faq/how-to-set-up-ssh-keys-on-linux-unix/)
- `WEBFLOW_BASE_URL` staging url of your webflow project `https://your-project.webflow.io`
- `ADDITIONAL_URLS` additional urls of which files should be saved on your server `https://assets.website-files.com, https://d3e54v103j8qbb.cloudfront.net` 
- `WEBFLOW_SITE_ID` site id of your webflow project; how to find it: https://www.briantsdawson.com/blog/webflow-api-how-to-get-site-collection-and-item-ids-for-zapier-and-parabola-use 
- `PERSONAL_ACCESS_TOKEN` generate an github access token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- `REPOSITORY_VENDOR` the name of your repository consists of two strings "vendor/repository" use the first part before /
- `REPOSITORY_NAME` the name of your repository consists of two strings "vendor/repository" use the second part after /
- `WORKFLOW_FILE` the name of the file located in `.github/workflows` most likely `production.yml`
- `BRANCH` the name of the github branch most likely `main`
- `MAIN_FOLDER_NAME` basically the url of your webflow project without `https://` and without trailing `/` in this example `your-project.webflow.io`
- `PUBLIC_URL` the domain on which the main site should run `https://www.yourproject.com/`
4. Deploy the site to your server
5. Point the domain of your website to the public folder
6. Go to webflow > Project settings > Integrations
7. At the bottom add a webhook
8. Choose `site publish` from the dropdown
9. The URL for the webhook will be `www.yourdomain.com/trigger/index.php`

## Debugging / Enhancing

To debug or to enhance the project you need to node 14 and php 8.0 on your local machine.
The easiest way to debug your script locally is to let it run once and copy the `.env` file from your server into your local repository.
Should the script not run successfully just copy the `.env.sample` file and rename it to `.env`. Replace all the variables for example `%WEBFLOW_BASE_URL%` with the values you set in Github.

### Testing scraper
- Run `npm install`
- Run `npm run download`

### Testing webhook
- Install composer
- run `composer install`
- Set up a local environment with php
- Link the local environment to the `public` folder
- Download Postman https://www.postman.com/downloads/
- Set up a POST-Request in Postman and set the URL to `yourlocaldomain.local/trigger/index.php`
- Set the body of the POST-Request to `raw`
- Insert `{
  "site": "webflow-site-id",
  "publishTime": 1648037553150
  }` into the body
- Send request

### Testing if Webflow correctly sends webhook
- Go to https://webhook.site/
- Copy the unique URL
- Add it in your Integrations tab
- Publish your site

## Known challenges

- Form submissions - solution https://discourse.webflow.com/t/guide-custom-and-self-hosted-form-processor-for-your-webflow-forms-en-de/187275
- Time based publishing of content - kind of solution, run the deployment every hour?

