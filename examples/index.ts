import { Pixela } from "../src";

// Examples of Pixela (https://pixe.la)

const examples = async () => {
  const client = new Pixela("USERNAME", "ACCESS_TOKEN");

  // pixela.js does not raise an exception when an HTTP requests fails.
  // please check the value of `isSuccess` contained in the return value.

  // for example, below example is fails because `agreeTermsOfService: false`.
  const response = await client.createUser({ agreeTermsOfService: false, notMinor: true });
  console.log(response); // => { isSuccess: false, message: "In order to use this service, ..." };

  // await client.createUser({ agreeTermsOfService: true, notMinor: true });
  // await client.updateUser({ newToken: "b88236df-d0e6-480d-92a1-9847e236d796" });
  //
  // await client.createGraph({ id: "commits", name: "Pixela.js Commit Graph", unit: "commit(s)", type: "int", color: "momiji" });
  // await client.updateGraph({ graphId: "commits", color: "shibafu" });
  //
  // await client.createPixel({ graphId: "commits", date: "20190730", quantity: 10 });
  // await client.getPixel({ graphId: "commits", date: "20190730" });
  //
  // await client.updatePixel({ graphId: "commits", date: "20190730", quantity: 11 });
  // await client.incrementPixel("commits");
  // await client.decrementPixel("commits");
  //
  // await client.getPixelDates({ graphId: "commits" });
  // await client.getStats("commits");
  // await client.getGraphSvg({ graphId: "commits", mode: "short" });
  //
  // await client.createWebhook({ graphId: "commits", type: "increment" });
  // await client.getWebhooks();
  // await client.invokeWebhook("bc4e92e51c81e33db3abf164c50c68f80286398cd322780d31861d5c86018711");
  // await client.deleteWebhook("bc4e92e51c81e33db3abf164c50c68f80286398cd322780d31861d5c86018711");
  //
  // await client.deletePixel({ graphId: "commits", date: "20190730" });
  // await client.deleteGraph("commits");
  // await client.deleteUser();
};

examples()
  .then(w => console.log(w))
  .catch(e => console.error(e));
