import { PineconeClient, pineconeClient } from "./client";
import superagent from "superagent";
import config from 'src/core/config'

const makePinecone = (): PineconeClient => {
  return pineconeClient({
    http: superagent,
    key: config.pinecone.apiKey
  })
}

export type { PineconeClient }
export default makePinecone