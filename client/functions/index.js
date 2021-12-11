const { signUp } = require("./src/auth");
const { getAppScript } = require("./src/sandbox");
const {
  updateUserWhenNewProjectCreated,
  updateUserWhenProjectUpdated,
  handleProjectDeleted,
  updateProjectsWhenUserUpdated,
} = require("./src/triggers");

module.exports = {
  signUp,
  getAppScript,
  updateUserWhenNewProjectCreated,
  updateUserWhenProjectUpdated,
  handleProjectDeleted,
  updateProjectsWhenUserUpdated,
};
