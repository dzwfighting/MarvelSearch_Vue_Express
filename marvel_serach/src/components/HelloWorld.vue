<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <br />
    <div>
      <li>
        <router-link to="/">Home</router-link>
        <!-- <a href="/">Home</a> -->
      </li>
      <li>
        <router-link :to="{ name: 'CharacterList', params: { page: 1 } }"
          >CharacterList</router-link
        >
        <!-- <a href="/characters/page/1">CharacterList</a> -->
      </li>
      <li>
        <router-link :to="{ name: 'ComicList', params: { page: 1 } }"
          >ComicList</router-link
        >
      </li>
      <li>
        <router-link :to="{ name: 'StoryList', params: { page: 1 } }"
          >StoryList</router-link
        >
      </li>
      <br /><br />
      <!-- <router-view /> -->
      <br /><br />
    </div>
  </div>
</template>

<script>
// import router from "@/router";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  // components: { router },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
