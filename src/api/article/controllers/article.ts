/**
 * article controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async findBySlug(ctx) {
      try {
        await this.validateQuery(ctx);
        const { slug } = ctx.params;

        const article = await strapi
          .documents("api::article.article")
          .findFirst({
            filters: {
              slug: {
                $eq: slug,
              },
            },
            populate: [
              "seo",
              "seo.metaImage",
              "thumbnail",
              "author",
              "categories",
              "note",
              "paragraphs",
              "paragraphs.translated",
            ],
          });

        if (!article) {
          ctx.status = 404;
          ctx.body = {
            message: "Article not found",
          };
          return;
        }

        ctx.body = {
          data: article,
        };
      } catch (err) {
        ctx.body = err;
      }
    },
    async findSeoBySlug(ctx) {
      try {
        await this.validateQuery(ctx);
        const { slug } = ctx.params;

        const article = await strapi
          .documents("api::article.article")
          .findFirst({
            filters: {
              slug: {
                $eq: slug,
              },
            },
            populate: ["seo", "seo.metaImage"],
          });

        if (!article) {
          ctx.status = 404;
          ctx.body = {
            message: "Article not found",
          };
          return;
        }

        ctx.body = {
          data: article.seo,
        };
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
