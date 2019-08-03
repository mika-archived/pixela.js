# Pixela.js

[![GitHub](https://img.shields.io/github/license/mika-f/pixela.js?style=flat-square)](./LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@mikazuki/pixela?style=flat-square)](https://www.npmjs.com/package/@mikazuki/pixela)

Pixela API for JavaScript written in TypeScript.

## Install

```
yarn add @mikazuki/pixela
```

CDN : [UNPKG](https://unpkg.com/@mikazuki/pixela) | [jsDelivr](https://cdn.jsdelivr.net/npm/@mikazuki/pixela)

## How to use

### In Browser

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mikazuki/pixela"></script>
<script>
  const client = new window.Pixela("YOUR_NAME", "YOUR_TOKEN");
  client
    .incrementPixel("graph_id")
    .then(() => {
      console.log("Increment Pixel!");
    })
    .catch(() => {
      console.log("Error!");
    });
</script>
```

### In Node.js

```typescript
import Pixela from "@mikazuki/pixela";

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
