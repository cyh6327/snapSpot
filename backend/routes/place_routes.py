from flask import request, jsonify, Blueprint
from services.place_service import get_places

place_bp = Blueprint('place', __name__)


@place_bp.route('/places', methods=['POST'])
def route_get_places():
    data = request.json
    keyword = data.get('keyword')

    places = get_places(keyword)

    if places:
        return jsonify({'places': places})
    else:
        return jsonify({'error': '네이버 지도 검색에 실패하였습니다.'}), 404
