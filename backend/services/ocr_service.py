import pytesseract
from PIL import Image
import requests
from io import BytesIO

pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'

def extract_texts_from_images(image_urls):
    texts = []
    for url in image_urls:
        response = requests.get(url)
        img = Image.open(BytesIO(response.content))
        text = pytesseract.image_to_string(img, lang='kor')
        texts.append(text)
    return texts
