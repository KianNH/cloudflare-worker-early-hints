interface PreloadResourceHint {
  url: string;
  fileType: "style" | "image" | "script";
}

export default {
  async fetch(request: Request, env: {}, ctx: ExecutionContext) {
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

    let preloads: PreloadResourceHint[] = [];

    class ElementHandler {
      element(element: Element) {
        switch (element.tagName) {
          case "img": {
            const url = element.getAttribute("src");
            if (url && !url.startsWith("data:")) {
              preloads.push({ url, fileType: "image" });
            }
            break;
          }
          case "script": {
            const url = element.getAttribute("src");
            if (url && !url.startsWith("data:")) {
              preloads.push({ url, fileType: "script" });
            }
            break;
          }
          case "link": {
            const url = element.getAttribute("href");
            if (url && !url.startsWith("data:")) {
              preloads.push({ url, fileType: "style" });
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

    preloads = [...new Map(preloads.map(v => [v.url, v])).values()]
    preloads.forEach((element) => {
      headers.append(
        "link",
        `<${element.url}>; rel=preload; as=${element.fileType}`
      );
    });

    return new Response(body, {
      ...response,
      headers: headers,
    });
  },
};
