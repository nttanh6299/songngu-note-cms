import { getTranslation } from './utils/getTranslation';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    // app.addMenuLink({
    //   to: `plugins/${PLUGIN_ID}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${PLUGIN_ID}.plugin.name`,
    //     defaultMessage: PLUGIN_ID,
    //   },
    //   Component: async () => {
    //     const { App } = await import('./pages/App');

    //     return App;
    //   },
    // });

    // app.registerPlugin({
    //   id: PLUGIN_ID,
    //   initializer: Initializer,
    //   isReady: false,
    //   name: PLUGIN_ID,
    // });

    app.customFields.register({
      name: 'voicer',
      pluginId: `voicer`,
      type: 'string',
      intlLabel: {
        id: 'global.plugins.voicer.label',
        defaultMessage: 'Voicer',
      },
      intlDescription: {
        id: 'global.plugins.voicer.description',
        defaultMessage: 'Convert text to speech',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ './components/Input'),
      },
      options: {},
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: getTranslation(data),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
