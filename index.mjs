import BaseElement from '@enhance/base-element'
import TemplateMixin from '@enhance/template-mixin'
import ShadowElementMixin from '@enhance/shadow-element-mixin'

export default class ShadowElement extends ShadowElementMixin(TemplateMixin(BaseElement)) {}
