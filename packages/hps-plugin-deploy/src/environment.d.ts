export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // The remote cdn base url
      REMOTE_CDN_BASE_URL: string;

      // Aliyun deploy service
      ALIYUN_ACCESS_KEY_ID: string;
      ALIYUN_ACCESS_KEY_SECRET: string;
      ALIYUN_API_ENDPOINT: string;
      ALIYUN_BUCKET_NAME: string;
    }
  }
}
