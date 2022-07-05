# Early Hints Worker

A Cloudflare Worker that uses [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) in
order to select assets from the page that we want to include in [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
headers, so that Cloudflare can cache these and emit [103 Early Hints](https://developers.cloudflare.com/cache/about/early-hints/) responses.

## Blog Post

Curious about what each part of the code does and why it's used?

Check out my [blog post!](https://kian.org.uk/implementing-103-early-hints-with-cloudflare-workers-htmlrewriter/)

## Requirements

- [A Cloudflare Account](https://dash.cloudflare.com/sign-up/workers) and a website using Cloudflare.
- [wrangler](https://github.com/cloudflare/wrangler2)

## Instructions

1. Make sure that Early Hints is enabled in [Speed -> Optimization](https://dash.cloudflare.com/?to=/:account/:zone/speed/optimization)
1. Clone the repository.
2. Make sure that your `wrangler` logged in to your Cloudflare account.
3. Open `wrangler.toml` and add a `route` key as necessary to make the Worker run on your website.
```toml
route = { pattern = "example.com/*", zone_name = "example.com" } 
```
4. If necessary, make any changes to the HTML element selectors. You don't want to preload lazy-loaded images, as an example.
5. Run `wrangler publish` and the Worker will be live on your website!
