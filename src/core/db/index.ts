import { MongoClient as Mongo, Db, ServerApiVersion } from 'mongodb'
import config from '../config'
import createClient from './client'

export type { MongoClient } from './client'

let db: Promise<Db> | null = null

const makeMongo = () => {
  if (!db) {
    db = new Mongo(config.mongo.uri, {
      serverApi: ServerApiVersion.v1,
      retryWrites: true,
      w: 'majority'
    })
      .connect()
      .then(c => c.db('main'))
  }
  return createClient(db)
}

export default makeMongo
