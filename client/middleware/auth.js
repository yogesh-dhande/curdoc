export default function ({ store, redirect }) {
  console.log("check auth status");
  // If the user is not authenticated
  if (!store.getters.loggedIn) {
    return redirect("/login?redirect=/dashboard");
  }
}
