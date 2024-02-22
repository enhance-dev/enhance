import BaseElement from '@enhance/base-element'
import CustomElementMixin from '@enhance/custom-element-mixin'
import TemplateMixin from '@enhance/template-mixin'

export default class CustomElement extends CustomElementMixin(TemplateMixin(BaseElement)) {}
