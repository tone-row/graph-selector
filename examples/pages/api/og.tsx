import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// Make sure the font exists in the specified path:
const font = fetch(
  new URL("../../assets/Karla-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const fontData = await font;
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundBlendMode: "normal",
            backgroundColor: "#0000",
            backgroundImage:
              "linear-gradient(to bottom right, #ffffff, #ab7fd1)",
            backgroundPosition: "0 0",
            backgroundRepeat: "repeat, repeat, repeat",
            backgroundSize: "102% 100%",
            backgroundAttachment: "scroll, scroll, scroll",
            backgroundOrigin: "padding-box, padding-box, padding-box",
            backgroundClip: "border-box, border-box, border-box",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={459 * 2}
            height={306 * 2}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: "rotate(-45deg) translate(-50%, -50%)",
              transformOrigin: "0 0",
              opacity: 0.2,
            }}
          >
            <g fill="none" stroke="#000" strokeLinejoin="bevel">
              <path d="m431.119 65.659-39.338 21.877L403.33 44.03l39.336-21.877zM306 110.184l-40.212 20.227 1.67-44.974 40.213-20.226z" />
              <path d="M350.928 112.87 306 110.184l1.671-44.973 44.927 2.684z" />
              <path d="m390.111 132.509-39.183-19.639 1.67-44.975 39.183 19.641zm39.338-21.876-39.338 21.876 1.67-44.973 39.338-21.877zM282.707 148.69l-40.212 20.226 23.293-38.505L306 110.184z" />
              <path d="m327.633 151.375-44.926-2.685L306 110.184l44.928 2.686z" />
              <path d="m366.818 171.014-39.185-19.639 23.295-38.505 39.183 19.639z" />
              <path d="m406.154 149.138-39.336 21.876 23.293-38.505 39.338-21.876zm-90.182 27.504-40.212 20.226-33.265-27.952 40.212-20.226zm44.926 2.685-44.926-2.685-33.265-27.952 44.926 2.685z" />
              <path d="m400.084 198.966-39.186-19.639-33.265-27.952 39.185 19.639z" />
              <path d="m439.422 177.088-39.338 21.878-33.266-27.952 39.336-21.876zm-131.248 43.884-40.211 20.225 7.797-44.329 40.212-20.226z" />
              <path d="m353.102 223.658-44.928-2.686 7.798-44.33 44.926 2.685zm39.183 19.639-39.183-19.639 7.796-44.331 39.186 19.639z" />
              <path d="m431.625 221.419-39.34 21.878 7.799-44.331 39.338-21.878zm-110.241 42.579-40.21 20.227-13.211-43.028 40.211-20.225z" />
              <path d="m366.312 266.684-44.928-2.686-13.21-43.026 44.928 2.686zm39.184 19.638-39.184-19.638-13.21-43.026 39.183 19.639z" />
              <path d="m444.836 264.445-39.34 21.877-13.211-43.025 39.34-21.878z" />
            </g>
          </svg>
          <div
            style={{
              fontSize: 90,
              fontWeight: 700,
              fontFamily: "Karla",
              color: "#7e22ce",
              textShadow: "0 0 10px #ab7fd1",
              marginBottom: 20,
            }}
          >
            Graph Selector
          </div>
          <div
            style={{
              fontSize: 55,
              fontWeight: 700,
              fontFamily: "Karla",
              color: "#000000",
              maxWidth: 1100,
              textAlign: "center",
            }}
          >
            Describe graph data in an expressive, library-agnostic syntax.
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Karla",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
