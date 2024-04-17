<template>
  <div class="instagram-search">
    <h1>인스타그램 이미지 검색</h1>
    <div>
      <input type="text" v-model="instagramUrl" placeholder="인스타그램 게시물 URL 입력" />
      <!-- 이미지 추출 범위 선택 체크박스 -->
      <input type="radio" value="single" v-model="pageOption" /> 단일
      <input type="radio" value="all" v-model="pageOption" /> 전체
      <input type="checkbox" v-model="specificPage" @change="toggleSpecificPage"> 시작 페이지 지정
      <input type="number" v-model="startPage" :disabled="!specificPage" />
    </div>
    <button @click="searchImage">검색</button>
    <div v-if="loading">로딩 중...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <!-- 검색 결과를 표시하는 부분 -->
    <div v-if="texts.length">
      <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"> 전체 선택
      <ul>
        <li v-for="(text, index) in texts" :key="index">
          <input type="checkbox" v-model="selectedTexts" :value="index"> {{ text }}
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
      texts: [],  // 검색 결과를 저장할 배열
      singlePage: false,
      allPages: false,
      specificPage: false,
      startPage: 1,  // 시작 페이지 지정
      selectAll: false,
      selectedTexts: []
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
          instagram_url: this.instagramUrl,
          pageOption: this.pageOption,
          startPage: this.specificPage ? this.startPage : null
        });
        this.texts = response.data.texts;
      } catch (error) {
        this.errorMessage = '검색 중 오류가 발생했습니다.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedTexts = this.texts.map((_, index) => index);
      } else {
        this.selectedTexts = [];
      }
    },
    toggleSpecificPage() {
      if (!this.specificPage) {
        this.startPage = 1;  // 특정 페이지 선택이 비활성화될 때 초기화
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>

  