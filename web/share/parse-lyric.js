const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by',
}

export default function parseLyirc (lrc) {
  return {
    tags: parseTag(lrc),
    lines: parseLines(lrc),
  }
}

function parseTag (lrc) {
  const tags = {}
  for (let tag in tagRegMap) {
    const matches = lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
    tags[tag] = matches && matches[1] || ''
  }
  return tags
}

function parseLines (lrc) {
  const resLines = []
  const lines = lrc.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let result = timeExp.exec(line)
    if (result) {
      resLines.push({
        txt: line.replace(timeExp, '').trim(),
        time: result[1] * 60 * 1000 + result[2] * 1000 + Number((result[3] || 0)),
      })
    }
  }

  resLines.sort((a, b) => a.time - b.time)
  return resLines
}