const get = <T = string>(
  name: string,
  defaultValue?: T,
  cast: (v: any) => T = (v) => v
): T => {
  const val = process.env[name];
  if (!val) return defaultValue!;
  return cast(val);
};

const config = {
  env: get("SS_ENV"),
  mongo: {
    uri: get("MONGO_URI"),
  },
  pinecone: {
    apiKey: get("PINECONE_API_KEY")
  }
};

export type Config = typeof config;

export default config;
