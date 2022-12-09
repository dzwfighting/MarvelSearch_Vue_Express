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
          :to="{ name: 'CharacterList', params: { page: this.page - 1 } }"
        >
          Previous
        </router-link>
      </b-button>
      <b-button variant="outline-info" :disabled="this.hideNext">
        <router-link
          :to="{ name: 'CharacterList', params: { page: this.page + 1 } }"
        >
          Next
        </router-link>
      </b-button>
    </div>
    <br /><br /><br />

    <b-row align-v="stretch">
      <b-col v-for="(character, idx) in characters" :key="idx">
        <b-card img-top style="width: 20rem">
          <img
            :src="
              character.thumbnail.path + '.' + character.thumbnail.extension
            "
            alt="Image"
            style="width: 18rem; height: 18rem"
          />

          <h4>{{ character.name }}</h4>

          <b-card-text>
            {{
              character.description ? character.description : "No description"
            }}
          </b-card-text>

          <b-button variant="outline-warning">
            <router-link
              :to="{ name: 'Character', params: { id: character.id } }"
            >
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
import { characterUrl } from "@/assets/dataURL";

export default {
  name: "CharacterList",
  data() {
    return {
      page: this.$route.params.page,
      characters: [],
      image: require("@/assets/download.jpeg"),
      hidePrevious: false,
      hideNext: false,
      dataEmpty: true,
      total: 0,
    };
  },

  methods: {
    async getCharacters(page) {
      try {
        console.log(page);
        this.page = Number(page);
        console.log(this.page);
        let offset = this.page * 20;
        const {
          data: { data },
        } = await axios.get(`${characterUrl}&offset=${offset}&limit=20`);

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

        this.characters = data.results;
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
    await this.getCharacters(this.$route.params.page);
  },

  watch: {
    $route() {
      console.log(this.$route.params.page);
      if (!this.$route.params.page) {
        this.$router.push({ path: "/error" });
      }
      this.getCharacters(this.$route.params.page);
    },
  },
};
</script>

<style>
.btn {
  margin-right: 20px;
}
</style>
