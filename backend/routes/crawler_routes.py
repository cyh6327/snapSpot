from flask import request, jsonify, Blueprint
from services.crawler_service import get_crawled_urls

crawler_bp = Blueprint('crawler', __name__)


@crawler_bp.route('/crawled-urls', methods=['POST'])
def route_get_crawled_urls():
    data = request.json
    instagram_url = data.get('instagram_url')
    page_option = data.get('page_option')
    start_page = data.get('start_page')

    image_urls = get_crawled_urls(instagram_url, page_option, int(start_page))
    print(len(image_urls))

    if image_urls:
        return jsonify({'texts': image_urls})
    else:
        return jsonify({'error': '이미지를 가져올 수 없습니다.'}), 404