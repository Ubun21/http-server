module.exports.setHeader = (headers, key, value) => {
  const filter = headers.filter((item) => {
    return item.headName === key
  })

  if(filter && filter[0]) {
    headers[filter[0].headName] = value
  }

  headers.push({headName: key, headVal: value})
  return true
}

module.exports.getHeader = (headers, key) => {
  const filterdHeaders = headers.filter(
    item => item.headName === key
  );

  if (
    filterdHeaders &&
    filterdHeaders[0] &&
    typeof filterdHeaders[0].headVal === 'string'
  ) {
    return filterdHeaders[0].headVal.trim();
  }

  return null;
}