import { readFile } from "node:fs/promises";
import path from "node:path";

const deliverablesRoot = path.join(/* turbopackIgnore: true */ process.cwd(), "..", "deliverables");

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function getContentType(filePath: string) {
  return contentTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function resolveDeliverablePath(segments: string[]) {
  const requestedPath = path.resolve(deliverablesRoot, ...segments);
  const relativePath = path.relative(deliverablesRoot, requestedPath);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return null;
  }

  return requestedPath;
}

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const safeSegments = segments.filter(Boolean);

  if (safeSegments.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const targetPath = resolveDeliverablePath(safeSegments);
  if (!targetPath) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(targetPath);
    return new Response(fileBuffer, {
      headers: {
        "cache-control": "no-store",
        "content-type": getContentType(targetPath),
      },
      status: 200,
    });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return new Response("Not found", { status: 404 });
    }

    console.error("Failed to serve deliverable", error);
    return new Response("Internal server error", { status: 500 });
  }
}
