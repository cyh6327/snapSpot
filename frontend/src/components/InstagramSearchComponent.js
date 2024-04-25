import React from 'react';
import { useInstagramState } from '../hooks/useInstagramState';
import { useMapSearchState } from '../hooks/useMapSearchState';
import { useDisclosure, Button, Input, Checkbox, Radio, RadioGroup, Stack, Box, Text, Link, Spinner, Alert, AlertIcon} from '@chakra-ui/react';
import CategoryModal from './CategoryModal';
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

  const {
    selectedCategories, setSelectedCategories
    , saveCategories, setSaveCategories
    , searchKeyword, setSearchKeyword
    , wrapper, setWrapper
    , handleCategoryClick
    , addBookmark
  } = useMapSearchState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box className="instagram-search" p={5}>
      <Text fontSize="2xl" mb={4}>인스타그램 이미지 검색</Text>

      <Button colorScheme="blue" onClick={onOpen}>네이버 지도 즐겨찾기 카테고리 설정</Button>
      <CategoryModal isOpen={isOpen} onClose={onClose} />

      <Stack spacing={3} my={4}>
        <Input
          value={instagramUrl}
          onChange={e => setInstagramUrl(e.target.value)}
          placeholder="인스타그램 게시물 URL 입력"
        />
        <RadioGroup onChange={setpage_option} value={page_option}>
          <Stack direction="row">
            <Radio value="single">단일</Radio>
            <Radio value="all">전체</Radio>
          </Stack>
        </RadioGroup>
        <Checkbox isChecked={specificPage} onChange={handleSpecificPageChange}>시작 페이지 지정</Checkbox>
        {specificPage && <Input type="number" value={start_page} onChange={e => setstart_page(e.target.value)} />}
        <Checkbox isChecked={isSaveImages} onChange={handleCheckboxChange}>이미지 저장 여부</Checkbox>
        {isSaveImages && <Input placeholder="이미지 저장 경로" value={imageSavePath} onChange={e => setSaveImagePath(e.target.value)} />}
        <Button colorScheme="teal" onClick={getImageUrls}>검색</Button>
      </Stack>

      {loading && <Spinner />}
      {errorMessage && <Alert status="error"><AlertIcon />{errorMessage}</Alert>}

      <Box my={10}>
        {extractedTexts.length > 0 && (
          extractedTexts.map((text, index) => {
            const words = text.split('\n');
            const imageUrl = image_urls[index] || 'No image found';
            const lineSelected = words.every(word => selectedWords[`${index}_${words.indexOf(word)}`]);
            const categories = localStorage.getItem('categories') ? localStorage.getItem('categories').split(',') : [];

            return (
              <Box>
                {/* 추출된 텍스트 및 이미지 링크를 표시하는 반복 렌더링 */}
                {extractedTexts.map((text, index) => {
                  const words = text.split('\n');
                  const imageUrl = image_urls[index] || 'No image found';
                  const lineSelected = words.every(word => selectedWords[`${index}_${words.indexOf(word)}`]);
                  const categories = localStorage.getItem('categories') ? localStorage.getItem('categories').split(',') : [];

                  return (
                    <Box key={index} mb={5}>
                      <Checkbox isChecked={lineSelected} onChange={() => toggleLineSelection(index, words)} />
                      <Text as="h2" display="inline" fontSize="lg">
                        {index + 1}. <Link href={imageUrl} isExternal>이미지</Link>
                      </Text>
                      {/* 카테고리를 동적으로 생성 및 선택 로직 처리 */}
                      <Box>
                        {categories.map((category, catIndex) => (
                          <Button key={catIndex} colorScheme={selectedCategories[category] ? "blue" : "gray"} onClick={() => handleCategoryClick(category)}>
                            {category}
                          </Button>
                        ))}
                      </Box>
                      {words.map((word, wordIndex) => (
                        <Checkbox key={wordIndex} isChecked={selectedWords[`${index}_${wordIndex}`]} onChange={() => toggleWordSelection(index, wordIndex)}>
                          {word}
                        </Checkbox>
                      ))}
                    </Box>
                  );
                })}
                <Button colorScheme="teal" onClick={addBookmark}>즐겨찾기 추가</Button>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}

export default InstagramSearch;
