import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Box,
  Text,
  useToast
} from '@chakra-ui/react';

const CategoryModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(storedCategories.split(','));
    }
  }, []);

  const handleAddCategory = () => {
    if (inputValue.trim() !== '') {
      const newCategories = [...categories, inputValue];
      localStorage.setItem('categories', newCategories.join(','));
      setCategories(newCategories);
      setInputValue('');
      toast({
        title: 'Category added.',
        description: "We've added your category.",
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSelected = () => {
    const filteredCategories = categories.filter(cat => !selectedCategories.includes(cat));
    localStorage.setItem('categories', filteredCategories.join(','));
    setCategories(filteredCategories);
    setSelectedCategories([]);
    toast({
      title: 'Deleted',
      description: "Selected categories have been deleted.",
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleSelection = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(item => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Categories</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Add new category:</FormLabel>
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter new category" />
          </FormControl>
          <Button colorScheme="blue" mt={4} onClick={handleAddCategory}>Add</Button>
          <Box mt={6}>
            <Text fontSize="lg">Categories:</Text>
            {categories.map((category, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Checkbox isChecked={selectedCategories.includes(category)} onChange={() => toggleSelection(category)} />
                <Text ml={2}>{category}</Text>
              </Box>
            ))}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDeleteSelected}>Delete Selected</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;