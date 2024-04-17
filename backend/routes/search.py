from flask import request, jsonify
from services.instagram_service import get_images
from services.google_cloud_vision_ocr_service import detect_text_from_local_files, download_and_save_images


def search():
    data = request.json
    instagram_url = data.get('instagram_url')
    pageOption = data.get('pageOption')
    startPage = data.get('startPage')

    image_urls = get_images(instagram_url,pageOption,startPage)
    print(len(image_urls))

    if image_urls:
        saved_paths = download_and_save_images(image_urls)
        texts = detect_text_from_local_files(saved_paths)
        return jsonify({'texts': texts})
    else:
        return jsonify({'error': '이미지를 가져올 수 없습니다.'}), 404



