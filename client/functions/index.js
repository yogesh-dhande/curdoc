const { signUp } = require("./src/auth");
const {
  updateUserWhenNewProjectCreated,
  updateUserWhenProjectUpdated,
  handleProjectDeleted,
  updateProjectsWhenUserUpdated,
} = require("./src/triggers");

module.exports = {
  signUp,
  updateUserWhenNewProjectCreated,
  updateUserWhenProjectUpdated,
  handleProjectDeleted,
  updateProjectsWhenUserUpdated,
};
