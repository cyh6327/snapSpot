from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_images(url):
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)

    driver.get(url)
    time.sleep(5)  # 페이지 로드 대기

    image_urls = []
    try:
        while True:
            # 현재 페이지에서 '_acaz' 클래스를 가진 li 태그들을 찾음
            li_elements = driver.find_elements(By.CSS_SELECTOR, 'li._acaz')
            for li in li_elements:
                # 각 li 태그에서 '_aagv' 클래스를 가진 div 태그 내 img 태그의 src 속성 추출
                img_elements = li.find_elements(By.CSS_SELECTOR, 'div._aagv img')
                for img in img_elements:
                    src = img.get_attribute('src')
                    if src and src not in image_urls:
                        image_urls.append(src)
                        print(f"Found image: {src}")

            # "다음" 버튼을 찾아 클릭
            next_buttons = driver.find_elements(By.CSS_SELECTOR, 'button._afxw._al46._al47')
            if next_buttons:
                next_button = next_buttons[0]
                driver.execute_script("arguments[0].click();", next_button)
                time.sleep(1)  # 버튼 클릭 후 대기, 페이지 로드를 기다림
            else:
                print("No more next button found. Ending the process.")
                break  # "다음" 버튼이 없으면 반복 종료

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        driver.quit()

    return image_urls

# 테스트 URL로 함수 실행
if __name__ == '__main__':
    test_url = "https://www.instagram.com/p/C5fl85JLpKF"
    images = get_images(test_url)
    print(images)
