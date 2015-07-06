import Ember from 'ember';
import layout from '../templates/components/error-field';
import toWords from '../utils/to-words';

const { computed, on } = Ember;

export default Ember.Component.extend({
  shouldShowError: false,
  bindingForErrors: null,
  className: 'error',
  classNameBindings: ['className', 'visible'],
  errors: null,
  label: computed.oneWay('property'),
  layout: layout,
  property: null,
  tagName: 'span',
  visible: computed.and('shouldShowError', 'errors.length'),

  formController: computed(function() {
    const hasFormController = this.nearestWithProperty('formController');

    return hasFormController.get('formController');
  }),

  text: computed('error', 'property', function() {
    const { error, property } = this.getProperties(
      [ 'error', 'property' ]
    );
    const humanizedProperty = toWords(property);

    return `${humanizedProperty} ${error}`;
  }),

  addBindingForErrors: on('didInitAttrs', function() {
    const property = this.get('property');

    Ember.assert('You must set a property attribute on the {{error-field}} component', property);

    const formController = this.get('formController');
    const validations = formController.get('validations');
    const validationsForProperty = !!validations[property];

    if (validationsForProperty && !this.get('bindingForErrors')) {
      const errorPath = `formController.errors.${property}`;
      const binding = Ember.bind(this, 'errors', errorPath);

      this.set('bindingForErrors', binding);
    }
  }),

  removeBindingForErrors: Ember.on('willDestroyElement', function() {
    const bindingForErrors = this.get('bindingForErrors');

    if (bindingForErrors) {
      bindingForErrors.disconnect(this);
    }
  }),
});
