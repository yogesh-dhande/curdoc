const axios = require("axios");
const functions = require("firebase-functions");
const { cors, sandboxUrls } = require("./app");

const sandboxes = sandboxUrls.map((url) => {
  return {
    url,
    lastUsed: null,
    projectId: null,
  };
});

exports.getAppScript = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      let sandboxUrl;
      let usedSandbox;
      const projectId = req.body.project.id;

      // Find unused sandbox service
      for (let sandbox of sandboxes) {
        if (!sandbox.lastUsed || sandbox.projectId === projectId) {
          usedSandbox = sandbox;
          sandboxUrl = usedSandbox.url;
          break;
        }
      }

      // If no used sandbox service, use the oldest used first
      if (!sandboxUrl) {
        // Oldest first
        usedSandbox = sandboxes.sort(
          (a, b) => a.lastUsed.seconds - b.lastUsed.seconds
        )[0];
        sandboxUrl = usedSandbox.url;
      }

      const response = await axios.post(sandboxUrl, req.body, {
        headers: {
          "api-key": functions.config().sandbox.api.key,
        },
      });
      usedSandbox.lastUsed = Date.now();
      usedSandbox.projectId = projectId;
      return res.status(200).send(response.data);
    } catch (error) {
      console.log(error.message);
      res.status(400).json(error);
    }
  });
});
