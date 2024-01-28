module.exports = function(eleventyConfig) {
    // GOV.UK Frontend JavaScript
    eleventyConfig.addPassthroughCopy({ "node_modules/govuk-frontend/dist/govuk/*.bundle.js": "js/govuk-frontend" });

    eleventyConfig.addPassthroughCopy("favicon.ico");
};