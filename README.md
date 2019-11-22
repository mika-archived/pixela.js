# Pixela.js

[![GitHub](https://img.shields.io/github/license/mika-f/pixela.js?style=flat-square)](./LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@mikazuki/pixela?style=flat-square)](https://www.npmjs.com/package/@mikazuki/pixela)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmika-f%2Fpixela.js.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmika-f%2Fpixela.js?ref=badge_shield)

Pixela API for JavaScript written in TypeScript.

## Install

```
yarn add @mikazuki/pixela
```

CDN : [UNPKG](https://unpkg.com/@mikazuki/pixela) | [jsDelivr](https://cdn.jsdelivr.net/npm/@mikazuki/pixela) | [Pika CDN](https://cdn.pika.dev/@mikazuki/pixela)

## How to use

### In Browser

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mikazuki/pixela"></script>
<script>
  const client = new window.Pixela("YOUR_NAME", "YOUR_TOKEN");
  client.incrementPixel("graph_id").then(r => {
    if (r.isSuccess) {
      console.log("Pixel Incremented!");
    } else {
      console.log("Error");
    }
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

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmika-f%2Fpixela.js.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmika-f%2Fpixela.js?ref=badge_large)
