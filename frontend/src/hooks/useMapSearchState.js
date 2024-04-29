import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { getPlaces } from '../services/mapService';

export const useMapSearchState = () => {
    const [selectedCategories, setSelectedCategories] = useState({});
    const [saveCategories, setSaveCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState([]);
    const [wrapper, setWrapper] = useState([]);
    const [selectedWords, setSelectedWords] = useState({});
    const [places, setPlaces] = useState({});
    const toast = useToast();
    // 상태 관리를 위해 useState를 사용
    const [showMap, setShowMap] = useState(false);

    // 지도 보기 모드를 토글하는 함수
    const toggleShowMap = () => setShowMap(!showMap);

    const handleCategoryClick = (category) => {
        setSelectedCategories(prev => ({
          ...prev,
          [category]: !prev[category]
        }));
    };

    const searchNaverMap = async () => {
        const selectedCat = Object.keys(selectedCategories).filter(cat => selectedCategories[cat]);
        setSaveCategories(selectedCat);
        const wrapperObj = { categories: selectedCat, keywords: selectedWords };
        setWrapper([...wrapper, wrapperObj]);

        try {
            const places = await getPlaces(selectedWords);
            setPlaces(places);
            console.log("returned places : ", places);
        } catch(error) {
            console.error(error);
        }

        toast({
            title: "Bookmark added",
            description: "Your bookmark has been successfully added.",
            status: "success",
            duration: 2000,
            isClosable: true
        });

    };

    const toggleLineSelection = (textIndex, words) => {
        const isLineSelected = words.every((word, wordIndex) => selectedWords[`${textIndex}_${wordIndex}`] || false);
        const newSelectedWords = { ...selectedWords };
        words.forEach((word, wordIndex) => {
          newSelectedWords[`${textIndex}_${wordIndex}`] = !isLineSelected;
        });
        setSelectedWords(newSelectedWords);
      };
    
    const toggleWordSelection = (index, word) => {
        console.log("toggleWordSelection");
        console.log(index, word)
        setSelectedWords(prev => ({
            ...prev,
            [index]: prev[index] ? (prev[index].includes(word) ? prev[index].filter(w => w !== word) : [...prev[index], word]) : [word]
        }));
        console.log("saved selected word : ",selectedWords)
      };

    return {
        selectedCategories, setSelectedCategories
        , selectedWords, setSelectedWords
        , toggleLineSelection, toggleWordSelection
        , saveCategories, setSaveCategories
        , searchKeyword, setSearchKeyword
        , wrapper, setWrapper
        , handleCategoryClick
        , searchNaverMap
        , places
        , showMap, setShowMap
        , toggleShowMap
    }
}