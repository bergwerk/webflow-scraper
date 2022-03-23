<?php

// Load installed extensions
require_once './vendor/autoload.php';

// Set response type to json
header('content-type: application/json');

try {
    if ($json = json_decode(file_get_contents("php://input"), true)) {
        // Given data is json
        $data = $json;
    } else {
        // Given data is a form post
        $data = $_POST;
    }

    // Load .env file in the root of the project
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->load();

    // check if the given site id matches
    if ($data['site'] === $_ENV['WEBFLOW_SITE_ID']) {
        // Establish Github client connection
        $client = new \Github\Client();

        // Authenticate with personal access token
        // More authentication methods available: https://github.com/KnpLabs/php-github-api/blob/master/doc/security.md#authentication--security
        $client->authenticate($_ENV['GITHUB_PERSONAL_ACCESS_TOKEN'], '', \Github\AuthMethod::ACCESS_TOKEN);

        // Dispatch workflow
        $response = $client->api('repo')->workflows()->dispatches(
            $_ENV['GITHUB_REPOSITORY_VENDOR'],
            $_ENV['GITHUB_REPOSITORY_NAME'],
            $_ENV['GITHUB_WORKFLOW_FILE'],
            $_ENV['GITHUB_BRANCH']
        );

        // Output response, if it works it's an empty string
        echo json_encode($response);
    }
} catch (Exception $e) {
    // Output error message
    echo json_encode($e->getMessage());
}

