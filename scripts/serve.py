#!/usr/bin/env python3
"""
PBOS Local Development Server
Serves the static web application with proper MIME types for ES modules.
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class PBOSHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[SERVE] {self.address_string()} - {format % args}")


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT

    with socketserver.TCPServer(("", port), PBOSHandler) as httpd:
        print(f"=" * 50)
        print(f"  PBOS Development Server")
        print(f"  Directory: {DIRECTORY}")
        print(f"  URL:       http://localhost:{port}")
        print(f"=" * 50)
        print("  Press Ctrl+C to stop\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[SERVE] Server stopped.")


if __name__ == "__main__":
    main()