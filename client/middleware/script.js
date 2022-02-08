export default function ({ app }) {
  app.router.afterEach((to, from) => {
    if (to.name === "userName-projects-projectSlug") this.setScript();
  });
}
