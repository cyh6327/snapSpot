import React from 'react';
import { useInstagramState } from '../hooks/useInstagramState';
import '../assets/styles/InstagramSearch.css';

function InstagramSearch() {
  const {
    instagramUrl,
    setInstagramUrl,
    page_option,
    setpage_option,
    specificPage,
    setSpecificPage,
    start_page,
    setstart_page,
    isSaveImages,
    setIsSaveImages,
    imageSavePath,
    setSaveImagePath,
    loading,
    errorMessage,
    selectedWords,
    getImageUrls,
    handleCheckboxChange,
    handleSpecificPageChange,
    toggleLineSelection,
    toggleWordSelection,
    extractedTexts,
    setExtractedTexts,
    image_urls
  } = useInstagramState();

  return (
    <div className="instagram-search" style={{lineHeight: '2em'}}>
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
        <input
          type="checkbox"
          checked={isSaveImages}
          onChange={handleCheckboxChange}
        /> 이미지 저장 여부
        {isSaveImages && <input type="text" placeholder="이미지 저장 경로" value={imageSavePath} onChange={e => setSaveImagePath(e.target.value)}/>}
        <button onClick={getImageUrls}>검색</button>
      </div>
      {loading && <div>로딩 중...</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}

      <div style={{ margin: '10% 20%', alignItems: 'center' }}>
        {extractedTexts.length > 0 && (
          <div>
            {extractedTexts.map((text, index) => {
              const words = text.split('\n');
              const imageUrl = image_urls[index] || 'No image found';
              const lineSelected = words.every(word => selectedWords[`${index}_${words.indexOf(word)}`]);

              return (
                <div key={index} style={{ textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={lineSelected}
                    onChange={() => toggleLineSelection(index, words)}
                  /> 
                  <h2 style={{ display: 'inline' }}>
                    {index + 1}. <a href={imageUrl} target="_blank" rel="noopener noreferrer">이미지</a>
                  </h2>
                  {words.map((word, wordIndex) => (
                    <div key={wordIndex}>
                      <input
                        type="checkbox"
                        checked={selectedWords[`${index}_${wordIndex}`]}
                        onChange={() => toggleWordSelection(index, wordIndex)}
                      /> {word}
                    </div>
                  ))}
                  <hr />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InstagramSearch;
