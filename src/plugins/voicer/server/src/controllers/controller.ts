import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx) {
    const response: string = await strapi
      .plugin('voicer')
      .service('service')
      .convertToVoice(ctx.request.body.slug, ctx.request.body.text);
    ctx.body = response;
  },
});

export default controller;
