from flask import request, jsonify, Blueprint
from services.image_service import download_and_save_images

image_bp = Blueprint('image', __name__)


@image_bp.route('/images', methods=['POST'])
def route_download_and_save_images():
    data = request.json
    image_urls = data.get('image_urls')

    download_and_save_images(image_urls)