from flask import request, jsonify, Blueprint
from services.image_service import download_and_save_images
from services.image_service import detect_text_from_local_files

image_bp = Blueprint('image', __name__)


@image_bp.route('/images', methods=['POST'])
def route_download_and_save_images():
    data = request.json
    image_urls = data.get('image_urls')
    image_save_path = data.get('image_save_path', None)

    if image_save_path:
        saved_image_paths = download_and_save_images(image_urls, image_save_path)
    else:
        saved_image_paths = download_and_save_images(image_urls)

    if saved_image_paths:
        return jsonify({'saved_image_paths': saved_image_paths})
    else:
        return jsonify({'error': '이미지가 저장된 경로를 찾을 수 없습니다.'}), 404


@image_bp.route('/images/texts', methods=['POST'])
def route_detect_text_from_local_files():
    data = request.json
    image_paths = data.get('image_paths')
    is_save_images = data.get('is_save_images')

    textsFromImage = detect_text_from_local_files(image_paths, is_save_images)

    if textsFromImage:
        return jsonify({'texts': textsFromImage})
    else:
        return jsonify({'error': '이미지로부터 텍스트를 추출하는 것에 실패하였습니다.'}), 404