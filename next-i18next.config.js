/** @type {import('next-i18next').UserConfig} */
const path = require("path");
module.exports = {
  i18n: {
    locales: ["en", "de", "es", "ar", "he", "zh"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    domains: ["http://admin.silsilaeiftekhari.in/"],
  },
  localePath: path.resolve("./public/locales"),
};
