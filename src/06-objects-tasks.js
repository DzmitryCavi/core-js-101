/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}
Rectangle.prototype.getArea = function () {
  return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  idCheck: false,
  pseudoElementCheck: false,
  weight: [
    'element',
    'id ',
    'class',
    'attribute',
    'pseudo-class',
    'pseudo-element',
  ],
  order: [],
  combo: [],
  build: [],
  stringify() {
    const result = this.build.join('');
    this.clear();
    return result;
  },
  element(value) {
    if (this.build.length > 0) {
      if (this.build.length < 2) {
        this.error(
          'Element, id and pseudo-element should not occur more then one time inside the selector',
        );
      }
      this.combo.push(this.build.join(''));
      this.build = [];
      this.idCheck = false;
      this.pseudoElementCheck = false;
      this.order = [];
    }
    this.inOrder(this.weight[0]);
    this.build.push(value);
    return this;
  },

  id(value) {
    if (this.idCheck) {
      this.error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.idCheck = true;
    this.inOrder(this.weight[1]);
    this.build.push(`#${value}`);
    return this;
  },

  class(value) {
    this.inOrder(this.weight[2]);
    this.build.push(`.${value}`);
    return this;
  },

  attr(value) {
    this.inOrder(this.weight[3]);
    this.build.push(`[${value}]`);
    return this;
  },

  pseudoClass(value) {
    this.inOrder(this.weight[4]);
    this.build.push(`:${value}`);
    return this;
  },

  pseudoElement(value) {
    if (this.pseudoElementCheck) {
      this.error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.pseudoElementCheck = true;
    this.inOrder(this.weight[5]);
    this.build.push(`::${value}`);
    return this;
  },

  combine(selector1, combinator, selector2) {
    const resultLeft = selector2.combo.pop();
    const resultRight = [...selector1.build].join('');
    this.build = [];
    this.build.push(`${resultLeft} ${combinator} ${resultRight}`);
    return this;
  },
  error(msg) {
    this.clear();
    throw new Error(msg);
  },
  clear() {
    this.combo = [];
    this.order = [];
    this.build = [];
    this.idCheck = false;
    this.pseudoElementCheck = false;
  },
  inOrder(el) {
    const pos = this.weight.indexOf(el);
    if (this.order[this.order.length - 1] > pos) {
      this.error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    } else {
      this.order.push(pos);
    }
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
