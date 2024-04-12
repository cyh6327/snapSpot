from flask import Flask
from flask_cors import CORS
from routes.home import home
from routes.search import search

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, allow_headers=["Content-Type"])

# 라우트 등록
app.add_url_rule('/', 'home', home, methods=['GET'])
app.add_url_rule('/api/search', 'search', search, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)