# Shopswap Demo

## Running Locally

Run the server which includes that api endpoints and the nextjs ssr app.
Go to [http://localhost:8080](http://localhost:8080) in the
browser to use the app.

```bash
yarn dev
```

## Testing

Run all test on frontend and backend.

```bash
yarn test
```

## Vectorization & Profile Evaluation

Companies profile submissions are vectorized using the `src/core/vectorizer` module and then
stored in [Pinecone](https://pinecone.io) under a 8 dimensional euclidean index. The raw
profile, questions, and answers are stored in [Mongo](https://mongodb.com) as json documents.

### Weights

Each question and answer option has a manually managed `weight`. The weights are used
by the vectorizer to produce an accurate vector representation of a company's submitted
profile.

#### Question Weights

Question weights are realtive to one another and can be any positive or negative numeber. The highest weighted question will have the highest impact on the vector. Increase question weights
when you want one question to have more _importance_ than another.

#### Answer Weights

Every answer for a question has a weight. These weights must be between `0.000001` and `0.999999`. If two options are similar, make their weights similar. If two options are different, make their weights different.