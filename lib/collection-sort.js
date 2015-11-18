'use strict';

var typify = require('./helpers/typify');

/**
 * Sets what attribute to sort on and the order and then sorts
 *
 * @param {String} property The name of a model attribute to sort on
 * @param {String} [order] What order to take on -> asc|desc
 *
 * Default sort order is 'asc'. If called on the same property twice,
 * the order gets reversed
 */
var updateOrder = function(property, order) {
  if(typeof property === 'undefined') {
    throw new TypeError('missing argument <property>');
  }

  if(this.sortAttribute === property) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortAttribute = property;
    this.sortDirection = 'asc';
  }

  if(order) { this.sortDirection = order; }
  this.sort();
};

/**
 * Returns the sort order and what colum/property
 * the collections is currently sorted on
 *
 * @returns {String} asc|desc
 */
var getSortState = function() {
  return {
    direction: this.sortDirection,
    attribute: this.sortAttribute
  };
};

var objectOfSameType = function(context, blueprint) {
    var type = Object.prototype.toString.call(blueprint).split(' ')[1];
    type = type.slice(0, type.length - 1);
    return  global[type]();
};

var comparator = function(a, b) {
  a = a.get(this.sortAttribute);
  b = b.get(this.sortAttribute);

  if(typeof a === 'string') {
    a = a.toLowerCase();
  }

  if(typeof b === 'string') {
    b = b.toLowerCase();
  }

  if (a === b) { return 0; }

  if(a === undefined || a === null) { a = objectOfSameType(this, b); }
  if(b === undefined || b === null) { b = objectOfSameType(this, a); }

  if (this.sortDirection === 'asc') {
    return a > b ? 1 : -1;
  } else {
    return a < b ? 1 : -1;
  }
};

module.exports = {
  updateOrder: updateOrder,
  getSortState: getSortState,
  comparator: comparator,
};


