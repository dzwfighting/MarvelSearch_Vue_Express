<template>
  <div>
    <div v-if="dataEmpty">
      <h3>Loading...</h3>
    </div>

    <div>
      <b-button
        class="btn"
        variant="outline-info"
        :disabled="this.hidePrevious"
      >
        <router-link
          :to="{ name: 'StoryList', params: { page: this.page - 1 } }"
        >
          Previous
        </router-link>
      </b-button>
      <b-button variant="outline-info" :disabled="this.hideNext">
        <router-link
          :to="{ name: 'StoryList', params: { page: this.page + 1 } }"
        >
          Next
        </router-link>
      </b-button>
    </div>
    <br /><br /><br />

    <b-row align-v="stretch">
      <b-col v-for="(story, idx) in stories" :key="idx">
        <b-card bg-variant="light" class="text-center pos">
          <b-card-text>{{ story.title }}</b-card-text>
          <b-button variant="outline-warning">
            <router-link :to="{ name: 'Story', params: { id: story.id } }">
              Detail
            </router-link>
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import { storiesUrl } from "@/assets/dataURL";

export default {
  name: "StoryList",
  data() {
    return {
      page: this.$route.params.page,
      stories: [],
      hidePrevious: false,
      hideNext: false,
      dataEmpty: true,
      total: 0,
    };
  },

  methods: {
    async getStories(page) {
      try {
        this.page = Number(page);
        let offset = this.page * 20;

        const {
          data: { data },
        } = await axios.get(`${storiesUrl}&offset=${offset}&limit=20`);
        console.log(data);

        if (Number(data.offset) > Number(data.total)) {
          console.log("invalid page number");

          this.$router.push({ path: "/error" });
        }

        if (data && data.results) {
          this.dataEmpty = false;
        } else {
          this.dataEmpty = true;
        }

        this.stories = data.results;
        this.total = Math.ceil(data.total / 20);

        if (this.page === 1) {
          this.hidePrevious = true;
          console.log("first page");
        } else {
          this.hidePrevious = false;
        }
        if (this.page + 1 === this.total) {
          this.hideNext = true;
        } else {
          this.hideNext = false;
        }
      } catch (e) {
        if (e.response.status === 404 || e.response.status === 500) {
          this.$router.push({ path: "/error" });
        }
      }
    },
  },

  async created() {
    await this.getStories(this.$route.params.page);
  },

  watch: {
    $route() {
      if (!this.$route.params.page) {
        this.$router.push({ path: "/error" });
      }
      this.getStories(this.$route.params.page);
    },
  },
};
</script>

<style>
.pos {
  width: 200px;
}
</style>
