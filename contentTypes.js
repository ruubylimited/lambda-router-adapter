var textContentTypePrefixes = [
  'application/xml',
  'application/javascript',
  'text/'
]

module.exports.isText = function(contentType) {
  return textContentTypePrefixes.some(function(textContentTypePrefix) {
    return contentType.indexOf(textContentTypePrefix) === 0;
  })
}

module.exports.isJson = function(contentType) {
  return contentType.indexOf('application/json') === 0;
}