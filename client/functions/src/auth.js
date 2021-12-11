const functions = require("firebase-functions");
const { db, auth, admin, cors } = require("./app");

exports.signUp = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
      };

      if (newUser.password !== newUser.passwordConfirmation) {
        return res.status(403).json({ message: "Passwords do not match" });
      }
      if (reservedNames.includes(newUser.name)) {
        return res.status(403).json({
          message: `Username ${newUser.name} not allowed. Please pick a different name.`,
        });
      }
      let snap = await db
        .collection("users")
        .where("name", "==", newUser.name)
        .get();
      if (snap.size > 0) {
        console.log("username already taken");

        return res
          .status(403)
          .json({ message: `Username ${newUser.name} is already taken.` });
      } else {
        console.log("creating user");
        let user = await auth.createUser({
          email: newUser.email,
          password: newUser.password,
          emailVerified: false,
        });

        let userDoc = {
          name: newUser.name,
          id: user.uid,
          email: user.email,
          displayName: newUser.name,
          created: admin.firestore.FieldValue.serverTimestamp(),
          photoUrl: "",
          thumbnailUrl: "",
          title: "",
          location: "",
          aboutMe: "",
        };
        await db.collection("users").doc(user.uid).set(userDoc);
        await db.collection("readonly").doc(user.uid).set({
          id: user.uid,
          totalStorageUsed: 0,
          plan: "free",
        });
        return res.status(200).send(newUser);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });
});

const reservedNames = [
  "profile",
  "home",
  "about",
  "jobs",
  "careers",
  "faq",
  "faqs",
  "contact",
  "support",
  "feedback",
  "dashboard",
  "landing",
  "login",
  "signin",
  "register",
  "signup",
  "gallery",
  "explore",
  "browse",
  "discover",
  "preview",
  "demo",
  "search",
  "find",
  "status",
  "check",
  "blob",
  "tree",
  "error",
  "render",
  "email",
  "verify",
  "device",
];
