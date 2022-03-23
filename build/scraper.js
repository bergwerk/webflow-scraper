import scrape from 'website-scraper';
import SaveToExistingDirectoryPlugin from 'website-scraper-existing-directory';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'

const baseUrl = process.env.WEBFLOW_BASE_URL;

// Add base url to allowed urls
const allowedUrls = [baseUrl]

if (process.env.ADDITIONAL_URLS) {
    process.env.ADDITIONAL_URLS.split(',').map(function (item) {
        allowedUrls.push(item.trim());
    });
}

function fromDir(startPath, filter, callback) {
    if (!fs.existsSync(startPath)) {
        return;
    }

    // Recursively read directories
    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); //recurse
        } else if (filter.test(filename)) callback(filename);
    }
}

const options = {
    // Run the scraper on the base url and include sitemap.xml and robots.txt (only works on custom domains)
    urls: [baseUrl, baseUrl + '/sitemap.xml', baseUrl + '/robots.txt'],
    // Check if current url is in the
    urlFilter: function (url) {
        const urlObject = new URL(url);
        return allowedUrls.includes(urlObject.origin);
    },
    // Where to save the files
    directory: './public',
    filenameGenerator: 'bySiteStructure',
    recursive: true,
    ignoreErrors: true,
    plugins: [new SaveToExistingDirectoryPlugin()]
};

// Scrape website
const result = await scrape(options).then(() => {
    // Find all html files in the directory
    fromDir(options.directory, /\.html$/, function (filename) {
        // Read file content
        fs.readFile(filename, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            // Replace all occurrences of
            // - .index.html (cleans up the urls)
            // -   (weird non breakable space webflow adds)
            // - � (weird character webflow adds after &)
            let result = data.replace(/index\.html/g, '').replace(/ /g, '').replace(/�/g, '');

            // Write changed content for the file
            fs.writeFile(filename, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    });
});

