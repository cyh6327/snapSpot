import '../assets/styles/InstagramSearch.css';
import React, { useState } from 'react';
import axios from 'axios';

function InstagramSearch() {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [texts, setTexts] = useState([]);
  const [page_option, setpage_option] = useState('');
  const [specificPage, setSpecificPage] = useState(false);
  const [start_page, setstart_page] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTexts, setSelectedTexts] = useState([]);

  const searchImage = async () => {
    if (!instagramUrl) {
      setErrorMessage('URL을 입력해주세요.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    const apiUrl = 'http://localhost:5000/api/crawled-urls';
    try {
      const response = await axios.post(apiUrl, {
        instagram_url: instagramUrl,
        page_option: page_option,
        start_page: specificPage ? start_page : null
      });
      setTexts(response.data.texts);
    } catch (error) {
      setErrorMessage('검색 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTexts(texts.map((_, index) => index));
    } else {
      setSelectedTexts([]);
    }
    setSelectAll(!selectAll);
  };

  const handleSpecificPageChange = () => {
    setSpecificPage(!specificPage);
    if (!specificPage) {
      setstart_page(1);
    }
  };

  return (
    <div className="instagram-search">
      <h1>인스타그램 이미지 검색</h1>
      <div>
        <input
          type="text"
          value={instagramUrl}
          onChange={e => setInstagramUrl(e.target.value)}
          placeholder="인스타그램 게시물 URL 입력"
        />
        <input
          type="radio"
          value="single"
          checked={page_option === 'single'}
          onChange={() => setpage_option('single')}
        /> 단일
        <input
          type="radio"
          value="all"
          checked={page_option === 'all'}
          onChange={() => setpage_option('all')}
        /> 전체
        <input
          type="checkbox"
          checked={specificPage}
          onChange={handleSpecificPageChange}
        /> 시작 페이지 지정
        <input
          type="number"
          value={start_page}
          onChange={e => setstart_page(e.target.value)}
          disabled={!specificPage}
        />
      </div>
      <button onClick={searchImage}>검색</button>
      {loading && <div>로딩 중...</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
      {texts.length > 0 && (
        <div>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
          /> 전체 선택
          <ul>
            {texts.map((text, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={selectedTexts.includes(index)}
                  onChange={() => {
                    setSelectedTexts(prev =>
                      prev.includes(index)
                        ? prev.filter(i => i !== index)
                        : [...prev, index]
                    );
                  }}
                /> {text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default InstagramSearch;
