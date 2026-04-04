// BUN Server for XTT Typing Practice Application
// Run with: bun run server.ts
// Access at: http://0.0.0.0:8899

const PORT = 8899;
const HOSTNAME = "0.0.0.0";

// Simple static file server using BUN
const server = Bun.serve({
  port: PORT,
  hostname: HOSTNAME,
  fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Default to index.html for root path
    if (path === "/") {
      path = "/index.html";
    }

    // Security: prevent directory traversal
    if (path.includes("..")) {
      return new Response("Forbidden", { status: 403 });
    }

    // Serve static files from current directory
    const filePath = path.startsWith("/") ? "." + path : path;

    try {
      const file = Bun.file(filePath);
      
      // Check if file exists
      if (!file.exists()) {
        return new Response("Not Found: " + path, { status: 404 });
      }

      // Determine content type
      const ext = filePath.split(".").pop()?.toLowerCase();
      const contentTypes = {
        "html": "text/html; charset=utf-8",
        "css": "text/css; charset=utf-8",
        "js": "application/javascript; charset=utf-8",
        "txt": "text/plain; charset=utf-8",
        "json": "application/json; charset=utf-8",
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "gif": "image/gif",
        "svg": "image/svg+xml",
        "ico": "image/x-icon"
      };

      const contentType = contentTypes[ext || ""] || "application/octet-stream";

      return new Response(file, {
        headers: {
          "Content-Type": contentType
        }
      });
    } catch (error) {
      console.error("Error serving file:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
});

console.log(`✅ XTT Typing Practice Server running at http://${HOSTNAME}:${PORT}`);
console.log(`   Press Ctrl+C to stop the server`);
