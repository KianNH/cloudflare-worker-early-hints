# Early Hints Worker

A Cloudflare Worker that uses [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) in
order to select assets from the page that we want to include in [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
headers, so that Cloudflare can cache these and emit [103 Early Hints](https://developers.cloudflare.com/cache/about/early-hints/) responses.

## Blog Post

Curious about what each part of the code does and why it's used?

Check out my [blog post!](https://kian.org.uk/implementing-103-early-hints-with-cloudflare-workers-htmlrewriter/)

## Notes

If your site has a lot of `img`/`script`/`link[rel=stylesheet]` elements, you will want to make sure you're scoping the selectors to the specific ones you want to preload! If your `link` header gets too large, this can cause issues - many servers or CDNs limit the size of an individual header to 8192B (8KB).

## Requirements

- [A Cloudflare Account](https://dash.cloudflare.com/sign-up/workers) and a website using Cloudflare.
- [wrangler](https://github.com/cloudflare/wrangler2)

## Instructions

1. Make sure that Early Hints is enabled in [Speed -> Optimization](https://dash.cloudflare.com/?to=/:account/:zone/speed/optimization)
2. Clone the repository.
3. Make sure that your `wrangler` logged in to your Cloudflare account.
4. Open `wrangler.toml` and add a `route` key as necessary to make the Worker run on your website.
```toml
route = { pattern = "example.com/*", zone_name = "example.com" } 
```
5. If necessary, make any changes to the HTML element selectors. You don't want to preload lazy-loaded images, as an example.
6. Run `wrangler publish` and the Worker will be live on your website!
