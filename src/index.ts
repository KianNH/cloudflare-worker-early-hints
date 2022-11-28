// valid 'as' attribute values, see Chromium source:
// https://source.chromium.org/chromium/chromium/src/+/refs/tags/103.0.5060.9:services/network/public/mojom/link_header.mojom;l=20
type LinkAsAttribute = "image" | "script" | "style" | "font";

interface Env {
  preconnect_domains: string[];
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    ctx.passThroughOnException();

    const response = await fetch(request);

    if (response.status !== 200) {
      return response;
    }

    const contentType = response.headers.get("content-type");
    if (contentType === null || !contentType.startsWith("text/html")) {
      return response;
    }

    const preloads: {
      [url: string]: { fileType: LinkAsAttribute; crossOrigin: string | null };
    } = {};

    class ElementHandler {
      element(element: Element) {
        switch (element.tagName) {
          case "img": {
            const url = element.getAttribute("src");
            if (url && !url.startsWith("data:")) {
              const crossOrigin = element.getAttribute("crossorigin");
              preloads[url] = { fileType: "image", crossOrigin };
            }
            break;
          }
          case "script": {
            const url = element.getAttribute("src");
            if (url && !url.startsWith("data:")) {
              const crossOrigin = element.getAttribute("crossorigin");
              preloads[url] = { fileType: "script", crossOrigin };
            }
            break;
          }
          case "link": {
            const url = element.getAttribute("href");
            if (url && !url.startsWith("data:")) {
              const crossOrigin = element.getAttribute("crossorigin");
              preloads[url] = { fileType: "style", crossOrigin };
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

    for (const [url, { fileType, crossOrigin }] of Object.entries(preloads)) {
      let value = `<${url}>; rel=preload; as=${fileType}`;
      if (crossOrigin) {
        value += `; crossorigin=${crossOrigin}`;
      }
      headers.append("link", value);
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
