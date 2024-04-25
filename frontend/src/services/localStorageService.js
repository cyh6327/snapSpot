// services/localStorageService.js
export const getCategories = () => {
    const saved = localStorage.getItem('categories');
    return saved ? saved.split(',') : [];
  };
  
  export const saveCategories = (categories) => {
    localStorage.setItem('categories', categories.join(','));
  };
  
  export const addCategory = (category) => {
    const categories = getCategories();
    categories.push(category);
    saveCategories(categories);
  };
  
  export const deleteCategory = (category) => {
    let categories = getCategories();
    categories = categories.filter(cat => cat !== category);
    saveCategories(categories);
  };
  