<template>
  <div>
    <nav-bar />
    <b-container>
      <b-form @submit="onSubmit">
        <b-form-group id="input-group-1" label="Name" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="name"
            required
            :placeholder="userProfile.name"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Job Title" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="title"
            :placeholder="userProfile.title"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "./NavBar.vue";

export default {
  name: "Profile",
  components: {
    "nav-bar": NavBar,
  },
  data() {
    return {
      name: "",
      title: "",
      showSuccess: false,
    };
  },
  computed: {
    ...mapState(["userProfile"]),
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch("updateProfile", {
        name: this.name !== "" ? this.name : this.userProfile.name,
        title: this.title !== "" ? this.title : this.userProfile.title,
      });

      this.name = "";
      this.title = "";

      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    },
  },
};
</script>
