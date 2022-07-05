# Early Hints Worker - coming soon

A Cloudflare Worker that uses [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) in
order to select assets from the page that we want to include in [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
headers, so that Cloudflare can cache these and emit [103 Early Hints](https://developers.cloudflare.com/cache/about/early-hints/) responses.

## Requirements

- [A Cloudflare Account](https://dash.cloudflare.com/sign-up/workers)
- [Wrangler2](https://github.com/cloudflare/wrangler2)
