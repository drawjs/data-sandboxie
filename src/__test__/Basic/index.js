const canvas = document.getElementById( "canvas" )
const { width, height } = document.body.getBoundingClientRect()
canvas.width = width
canvas.height = height

const button1 = document.getElementById( "button1" )
const button2 = document.getElementById( "button2" )
const button3 = document.getElementById( "button3" )
const button4 = document.getElementById( "button4" )
const zoomIn = document.getElementById( "zoomIn" )
const zoomOut = document.getElementById( "zoomOut" )




const ds = new Ds( canvas, setting )

const { formatter } = ds.store

function create( d = 0 ) {
  const data1 = ds.createDataNode( {
    left: d + 100,
    top : d + 200,
  } )

  const data2 = ds.createDataNode( {
    left: d + 100,
    top : d + 600,
  } )

  const data3 = ds.createDataNode( {
    left: d + 100,
    top : d + 800,
  } )
  const operation1 = ds.createIntersectOperation( {
    nodes: [ data1, data2, data3 ]
  } )

  const resultNode1 = operation1.createResultNode()

  // -----------

//   const data4 = ds.createDataNode( {
//     left: d + 500,
//     top : d + 100
//   } )

//   const data5 = ds.createDataNode( {
//     left: d + 500,
//     top : d + 2000
//   } )

//   // -----------
//   const data6 = ds.createDataNode( {
//     left: d + 100,
//     top : d + 1100
//   } )

//   const data7 = ds.createDataNode( {
//     left: d + 100,
//     top : d + 1300
//   } )

//   const operation3 = ds.createIntersectOperation( {
//     nodes: [ data6, data7 ]
//   } )

//   const resultNode3 = operation3.createResultNode()

//   // ----------
//   const operation2 = ds.createIntersectOperation( {
//     nodes: [ resultNode1, data4, data5, resultNode3 ]
//   } )

//   const resultNode2 = operation2.createResultNode()

//   // -----------

//   const data8 = ds.createDataNode( {
//     left: d + 50,
//     top : d + 1500
//   } )

//   const operation4 = ds.createIntersectOperation( {
//     nodes: [ data8 ]
//   } )

//   // -----------

//   const data9 = ds.createDataNode( {
//     left: d + 50,
//     top : d + 1900
//   } )

//   const data10 = ds.createDataNode( {
//     left: d + 50,
//     top : d + 2000
//   } )
// }

// const data1 = ds.createDataNode( {
//   x: 100,
//   y: 100
// } )

// create()
// create(500)
// create(1500)
// create(2500)

// console.log( ds.store.formatter.flows )

ds.render()

// ds.store.formatter.format()
// ds.render()

button1.onclick = () => {
  formatter.format()
  formatter.centerLayout()
  ds.render()
}

button2.onclick = () => {
  formatter.formatHorizontal()
  ds.render()
}

button3.onclick = () => {
  formatter.formatVertical()
  ds.render()
}

dragToGenerateDataNode( document.getElementById( "sourceDataNode" ), e => {
  let { x, y } = e
  const { canvasLeft, canvasTop } = ds.getters
  x = x - canvasLeft
  y = y - canvasTop
  const initialPoint = ds.getters.viewPort.transformToInitial( {
    x,
    y
  } )
  const data = ds.createDataNode( {
    ...initialPoint
  } )
  ds.render()
} )

button4.onclick = () => {
  ds.actions.GENERATE_INTERSECT_OPERATION_WITH_SELECTED_NODES()
  ds.render()
}

zoomIn.onclick = () => {
  ds.getters.viewPort.zoomIn()
}
zoomOut.onclick = () => {
  ds.getters.viewPort.zoomOut()
}

function dragToGenerateDataNode( dom, generateFn ) {
  let enable = false
  let moved = false
  let prevEvent
  let tmpDom

  document.addEventListener( "mousedown", mousedownListener )
  document.addEventListener( "mousemove", mousemoveListener )
  document.addEventListener( "mouseup", mouseupListener )

  function mousedownListener( e ) {
    e.preventDefault()

    if ( isTarget( e.target ) ) {
      enable = true
      const { left, top, width, height } = dom.getBoundingClientRect()

      if ( !tmpDom ) {
        tmpDom = document.createElement( "div" )
        tmpDom.style.position = "absolute"
        tmpDom.style.zIndex = "10"
        tmpDom.style.width = `${width}px`
        tmpDom.style.height = `${height}px`
        tmpDom.style.display = "none"
        document.body.appendChild( tmpDom )
      }

      if ( tmpDom ) {
        let { x, y } = e
        const { canvasLeft, canvasTop } = ds.getters
        x = x - canvasLeft
        y = y - canvasTop

        tmpDom.style.left = `${x - width / 2}px`
        tmpDom.style.top = `${y - height / 2}px`
        tmpDom.style.border = "1px solid grey"
      }

      prevEvent = e
    }
  }

  function mousemoveListener( e ) {
    if ( enable ) {
      const { display } = tmpDom.style
      if ( !display || display === "none" ) {
        tmpDom.style.display = `block`
      }

      const dx = e.x - prevEvent.x
      const dy = e.y - prevEvent.y

      const { left, top } = tmpDom.getBoundingClientRect()

      tmpDom.style.left = `${left + dx}px`
      tmpDom.style.top = `${top + dy}px`

      prevEvent = e
      moved = true
    }
  }

  function mouseupListener( e ) {
    if ( enable && moved ) {
      generateFn && generateFn( e )

      enable = false
      moved = false
      tmpDom.style.display = `none`
    }
  }

  function isTarget( theDom ) {
    return theDom === dom
  }
}
}