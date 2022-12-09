import Vue from "vue";
import Router from "vue-router";

// import HelloWorld from "@/components/HelloWorld";
import CharacterList from "@/components/CharacterList";
import Character from "../src/components/Character";
import Comic from "../src/components/Comic";
import ComicList from "../src/components/ComicList";
import Story from "../src/components/Story";
import StoryList from "../src/components/StoryList";
import Error from "../src/components/Error";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/characters/page/:page",
      name: "CharacterList",
      component: CharacterList,
    },
    {
      path: "/characters/:id",
      name: "Character",
      component: Character,
    },
    {
      path: "/comics/page/:page",
      name: "ComicList",
      component: ComicList,
    },
    {
      path: "/comics/:id",
      name: "Comic",
      component: Comic,
    },
    {
      path: "/stories/page/:page",
      name: "StoryList",
      component: StoryList,
    },
    {
      path: "/stories/:id",
      name: "Story",
      component: Story,
    },
    {
      path: "/error",
      name: "Error",
      component: Error,
    },
  ],
});
