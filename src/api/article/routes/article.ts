/**
 * article router
 */

import { factories } from "@strapi/strapi";

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const customRoutes = [
  {
    method: "GET",
    path: "/articles/slug/:slug",
    handler: "article.findBySlug",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/articles/seo/:slug",
    handler: "article.findSeoBySlug",
    config: {
      auth: false,
    },
  },
];

const coreRouter = factories.createCoreRouter("api::article.article");

export default customRouter(coreRouter, customRoutes);
