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
          :to="{ name: 'ComicList', params: { page: this.page - 1 } }"
        >
          Previous
        </router-link>
      </b-button>
      <b-button variant="outline-info" :disabled="this.hideNext">
        <router-link
          :to="{ name: 'ComicList', params: { page: this.page + 1 } }"
        >
          Next
        </router-link>
      </b-button>
    </div>
    <br /><br /><br />

    <b-row align-v="stretch">
      <b-col v-for="(comic, idx) in comics" :key="idx">
        <b-card>
          <img
            :src="comic.thumbnail.path + '.' + comic.thumbnail.extension"
            alt="Image"
            style="width: 18rem; height: 18rem"
          />

          <h4>{{ comic.name }}</h4>

          <b-card-text>
            <div v-if="comic.description">
              <div v-html="comic.description" />
            </div>
            <div v-else>No Description</div>
          </b-card-text>

          <b-button variant="outline-warning">
            <router-link :to="{ name: 'Comic', params: { id: comic.id } }">
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
import { comicsUrl } from "@/assets/dataURL";

export default {
  name: "ComicList",
  data() {
    return {
      page: this.$route.params.page,
      comics: [],
      image: require("@/assets/download.jpeg"),
      hidePrevious: false,
      hideNext: false,
      dataEmpty: true,
      total: 0,
    };
  },
  methods: {
    async getComics(page) {
      try {
        this.page = Number(page);
        let offset = this.page * 20;
        const {
          data: { data },
        } = await axios.get(`${comicsUrl}&offset=${offset}&limit=20`);

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

        this.comics = data.results;
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
    this.getComics(this.$route.params.page);
  },

  watch: {
    $route() {
      if (!this.$route.params.page) {
        this.$router.push({ path: "/error" });
      }
      this.getComics(this.$route.params.page);
    },
  },
};
</script>

<style></style>
