export default () => ({
  seo: {
    enabled: true,
  },
  voicer: {
    enabled: true,
    config: {
      apiKey: process.env.PLAYHT_API_KEY,
      userId: process.env.PLAYHT_API_USER_ID,
      serverUrl: process.env.SERVER_URL,
      adminToken: process.env.ADMIN_TOKEN,
    },
    resolve: "./src/plugins/voicer",
  },
});
