from google.cloud import vision

def detect_text_uri(uri):
    """주어진 이미지 URL에서 텍스트를 검출합니다."""
    client = vision.ImageAnnotatorClient()

    image = vision.Image()
    image.source.image_uri = uri

    response = client.text_detection(image=image)
    texts = response.text_annotations

    for text in texts:
        print('Texts start')
        print('\n"{}"'.format(text))
        print('Texts end')

    if response.error.message:
        raise Exception('{}\nFor more info on error messages, check: https://cloud.google.com/apis/design/errors'.format(response.error.message))

if __name__ == '__main__':
    image_url = "https://scontent-ssn1-1.cdninstagram.com/v/t39.30808-6/436197564_18395126248077210_2759371462772296104_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=106&_nc_ohc=QyjWRwkpqSkAb6mi4yf&edm=ANTKIIoAAAAA&ccb=7-5&oh=00_AfBj6YeNy_2REVUgAlov7XyocrbD0mh9-iU6ghjQ09f_9Q&oe=6623BF79&_nc_sid=cf751b"
    detect_text_uri(image_url)
