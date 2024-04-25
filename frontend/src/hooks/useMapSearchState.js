import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { getPlaces } from '../services/mapService';

export const useMapSearchState = () => {
    const [selectedCategories, setSelectedCategories] = useState({});
    const [saveCategories, setSaveCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState([]);
    const [wrapper, setWrapper] = useState([]);
    const toast = useToast();

    const handleCategoryClick = (category) => {
        setSelectedCategories(prev => ({
          ...prev,
          [category]: !prev[category]
        }));
    };

    const addBookmark = async () => {
        const selectedCat = Object.keys(selectedCategories).filter(cat => selectedCategories[cat]);
        setSaveCategories(selectedCat);
        const selectedWords = searchKeyword.filter(word => word.selected).map(word => word.text);
        const wrapperObj = { categories: selectedCat, keywords: selectedWords };
        setWrapper([...wrapper, wrapperObj]);

        try {
            const places = await getPlaces(selectedWords);
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

    return {
        selectedCategories, setSelectedCategories
        , saveCategories, setSaveCategories
        , searchKeyword, setSearchKeyword
        , wrapper, setWrapper
        , handleCategoryClick
        , addBookmark
    }
}