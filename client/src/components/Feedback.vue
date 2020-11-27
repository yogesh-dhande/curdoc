<template>
    <b-container class="mx-auto">
      <b-card style="max-width: 40rem">
        <b-card-header>Please Provide Feedback</b-card-header>
        <b-container>
          <b-form @submit="onSubmit" v-if="show">
            <b-form-group
              id="email-group"
              label="Email"
              label-for="email-input"
            >
              <b-form-input
                id="email-input"
                v-model="form.email"
                type="email"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="feedback-group"
              label="Feedback"
              label-for="feedback-input"
            >
              <b-form-textarea
                id="feedback-input"
                v-model="form.feedback"
                rows="3"
              >
              </b-form-textarea>
            </b-form-group>
            <b-button variant="warning">Submit</b-button>
          </b-form>
        </b-container>
      </b-card>
    </b-container>
</template>

<script>

export default {
  name: "feedback",
  data() {
    return {
      form: {
        email: "",
        feedback: "",
      },
      show: true,
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
  },
};
</script>

<style>
</style>