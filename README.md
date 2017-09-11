# freeCodeCamp Backend Challenge - Image Search Abstraction API

### Request per search term:
`/search/<your search term>`

You get an array of 10 results:
```javascript
  {
    results: [
      {
        alt: "sample name",
        imageUrl: "http://url.com/to/image.jpeg",
        pageUrl: "http://url.com/to/page"
      }
    ],
    ...
  }
```
 ### You can also paginate through the results using:
 `/search/<term>?offset=<offset>`

 ### Get the latest search terms requested by users:
 `/latest`
