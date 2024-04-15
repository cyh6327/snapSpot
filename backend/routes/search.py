from flask import request, jsonify
from services.instagram_service import get_images
from services.ocr_service import extract_texts_from_images

def search():
    data = request.json
    instagram_url = data.get('instagram_url')

    image_urls = get_images(instagram_url)

    if image_urls:
        texts = extract_texts_from_images(image_urls)

        return jsonify({'texts': texts})
    else:
        return jsonify({'error': '이미지를 가져올 수 없습니다.'}), 404



