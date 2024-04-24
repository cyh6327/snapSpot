import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCrawledUrls = async (instagramUrl, pageOption, startPage) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crawled-urls`, {
      instagram_url: instagramUrl,
      page_option: pageOption,
      start_page: startPage
    });
    return response.data.image_urls;
  } catch (error) {
    throw new Error('검색 중 오류가 발생했습니다.');
  }
};

export const saveImages = async (urls, imageSavePath) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/images`, {
      image_urls: urls,
      image_save_path: imageSavePath
    });
    return response.data.saved_image_paths;
  } catch (error) {
    throw new Error('이미지 저장 중 오류가 발생했습니다.');
  }
};

export const fetchTextsFromImages = async (imagePaths, isSaveImages) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/images/texts`, {
      image_paths: imagePaths,
      is_save_images: isSaveImages
    });
    return response.data.texts;
  } catch (error) {
    throw new Error('텍스트 추출 중 오류가 발생했습니다.');
  }
};
