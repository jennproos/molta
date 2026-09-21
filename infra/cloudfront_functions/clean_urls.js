function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Leave the root, folder-style paths, and anything with a file
    // extension (assets, /_next/static/*, etc.) alone. Next.js's static
    // export writes each route as a flat "<route>.html" file, so a
    // request for an extension-less path like "/services" needs to be
    // rewritten to "/services.html" to resolve against S3.
    if (uri.endsWith('/') || uri.includes('.')) {
        return request;
    }

    request.uri = uri + '.html';
    return request;
}
