const winston = require('winston')
const fs = require('fs')
const BAK_FILE_PATH = 'store/editor/text.bak.txt'

const storeInFs = (text) => {
  fs.writeFile(BAK_FILE_PATH, text, (err) => {
    if (err) throw err
    winston.info(`Stored text to file: [${text}]`)
  });
}

const readFs = () => {
  return fs.readFileSync(BAK_FILE_PATH, 'utf8')
}

module.exports = {
  getText: () => readFs(),
  setText: (text) => {
    storeInFs(text)
  },
}