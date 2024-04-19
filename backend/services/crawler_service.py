from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time


def get_crawled_urls(url, mode='all', start_page=0):
    print("mode: {}, start_page: {}".format(mode, start_page))
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)

    driver.get(url)
    time.sleep(5)  # 페이지 로드 대기

    image_urls = []

    try:
        # '시작 페이지 지정'이 있는 경우, 해당 페이지까지 "다음" 버튼을 클릭
        for _ in range(start_page):
            next_button = driver.find_element(By.CSS_SELECTOR, 'button._afxw._al46._al47')
            driver.execute_script("arguments[0].click();", next_button)
            time.sleep(1)  # 페이지 로드 대기

        while True:
            li_elements = driver.find_elements(By.CSS_SELECTOR, 'li._acaz')
            for li in li_elements:
                img_elements = li.find_elements(By.CSS_SELECTOR, 'div._aagv img')
                for img in img_elements:
                    src = img.get_attribute('src')
                    if src and src not in image_urls:
                        image_urls.append(src)
                        print(f"Found image: {src}")
                        # '단일' 모드면 첫 이미지를 찾고 종료
                        if mode == 'single':
                            driver.quit()
                            return image_urls

            # '전체' 모드이거나 시작 페이지 지정 후 모든 페이지를 처리해야 할 경우
            next_buttons = driver.find_elements(By.CSS_SELECTOR, 'button._afxw._al46._al47')
            if next_buttons:
                next_button = next_buttons[0]
                driver.execute_script("arguments[0].click();", next_button)
                time.sleep(1)  # 페이지 로드 대기
            else:
                print("No more next button found. Ending the process.")
                break

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if mode != 'single' or (mode == 'single' and not image_urls):
            driver.quit()

    return image_urls


# 사용 예:
if __name__ == '__main__':
    # 단일 이미지, 시작 페이지 1 (다음 버튼 1번 클릭 후 첫 이미지 추출)
    image_url = "https://www.instagram.com/somepage/"
    single_image = get_crawled_urls(image_url, mode='single', start_page=1)
    print(single_image)

    # 전체 이미지, 시작 페이지 2 (다음 버튼 2번 클릭 후 전체 이미지 추출)
    all_images = get_crawled_urls(image_url, mode='all', start_page=2)
    print(all_images)


