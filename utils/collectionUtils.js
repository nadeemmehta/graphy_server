/**
 * Generic helpers for filtering arrays of objects by field value.
 * Both GraphQL resolvers (getCity, getCities) previously duplicated the
 * same `collection.filter(item => item[field] === value)` pattern —
 * these utilities replace that duplication.
 */

function filterByField(collection, field, value) {
  return collection.filter(item => item[field] === value);
}

function findOneByField(collection, field, value) {
  return collection.find(item => item[field] === value);
}

module.exports = { filterByField, findOneByField };
