<template>
    <div class="instagram-search">
      <h1>인스타그램 이미지 검색</h1>
      <input type="text" v-model="instagramUrl" placeholder="인스타그램 게시물 URL 입력" />
      <button @click="searchImage">검색</button>
      <div v-if="loading">로딩 중...</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <!-- 검색 결과를 표시하는 부분 -->
      <div v-if="searchResults.length">
        <h2>검색 결과</h2>
        <ul>
            <li v-for="(result, index) in searchResults" :key="index">
            {{ result }}
            </li>
        </ul>
      </div>
    </div>
</template>
  
  <script>
  import axios from 'axios';

  export default {
    name: 'InstagramSearch',
    data() {
      return {
        instagramUrl: '',
        loading: false,
        errorMessage: '',
        searchResults: [],  // 검색 결과를 저장할 배열
      };
    },
    methods: {
        async searchImage() {
            if (!this.instagramUrl) {
            this.errorMessage = 'URL을 입력해주세요.';
            return;
            }
            this.loading = true;
            this.errorMessage = '';

            const apiUrl = 'http://127.0.0.1:5000/api/search';
            try {
                const response = await axios.post(apiUrl, {
                    instagram_url: this.instagramUrl
                })
                console.log(response.data);
                // 백엔드로부터 받은 검색 결과를 searchResults에 할당
                this.searchResults = response.data.image_urls ? response.data.image_urls : [];
            } catch (error) {
                this.errorMessage = '검색 중 오류가 발생했습니다.';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  