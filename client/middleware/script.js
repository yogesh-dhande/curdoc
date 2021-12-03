export default function ({ app }) {
  app.router.afterEach((to, from) => {
    console.log(to);
    if (to.name === "userName-projects-projectSlug") this.setScript();
  });
}
