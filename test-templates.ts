import { getBioTemplates } from "./lib/actions/contentActions";

async function test() {
  const templates = await getBioTemplates();
  console.log("Templates:", templates);
}

test();
