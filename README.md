# Pixela.js

![GitHub](https://img.shields.io/github/license/mika-f/pixela.js?style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@mikazuki/pixela?style=flat-square)

Pixela API for JavaScript written in TypeScript.


## Install

```
yarn add @mikazuki/pixela
```


## How to use

```typescript
import { Pixela } from "@mikazuki/pixela";

const graphId = "tweets";

const client = new Pixela("username", "token");

// if you don't have an account, create a new account
await client.createUser({ agreeTermsOfService: true, notMinor: true });

// create new graph
await client.createGraph({ id: graphId, name: "Tweets Per Day", unit: "tweets", ...});

// increment today's pixel
await client.incrementPixel(graphId);
```

If you want to see real-world example?  
Please check-out [Knockru/Crouton](https://github.com/Knockru/Crouton) repository!