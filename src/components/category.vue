<template>
  <div class="category">
    <text class="category-text">{{title}}</text>
  </div>
</template>

<style scoped>
.category {
  margin-top: 20px;
  padding-left: 24px;
  width: 750px;
  height: 68px;
  background-color: #f2f3f4;
  justify-content: center;
}
.category-text {
  color: #000000;
  font-weight: 600;
  font-size: 28px;
}
</style>

<script>
export default {
  props: {
    title: String
  }
};
</script>