import { useState } from 'react';
import { fetchCrawledUrls, saveImages, fetchTextsFromImages } from '../services/instagramService';

export const useInstagramState = () => {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [page_option, setpage_option] = useState('');
  const [specificPage, setSpecificPage] = useState(false);
  const [start_page, setstart_page] = useState(1);
  const [isSaveImages, setIsSaveImages] = useState(false);
  const [imageSavePath, setSaveImagePath] = useState('');
  const [selectedWords, setSelectedWords] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [image_urls, setImage_urls] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState([]);
 
  const getImageUrls = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const image_urls = await fetchCrawledUrls(instagramUrl, page_option, specificPage ? start_page : 1);
      console.log("responed image urls : ",image_urls);
      const savedPaths = await saveImages(image_urls, imageSavePath);
      const extractedTexts = await fetchTextsFromImages(savedPaths, isSaveImages);
      console.log("responed extractedTexts : ", extractedTexts);
      setImage_urls(image_urls);
      setExtractedTexts(extractedTexts);
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setIsSaveImages(!isSaveImages);
  };

  const handleSpecificPageChange = () => {
    setSpecificPage(!specificPage);
    if (!specificPage) {
      setstart_page(1);
    }
  };

  const toggleLineSelection = (textIndex, words) => {
    const isLineSelected = words.every((word, wordIndex) => selectedWords[`${textIndex}_${wordIndex}`] || false);
    const newSelectedWords = { ...selectedWords };
    words.forEach((word, wordIndex) => {
      newSelectedWords[`${textIndex}_${wordIndex}`] = !isLineSelected;
    });
    setSelectedWords(newSelectedWords);
  };

  const toggleWordSelection = (textIndex, wordIndex) => {
    const key = `${textIndex}_${wordIndex}`;
    setSelectedWords(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return {
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
    image_urls,
    setImage_urls,
    extractedTexts,
    setExtractedTexts
  };
};
