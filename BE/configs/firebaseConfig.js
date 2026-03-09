// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  type: "service_account",
  project_id: "bookstore-740d1",
  private_key_id: "1f2e0313e4302395439e82dbf78e279bb1e9818d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDC5+D+Kru6keim\nIiGPGvSPS1PjO5cRudGW1jvzGXlZtJDqgGSFXFylLz14Gb5XCXg75Pc2i81Xf226\n/8ClRSycAyYW/3fhyJutX0XK5ILI/hY9s0cbvyUEod0+KywVd8IpLqb+UQAN3BNd\nUDj0d5xrQ3KMUeRzghYKRLbLgj6OmlhmNEH2OqFQm15WpLbfjqBkrttWXcrgnL+m\n9HWBV+trbW3t5v2jdO1XWYkxzfQedDaalOgBRe0bJEs5McfLQk8xuPk820vHbrzW\nLjwLcEoEruKe79QKV3arTqDh+Cz8rTN83TwzLgEScG22LIo8OxakLwEGRD3xp85h\nVd5atFjbAgMBAAECggEAT/gG6xIKg3LBY4TGgypapH6SNT4qbjXxJjPRVh2iGinJ\necXjOIqcYpQe4uuhGqICiISZ3/H9dwSMN7keyFC5DGwIUVBRVjzSjxBzmNsoRCJo\narlnmB1VqXBmT88z370K143SK699V7Jv6Y30SG3ZKnN6iNNC6he6Rk1KOPbABw7a\ner31Ac24KW82/+w5QuF+TsE5g5gbiMFhlq3LC7qTm1qstEtWGNpUGDyrR1PHw9k0\ndv4LNyoD1m7NIp/4OOg7jZ/C4kGxoPdjXtxzygKz+o8G3nqqc0jJ4sUbRQVbE/ah\n5RBvJZPcsBSjgadQ22ZD41rPm0gE7FEdk07fU5E95QKBgQDofIR+7+wtNV4e9VSe\nA62z/nZ5o689IqtxVf6TzN86Ot2InDhFNEFbO7tQQ1isvSyiq9eYcSMOWTdLZs+m\n6WrXqN8W5NHLtv/UcDRVexP/KZSzgFekNHuLeVrWYqcvJGacf6APiH2KoYiNioKl\nOPxwzhkdMN9rguzBT4/NQO71VQKBgQDWnlU14uXUNYWIPSDYazTbz/Q44rOqOUMA\nmayLJRZu5kV5Ucb+bUimRYUQgMDjqpjJ/hdUUj8R1wgCFp/3Fq9xf/59fSgV9RJB\nose5+aqOKbUxHmYjeAOFrF3DQEVSxg+mDuapAidPAM3ep25eLp0rNjiXpTR0yUd8\n9/zyNRgVbwKBgQCcu0U/plOcbrwTNuVi2awDCmuouZbsKjFWaNkFnzpmsUSkUl0F\nGqNs9CnlhGGFossyp5LjLHKru62xYZBgQEBNP4WWk5B0O9zgxPwjHKRwgwHCuaVc\nCB25+4gnu75l465hlxC7KBMqoJfEhDprVK2rBuabbVVRz6P49sBFaZ8vOQKBgFf0\n/gEeo4iMAtTqEIsBrOElYfbqWi26WA5n7MH+CiqbLv/glwhw62RRe45e5i6oHQQz\noYYKSxTZpsuMUDTo1DBU/4yYfZQ6IyhJOUer3c1zpHGj/sIsjmz7TlYWAhNBXup0\nku3TFx8Wuki1H9NzkTBDgYAM0enHEAhUbhMp1Vv7AoGAWzal+tnpmW38OP/xYI/P\nss0DcExGGf0HOy/0/gN+1SdighTIBzKT+P9BXg175HxmNczv7QpiVc84AKfOjFzr\nbWd4h2NVXKjGEE6X670Q1FVoJeYEl8/waWA03+rlSX+kr/2TPzd0FrWqO4gJRROy\n+seQmYkFZ+lYOUZJfkuahks=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@bookstore-740d1.iam.gserviceaccount.com",
  client_id: "110480537557517888875",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40bookstore-740d1.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = firebaseConfig;
