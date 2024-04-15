import pytesseract
from PIL import Image
import requests
from io import BytesIO
from services.image_processing import get_enhanced_img

pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'


def extract_texts_from_images(image_urls):
    texts = []
    for url in image_urls:
        response = requests.get(url)
        img = Image.open(BytesIO(response.content))

        # 이미지를 Deskew 함수로 전처리
        enhanced_img = get_enhanced_img(img)

        # Deskewed 이미지로부터 텍스트 추출
        text = pytesseract.image_to_string(enhanced_img, lang='kor')
        texts.append(text)
    return texts
