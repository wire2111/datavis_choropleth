export async function getData(URL) {
  return await fetch(URL)
    .then(response => response.json())
    .then(console.log("retrieved: ", URL))
    .then(data => data);
}