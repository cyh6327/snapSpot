import os
import requests
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

def get_places(keyword_dict):
    places = {}

    client_id = os.getenv("NAVER_CLIENT_ID")
    client_secret = os.getenv("NAVER_CLIENT_SECRET")
    headers = {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret
    }

    # 각 키워드에 대해 검색 수행
    for key, keywords in keyword_dict.items():
        places[key] = []
        for keyword in keywords:
            print("for ... keyword:", keyword)
            url = f"https://openapi.naver.com/v1/search/local.json?query={keyword}&display=1&sort=random"
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                search_results = response.json()['items']
                if search_results:
                    if search_results:
                        # 검색 결과를 리스트에 추가
                        places[key].append(search_results[0])  # 검색 결과의 첫 번째 항목을 리스트에 추가  # 검색 결과의 첫 번째 항목을 할당
                else:
                    places[key] = {}  # 검색 결과가 없는 경우 빈 객체 할당
            else:
                places[key] = {}  # API 호출 실패시 빈 객체 할당

    return places  # 검색 결과를 JSON 형식으로 클라이언트에 응답

