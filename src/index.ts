// valid 'as' attribute values, see Chromium source:
// https://source.chromium.org/chromium/chromium/src/+/refs/tags/103.0.5060.9:services/network/public/mojom/link_header.mojom;l=20
type LinkAsAttribute = "image" | "script" | "style" | "font"

interface Env {
  preconnect_domains: string[];
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    ctx.passThroughOnException();

    const response = await fetch(request);

    if (response.status !== 200) {
      console.log(`${request.url} returned (${response.status}), skipping`);
      return response;
    }

    const contentType = response.headers.get("content-type");
    if (contentType === null || !contentType.startsWith("text/html")) {
      console.log(`${request.url} is (${contentType}), skipping`);
      return response;
    }

    let preloads: Record<string, LinkAsAttribute> = {}

    class ElementHandler {
      element(element: Element) {
        switch (element.tagName) {
          case "img": {
            const url = element.getAttribute("src");
            if (url && !url.startsWith("data:")) {
              preloads[url] =  "image";
            }
            break;
          }
          case "script": {
            const url = element.getAttribute("src");
            if (url && !url.startsWith("data:")) {
              preloads[url] =  "script";
            }
            break;
          }
          case "link": {
            const url = element.getAttribute("href");
            if (url && !url.startsWith("data:")) {
              preloads[url] =  "style";
            }
            break;
          }
        }
      }
    }

    const transformed = new HTMLRewriter()
      .on("img:not([loading=lazy])", new ElementHandler())
      .on("script", new ElementHandler())
      .on("link[rel=stylesheet]", new ElementHandler())
      .transform(response);

    const body = await transformed.text();
    const headers = new Headers(response.headers);

    for (const [url, fileType] of Object.entries(preloads)) {
      headers.append(
        "link",
        `<${url}>; rel=preload; as=${fileType}`
      );
    }

    if (env.preconnect_domains) {
      env.preconnect_domains.forEach((url) => {
        headers.append("link", `<${url}>; rel=preconnect`);
      });
    }

    return new Response(body, {
      ...response,
      headers: headers,
    });
  },
};
