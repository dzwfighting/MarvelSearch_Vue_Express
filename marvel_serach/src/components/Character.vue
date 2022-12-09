<template>
  <div class="detail">
    <b-card class="card-pos">
      <h4>
        {{ this.name }}
      </h4>
      <img :src="this.image" alt="Image" />
      <b-card-text>
        <h5>{{ this.description }}</h5>

        <div>Stories</div>
        <ul v-if="this.noStories">
          <li>No Stories</li>
        </ul>
        <ul v-else>
          <li v-for="(story, idx) in this.stories" :key="idx">
            <router-link
              :to="{
                name: 'Story',
                params: {
                  id: story.resourceURI.split('/')[
                    story.resourceURI.split('/').length - 1
                  ],
                },
              }"
            >
              {{ story.name }}
            </router-link>
            <!-- <a :href="story.resourceURI.slice(35)">{{ story.name }}</a> -->
          </li>
        </ul>

        <div>Comics</div>
        <ul v-if="this.noComics">
          <li>No Comics</li>
        </ul>
        <ul v-else>
          <li v-for="(comic, idx) in this.comics" :key="idx">
            <router-link
              :to="{
                name: 'Comic',
                params: {
                  id: comic.resourceURI.split('/')[
                    comic.resourceURI.split('/').length - 1
                  ],
                },
              }"
            >
              {{ comic.name }}
            </router-link>
            <!-- <a :href="comic.resourceURI.slice(35)">{{ comic.name }}</a> -->
          </li>
        </ul>

        <div>Events</div>
        <ul v-if="this.noEvents">
          <li>No Events</li>
        </ul>
        <ul v-else>
          <li v-for="(event, idx) in this.events" :key="idx">
            {{ event.name }}
          </li>
        </ul>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { ts, publickey, hash, baseUrl } from "@/assets/dataURL";

// import axios from "axios";
export default {
  name: "Character",
  data() {
    return {
      id: this.$route.params.id,
      name: null,
      image: require("@/assets/download.jpeg"),
      description: "No Description",
      stories: [],
      comics: [],
      events: [],
      noStories: false,
      noComics: false,
      noEvents: false,
    };
  },
  methods: {
    async getCharacter(id) {
      try {
        const {
          data: { data },
        } = await axios.get(
          `${baseUrl}/characters/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`
        );
        console.log(data);
        this.name = data.results[0].name;
        this.image =
          data.results[0].thumbnail.path +
          "." +
          data.results[0].thumbnail.extension;
        this.description = data.results[0].description
          ? data.results[0].description
          : "No description";
        this.stories = data.results[0].stories.items.length
          ? data.results[0].stories.items
          : "No Stories";
        this.comics = data.results[0].comics.items.length
          ? data.results[0].comics.items
          : "No Comics";
        this.events = data.results[0].events.items.length
          ? data.results[0].events.items
          : "No Events";
        console.log(this.stories);
        console.log(this.comics);
        console.log(this.events);
        if (this.stories === "No Stories") {
          this.noStories = true;
        } else {
          this.noStories = false;
        }
        if (this.comics === "No Comics") {
          this.noComics = true;
        } else {
          this.noComics = false;
        }

        if (this.events === "No Events") {
          this.noEvents = true;
        } else {
          this.noEvents = false;
        }
      } catch (e) {
        if (e.response.status === 404 || e.response.status === 500) {
          this.$router.push({ path: "/error" });
        }
      }
    },
  },

  async created() {
    await this.getCharacter(this.$route.params.id);
  },
  watch: {
    $route() {
      this.getCharacter(this.$route.params.id);
    },
  },
};
</script>
<style>
h5 {
  margin-top: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
.card-pos {
  width: 700px;
  margin-left: 450px;
}
.detail {
  padding-bottom: 50px;
}
</style>
