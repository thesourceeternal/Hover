testFrames = {}
setupTests()

function setupTests() {

  var roomId = '1010101010101010'

  var container = document.body
  container.style.height = '100%'
  container.style.margin = '0px'

  var left = createFrame( './#'+roomId )
  left.id = 'test-frame-left'
  left.style.left = '0px'
  left.onload = reportReady.bind(null, 'left', left)

  var right = createFrame( './?server#'+roomId )
  right.id = 'test-frame-right'
  right.style.right = '0px'
  right.onload = reportReady.bind(null, 'right', right)
  
}

function createFrame( srcUrl ) {

  var frame = document.createElement('iframe')
  frame.src = srcUrl
  frame.style.border = 'none'
  frame.style.float = 'left'
  frame.style.height = '100%'
  frame.style.width = '50%'
  document.body.appendChild( frame )
  return frame

}

function reportReady( panelName, panel ) {

  testFrames[ panelName ] = panel.contentWindow

  if ( testFrames['left'] && testFrames['right'] ) {
    startTests()
  }

}

function startTests() {

  console.log('ready to test',testFrames)

}