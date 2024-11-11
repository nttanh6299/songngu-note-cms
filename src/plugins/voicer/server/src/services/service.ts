import type { Core } from '@strapi/strapi';
import * as PlayHT from 'playht';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { FormData } from 'formdata-node';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async convertToVoice(slug: string, text: string): Promise<string> {
    try {
      const tempFilePath = path.join(__dirname, `${slug}.mp3`);
      const fileStream = fs.createWriteStream(tempFilePath);

      PlayHT.init({
        apiKey: strapi.plugin('voicer').config('apiKey'),
        userId: strapi.plugin('voicer').config('userId'),
      });

      const stream = await PlayHT.stream(text, {
        voiceEngine: 'Play3.0-mini',
        voiceId:
          's3://voice-cloning-zero-shot/7c38b588-14e8-42b9-bacd-e03d1d673c3c/nicole/manifest.json',
        outputFormat: 'mp3',
      });

      stream.pipe(fileStream);

      const audioUrl = await new Promise<string>((resolve, reject) => {
        fileStream.on('finish', async () => {
          const fileBuffer = fs.readFileSync(tempFilePath);
          const fileBlob = new Blob([fileBuffer], { type: 'audio/mp3' });
          const formData = new FormData();
          formData.append('files', fileBlob, `${slug}.mp3`);

          try {
            const { data } = await axios.post(
              `${strapi.plugin('voicer').config('serverUrl')}/api/upload`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${strapi.plugin('voicer').config('adminToken')}`,
                },
              }
            );
            if (data?.[0]?.url) {
              resolve(data[0].url);
            } else {
              reject(new Error('Upload failed'));
            }
          } catch (error) {
            reject(error);
          } finally {
            fs.unlinkSync(tempFilePath);
          }
        });
      });

      return audioUrl;
    } catch (err) {
      console.log('Error:', err);
    }
  },
});

export default service;
