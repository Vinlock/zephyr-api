const getDuplicateKeyIndex = (err) => {
  const regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i;
  const match =  err.message.match(regex);
  return match[1] || match[2];
};

module.exports = getDuplicateKeyIndex;
