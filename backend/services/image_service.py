import os
import requests
from google.cloud import vision
from PIL import Image
from io import BytesIO
from datetime import datetime


# def detect_text_uri(image_urls):
#     result = []
#     client = vision.ImageAnnotatorClient()  # 클라이언트 초기화를 반복하지 않도록 루프 외부로 이동
#
#     for index, url in enumerate(image_urls):
#         print("start - index: {} / url: {}".format(index, url))
#         image = vision.Image()
#         image.source.image_uri = url
#
#         response = client.text_detection(image=image)
#         texts = response.text_annotations
#
#         # 현재 URL의 텍스트 정보를 저장할 딕셔너리
#         current_image_texts = {}
#
#         if texts:
#             # 첫 번째 text_annotations는 전체 텍스트이므로, 이를 추출하여 저장
#             full_text_description = texts[0].description.strip()
#             current_image_texts[index] = full_text_description
#             print("texts: {}".format(full_text_description))
#
#         if response.error.message:
#             raise Exception('{}\nFor more info on error messages, check: https://cloud.google.com/apis/design/errors'.format(response.error.message))
#
#         # 결과 리스트에 현재 이미지의 텍스트 정보 추가
#         result.append(current_image_texts)
#         print("end - result: {}, result.len: {}".format(result, len(result)))
#
#     return result


def download_and_save_images(image_urls, save_directory="./img_downloaded"):
    saved_image_paths = []
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    for url in image_urls:
        try:
            response = requests.get(url)
            response.raise_for_status()
            image_bytes = BytesIO(response.content)
            image = Image.open(image_bytes)

            # 현재 날짜와 시간을 밀리세컨드까지 포함하는 형식으로 파일명 생성
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
            file_extension = Image.open(image_bytes).format.lower()  # 이미지 형식에 따라 확장자 결정
            file_name = f"{timestamp}.{file_extension}"
            save_path = os.path.join(save_directory, file_name)

            image.save(save_path)
            saved_image_paths.append(save_path)
            print(f"Downloaded and saved image from {url} to {save_path}")
        except Exception as e:
            print(f"Failed to download or save image from {url}: {e}")

    return saved_image_paths


def detect_text_from_local_files(saved_image_paths, is_save_images):
    """로컬에 저장된 이미지 파일들로부터 텍스트를 추출합니다."""
    result = []
    client = vision.ImageAnnotatorClient()

    for index, path in enumerate(saved_image_paths):
        print(f"Start processing image: {path}")
        try:
            with open(path, 'rb') as image_file:
                content = image_file.read()
            image = vision.Image(content=content)
            response = client.text_detection(image=image)
            texts = response.text_annotations

            current_image_texts = {}
            if texts:
                full_text_description = texts[0].description.strip()
                current_image_texts[index] = full_text_description
                print(f"Extracted text from {path}: {full_text_description}")

            if response.error.message:
                raise Exception(f"{response.error.message}\nFor more info on error messages, check: https://cloud.google.com/apis/design/errors")

            result.append(current_image_texts)
        except Exception as e:
            print(f"Error processing {path}: {e}")

    # 이미지 저장 플래그가 False이면 이미지 파일 삭제
    if not is_save_images:
        for path in saved_image_paths:
            try:
                os.remove(path)
                print(f"Deleted image: {path}")
            except Exception as e:
                print(f"Failed to delete image {path}: {e}")

    return result

