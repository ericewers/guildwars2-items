const fetch = require('node-fetch');
const fs = require('fs');

var itemLookup = JSON.parse('[]');

if (!itemLookup.length) {
  fetchItems(0).then(pageCount => {
      var pages = '_'.repeat(pageCount - 1).split('').map((x, i) => i + 1);
      return runParallel(fetchItems, pages, 5)
  })
  .then(done => {
    fs.writeFileSync('items.json', JSON.stringify(itemLookup));
  })
  .catch(console.log.bind(console));
}

function runParallel (func, args, jobCount) { 
  var sentinel = Symbol('sentinel');
  function worker () {
    if (!args.length) {
      return Promise.resolve(sentinel);
    }
    return func(args.shift()).then(worker);
  }
  var workers = [];
  for (var i = 0; i < jobCount; i++) {
    workers.push(worker());
  }
  return Promise.all(workers).then(results => results.every(result => result === sentinel));
}

function fetchItems (page) {
  if (page === true) {
    Promise.resolve(true);
  }

  return fetch('https://api.guildwars2.com/v2/items?lang=en&page_size=200&page=' + page)
    .then(result => {
      if (result.ok) {
        return result.json().then(items => {
          if (items.text) {
            return Promise.resolve(true);
          }
          items.forEach(({id, rarity, icon, name, level, type, details, flags, description}) => itemLookup.push({ id, rarity, icon, name, level, type, details: details ? details.type : '', flags, description: description ? description : '' }));
          //items.forEach(({id, name}) => itemLookup.push({ id, name }));
          return parseInt(result.headers.get('X-Page-Total') || '0');
        });
      }
      else {
        return Promise.resolve(true);
      }
    });
}