"""Local dev server that serves .html files without extension (like GitHub Pages)."""
import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # If path has no extension and isn't a directory, try .html
        path = self.translate_path(self.path)
        if not os.path.exists(path) and not self.path.endswith('/'):
            html_path = path + '.html'
            if os.path.exists(html_path):
                self.path = self.path + '.html'
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(('localhost', 8000), CleanURLHandler)
    print("Server running at http://localhost:8000")
    server.serve_forever()
