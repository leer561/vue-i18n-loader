const minimist = require('minimist')
let args = minimist(process.argv.slice(2))
let en = args.EN || (args.env && args.env.EN)
let workStatus = en ? 'EN' : 'CN'
export default function (content) {
	if (this.version && this.version >= 2) {
		try {
			this.cacheable && this.cacheable()
			this.callback(null, `module.exports = ${generateCode(content)}`)
		} catch (err) {
			this.emitError(err.message)
			this.callback(err)
		}
	} else {
		const message = 'support webpack 2 later'
		this.emitError(message)
		this.callback(new Error(message))
	}
}

function generateCode(content) {
	let code = ''
	let value = typeof content === 'string'
		? JSON.parse(content)
		: content
	value = value[workStatus]
	value = JSON.stringify(value)
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029')
		.replace(/\\/g, '\\\\')

	code += `function (Component) {
  Component.options.__i18n = Component.options.__i18n || []
  Component.options.__i18n.push('${value.replace(/\u0027/g, '\\u0027')}')
}\n`
	return code
}
