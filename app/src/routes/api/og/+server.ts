import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { RequestHandler } from "./$types";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const width = 1200;
const height = 630;

export const GET: RequestHandler = async ({ url }) => {
  const title = url.searchParams.get("title") || "NixOS SC Election 2025";
  const description =
    url.searchParams.get("description") ||
    "Browse candidates, questions, and responses";
  const type = url.searchParams.get("type") || "default";

  const fontsDir = process.env.FONTS_DIR || join(process.cwd(), "static/fonts");

  const fontDataRegular = await readFile(
    join(fontsDir, "Route159-Regular.woff"),
  );

  const fontDataBold = await readFile(join(fontsDir, "Route159-Bold.woff"));

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#000",
          padding: "80px",
          fontFamily: "Route 159",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 72,
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.1,
                      maxWidth: "100%",
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 36,
                      color: "#9ca3af",
                      lineHeight: 1.4,
                      maxWidth: "90%",
                    },
                    children: description,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: 28,
                color: "#6b7280",
              },
              children: "NixOS Steering Committee Election 2025",
            },
          },
        ],
      },
    },
    {
      width,
      height,
      fonts: [
        {
          name: "Route 159",
          data: fontDataRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Route 159",
          data: fontDataBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
