from flask import Flask
from flask_cors import CORS
from routes.crawler_routes import crawler_bp
from routes.image_routes import image_bp

base_url = "/api"
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, allow_headers=["Content-Type"])

# 라우트 등록
app.register_blueprint(crawler_bp, url_prefix=base_url)
app.register_blueprint(image_bp, url_prefix=base_url)

if __name__ == '__main__':
    app.run(debug=True)