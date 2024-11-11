import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'voicer',
    plugin: 'voicer',
    type: 'string',
    inputSize: {
      default: 6,
      isResizable: true,
    },
  });
};

export default register;
