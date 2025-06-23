// next.config.mjs
import { existsSync } from 'fs';
import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental.esmExternals は削除
  webpack(config) {
    for (const rule of config.module.rules) {
      if (!Array.isArray(rule.oneOf)) continue;
      for (const oneOfRule of rule.oneOf) {
        // loader 設定が配列かどうか確認
        if (!Array.isArray(oneOfRule.use)) continue;
        for (const useEntry of oneOfRule.use) {
          if (
            useEntry.loader &&
            typeof useEntry.loader === 'string' &&
            useEntry.loader.includes('css-loader')
          ) {
            useEntry.options = {
              ...useEntry.options,
              esModule: true,
            };
          }
        }
      }
    }
    return config;
  }
};

export default nextConfig;
