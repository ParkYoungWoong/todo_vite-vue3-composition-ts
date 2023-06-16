<template>
  <div class="the-loading"></div>
</template>

<style scoped lang="scss">
.the-loading {
  width: 30px;
  height: 30px;
  border: 3px solid;
  border-top-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  animation: spinning 1s infinite linear;
}
@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
