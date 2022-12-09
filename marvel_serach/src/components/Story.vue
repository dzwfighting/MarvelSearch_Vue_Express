<template>
  <div class="detail">
    <b-card bg-variant="info" class="card-pos">
      <b-card-text>
        <div class="dis">
          <h5>Story Title:</h5>
          {{ this.title }}
        </div>

        <h5 class="dis">Description</h5>
        <div>{{ this.description }}</div>

        <h5 class="dis">Characters</h5>
        <ul v-if="this.noCharacters">
          <li>No Characters</li>
        </ul>
        <ul v-else>
          <li v-for="(charac, idx) in this.characters" :key="idx">
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
          </li>
        </ul>

        <h5 class="dis">Comics</h5>
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
          </li>
        </ul>

        <h5 class="dis">Events</h5>
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
  name: "Story",
  data() {
    return {
      id: this.$route.params.id,
      title: "No Title",
      description: "No Description",
      comics: [],
      characters: [],
      events: [],
      noComics: false,
      noCharacters: false,
      noEvents: false,
    };
  },

  methods: {
    async getStory(id) {
      try {
        const {
          data: { data },
        } = await axios.get(
          `${baseUrl}/stories/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`
        );
        console.log(data);

        if (data.results[0].title) {
          this.title = data.results[0].title;
        }

        if (data.results[0].characters.items.length) {
          this.characters = data.results[0].characters.items;
          this.noCharacters = false;
        } else {
          this.noCharacters = true;
        }

        if (data.results[0].comics.items.length) {
          this.characters = data.results[0].comics.items;
          this.noComics = false;
        } else {
          this.noComics = true;
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
    await this.getStory(this.$route.params.id);
  },

  watch: {
    $route() {
      this.getStory(this.$route.params.id);
    },
  },
};
</script>

<style>
.dis {
  padding-top: 20px;
}
</style>
