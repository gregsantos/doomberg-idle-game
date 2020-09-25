import { terminal } from './terminal.js'

// Banner text
const banner = `
Initializing Doomberg Terminal v0.1
Copyright (c) 2020 Ben Dunn Industries

.............................................................................

@@@  @@@  @@@  @@@@@@@@  @@@        @@@@@@@   @@@@@@   @@@@@@@@@@   @@@@@@@@
@@@  @@@  @@@  @@@@@@@@  @@@      @@@@@@@@  @@@@@@@@  @@@@@@@@@@@  @@@@@@@@
@@!  @@!  @@!  @@!       @@!       !@@       @@!  @@@  @@! @@! @@!  @@!     
!@!  !@!  !@!  !@!       !@!       !@!       !@!  @!@  !@! !@! !@!  !@!     
@!!  !!@  @!@  @!!!:!    @!!       !@!       @!@  !@!  @!! !!@ @!@  @!!!:!  
!@!  !!!  !@!  !!!!!:    !!!       !!!       !@!  !!!  !@!   ! !@!  !!!!!:  
!!:  !!:  !!:  !!:       !!:       :!!       !!:  !!!  !!:     !!:  !!:     
:!:  :!:  :!:  :!:        :!:      :!:       :!:  !:!  :!:     :!:  :!:     
 :::: :: :::    :: ::::   :: ::::   ::: :::  ::::: ::  :::     ::    :: ::::
  :: :  : :    : :: ::   : :: : :   :: :: :   : :  :    :      :    : :: :: 

-----------------------------------------------------------------------------
Hello Greg...
Shall we play a game?
-----------------------------------------------------------------------------



Type 'help for a list of available commands.


`

// Help text
const helpText = `
Available commands:

help - This output
contact - Prints contact information
contact <key> - Opens up relevant contact link
clear - Clears the display
ls - Lists files
pwd - Lists current directory
cd <dir> - Enters directory
cat <filename> - Lists file contents
`

const contactInfo = {
  email: '',
  twitter: '',
}

const contactList = Object.keys(contactInfo)
  .reduce((result, key) => result.concat([`${key} - ${contactInfo[key]}`]), [])
  .join('\n')

const contactText = `
Created by Greg Santos

${contactList}

Use ex. 'contact twitter' to open the links.
`

const openContact = (key) =>
  window.open(key === 'email' ? `mailto:${contactInfo[key]}` : contactInfo[key])

// File browser
const browser = (function () {
  let current = '/'

  let tree = [
    {
      location: '/',
      filename: 'documents',
      type: 'directory',
    },
    {
      location: '/',
      filename: 'AUTHOR',
      type: 'file',
      content: 'Greg Santos <gregsantos@gmail.com>',
    },
  ]

  const fix = (str) => str.trim().replace(/\/+/g, '/') || '/'

  const setCurrent = (dir) => {
    if (typeof dir !== 'undefined') {
      if (dir == '..') {
        const parts = current.split('/')
        parts.pop()
        current = fix(parts.join('/'))
      } else {
        const found = tree
          .filter((iter) => iter.location === current)
          .find((iter) => iter.filename === fix(dir))

        if (found) {
          current = fix(current + '/' + dir)
        } else {
          return `Directory '${dir}' not found in '${current}'`
        }
      }

      return `Entered '${current}'`
    }

    return current
  }

  const ls = () => {
    const found = tree.filter((iter) => iter.location === current)
    const fileCount = found.filter((iter) => iter.type === 'file').length
    const directoryCount = found.filter((iter) => iter.type === 'directory')
      .length
    const status = `${fileCount} file(s), ${directoryCount} dir(s)`
    const maxlen = Math.max(
      ...found.map((iter) => iter.filename).map((n) => n.length)
    )

    const list = found
      .map((iter) => {
        return `${iter.filename.padEnd(maxlen + 1, ' ')} <${iter.type}>`
      })
      .join('\n')

    return `${list}\n\n${status} in ${current}`
  }

  const cat = (filename) => {
    const found = tree.filter((iter) => iter.location === current)
    const foundFile = found.find((iter) => iter.filename === filename)

    if (foundFile) {
      return foundFile.content
    }

    return `File '${filename}' not found in '${current}'`
  }

  return {
    cwd: () => setCurrent(),
    cd: (dir) => setCurrent(fix(dir)),
    cat,
    ls,
  }
})()

///////////////////////////////////////////////////////////////////////////////
// MAIN
///////////////////////////////////////////////////////////////////////////////

export default () => {
  const t = terminal({
    prompt: () => `$ ${browser.cwd()} > `,
    banner,
    commands: {
      help: () => helpText,
      cwd: () => browser.cwd(),
      cd: (dir) => browser.cd(dir),
      ls: () => browser.ls(),
      cat: (file) => browser.cat(file),
      clear: () => t.clear(),
      contact: (key) => {
        if (key in contactInfo) {
          openContact(key)
          return `Opening ${key} - ${contactInfo[key]}`
        }

        return contactText
      },
    },
  })
}
