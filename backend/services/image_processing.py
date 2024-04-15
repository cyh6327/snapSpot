import cv2
import numpy as np
import requests
from io import BytesIO
from PIL import Image
from PIL import ImageEnhance


def binarize_image_from_image(pil_image):
    # PIL 이미지를 OpenCV 형식으로 변환
    open_cv_image = np.array(pil_image)
    # 컬러 이미지라면 그레이스케일로 변환
    if len(open_cv_image.shape) == 3:
        open_cv_image = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2GRAY)

    # 이진화를 수행합니다. Otsu의 자동 이진화 방법을 사용합니다.
    _, binary_image = cv2.threshold(open_cv_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return binary_image


def remove_noise(image):
    return cv2.medianBlur(image, 5)


def enhance_contrast(image_data):
    # 이미지 데이터가 NumPy 배열인 경우, PIL 이미지 객체로 변환
    if isinstance(image_data, np.ndarray):
        image = Image.fromarray(image_data)
    else:
        image = image_data

    enhancer = ImageEnhance.Contrast(image)
    enhanced_image = enhancer.enhance(2.0)  # 대비를 2배로 증가
    return enhanced_image


def deskew(pil_image):
    # PIL 이미지를 OpenCV 형식으로 변환
    open_cv_image = np.array(pil_image)

    # 이미지가 컬러일 경우 RGB를 BGR로 변환
    if len(open_cv_image.shape) == 3 and open_cv_image.shape[2] == 3:
        open_cv_image = open_cv_image[:, :, ::-1].copy()

    # 이미지를 그레이스케일로 변환
    if len(open_cv_image.shape) == 3:
        gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
    else:
        gray = open_cv_image

    # 이미지에서 텍스트가 있는 부분의 좌표를 찾아 최소 영역 사각형을 계산
    coords = np.column_stack(np.where(gray > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    # 이미지 회전을 위한 변환 행렬 계산
    (h, w) = gray.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)

    # 이미지 회전
    rotated = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated


def get_enhanced_img(image_url):
    binary_image = binarize_image_from_image(image_url)

    denoised_image = remove_noise(binary_image)

    enhanced_image = enhance_contrast(denoised_image)

    deskewed_image = deskew(enhanced_image)
    final_image = Image.fromarray(deskewed_image)

    return final_image


if __name__ == '__main__':
    image_url = 'https://scontent-ssn1-1.cdninstagram.com/v/t39.30808-6/436176159_18010369400463428_6366994287141752585_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=SmLadfvtO8UAb5mEZzt&edm=ANTKIIoAAAAA&ccb=7-5&oh=00_AfAK0wpR7ytPhHJeVLcudPWSiVkIDB-DNrebGYbs5eel1w&oe=66228697&_nc_sid=cf751b'
    binary_image = binarize_image_from_image(image_url)

    denoised_image = remove_noise(binary_image)

    # 이진화된 이미지 확인 (OpenCV 활용)
    # cv2.imshow('denoised_image', denoised_image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    enhanced_image = enhance_contrast(denoised_image)
    # enhanced_image.show()

    deskewed_image = deskew(enhanced_image)
    final_image = Image.fromarray(deskewed_image)
    final_image.show()



