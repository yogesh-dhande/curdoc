export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.getters.loggedIn) {
    return redirect("/login?redirect=/dashboard");
  }
}
