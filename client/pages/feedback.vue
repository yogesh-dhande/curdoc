<template>
  <form-page>
    <form
      class="max-w-lg m-4 py-6 px-10 bg-gray-900 bg-opacity-25 rounded-lg shadow-xl"
    >
      <text-input
        label="Email"
        v-model="feedback.email"
        v-if="!currentUser.email"
      ></text-input>
      <text-area-input
        class="mt-3"
        label="Message"
        v-model="feedback.message"
      />
      <image-uploader
        class="my-3"
        :refKey="currentUser.id"
        :showThumbnail="false"
        @url="(val) => (feedback.image = val)"
        @remove="feedback.image = ''"
      ></image-uploader>
      <custom-button class="my-3" @click="saveFeedback" type="button"
        >Send Feedback</custom-button
      >
    </form>
  </form-page>
</template>

<script>
import { mapState } from "vuex";
import TextInput from "@/components/TextInput";
import TextAreaInput from "@/components/TextAreaInput";
import ImageUploader from "@/components/ImageUploader";
import FormPage from "@/components/FormPage";
import CustomButton from "../components/CustomButton.vue";

export default {
  name: "feedback-form",
  components: {
    TextInput,
    TextAreaInput,
    ImageUploader,
    FormPage,
    CustomButton,
  },
  head() {
    return this.$createSEOMeta({
      title: "Provide Feedback on REPL Notes",
    });
  },
  data() {
    return {
      feedback: {
        email: "",
        message: "",
        image: "",
      },
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    saveFeedback() {
      this.$feedbackCollection.doc().set({
        email: this.currentUser.email
          ? this.currentUser.email
          : this.feedback.email,
        message: this.feedback.message,
        image: this.feedback.image,
      });

      this.feedback.message = "";
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style>
</style>