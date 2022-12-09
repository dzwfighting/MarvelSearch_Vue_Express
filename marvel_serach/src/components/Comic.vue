<template>
  <div class="detail">
    <b-card class="card-pos">
      <h4>{{ this.title }}</h4>
      <img :src="this.image" alt="Image" />
      <br />
      <b-card-text>
        <br />
        <h5>Description</h5>
        <div v-html="this.description" />
        <br />
        <div>Stories</div>
        <ul v-if="noStories">
          <li>No Stories</li>
        </ul>
        <ul v-else>
          <li v-for="(story, idx) in this.stories" :key="idx">
            <!-- {{
              story.resourceURI.split("/")[
                story.resourceURI.split("/").length - 1
              ]
            }} -->
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

        <div>Characters</div>
        <ul v-if="this.noCharacters">
          <li>No Characters</li>
        </ul>
        <ul v-else>
          <li v-for="(charac, idx) in this.characters" :key="idx">
            <!-- {{ charac.name }} -->
            <router-link
              :to="{
                name: 'Character',
                params: {
                  id: charac.resourceURI.split('/')[
                    charac.resourceURI.split('/').length - 1
                  ],
                },
              }"
            >
              {{ charac.name }}
            </router-link>
            <!-- <a :href="charac.resourceURI.slice(35)">{{ charac.name }}</a> -->
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

export default {
  name: "Comic",
  data() {
    return {
      id: this.$route.params.id,
      title: "No Title",
      image: require("@/assets/download.jpeg"),
      description: "No Description",
      stories: [],
      characters: [],
      events: [],
      noStories: false,
      noCharacters: false,
      noEvents: false,
    };
  },

  methods: {
    async getComic(id) {
      try {
        const {
          data: { data },
        } = await axios.get(
          `${baseUrl}/comics/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`
        );
        console.log(data);

        this.title = data.results[0].title ? data.results[0].title : "No Title";
        if (data.results[0].thumbnail) {
          this.image =
            data.results[0].thumbnail.path +
            "." +
            data.results[0].thumbnail.extension;
        }

        if (data.results[0].description) {
          this.description = data.results[0].description;
        }

        if (data.results[0].stories.items.length) {
          this.stories = data.results[0].stories.items;
          this.noStories = false;
        } else {
          this.noStories = true;
        }

        if (data.results[0].characters.items.length) {
          this.characters = data.results[0].characters.items;
          this.noCharacters = false;
        } else {
          this.noCharacters = true;
        }

        if (data.results[0].events.items.length) {
          this.events = data.results[0].events.items;
          this.noEvents = false;
        } else {
          this.noEvents = true;
        }
      } catch (e) {
        if (e.response.status === 404 || e.response.status === 500) {
          this.$router.push({ path: "/error" });
        }
      }
    },
  },

  async created() {
    await this.getComic(this.$route.params.id);
  },

  watch: {
    $route() {
      this.getComic(this.$route.params.id);
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
