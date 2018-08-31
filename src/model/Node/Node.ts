import { NODE_BG_COLOR, NODE_BORDER_COLOR } from './../../constant/color'
import Rect from "../../../../Draw/src/model/shape/Rect"
import DomText from "../../../../Draw/src/model/DomElement/DomText"
import DrawText from "../../../../Draw/src/model/text/DrawText"
import DrawImage from "../../../../Draw/src/model/image/DrawImage"
import { notNil, isNil } from "../../../../Draw/src/util/lodash/index"
import Segment from "../../../../Draw/src/model/Segment"
import NodeRightLinking from "./Nodelinking/NodeRightLinking"
import { NODE, DATA_SANDBOXIE } from '../../constant/name'
import Operation from "../Operation/Operation"
import { DATA_NODE, RESULT_NODE } from "../../constant/type"
import { BACKGROUND_COLOR } from '../../constant/color'
import Getters from '../../state/Getters'

export default class Node extends Rect {
  data: any = {}

  src: string
  image: DrawImage

  rightLinking: NodeRightLinking

  titleText: DrawText

  selectedFillColor: string = NODE_BG_COLOR
  selectedStrokeColor: string = NODE_BORDER_COLOR

  static DEFAULT_WIDTH = 70
  static DEFAULT_HEIGHT = 70

  static IMAGE_WIDTH = 50
  static IMAGE_HEIGHT = 50

  static TITLE_TEXT_COLOR: string = "#8196AC"
  static TITLE_TEXT_MARGIN_TOP: number = 8


  constructor( props: any ) {
    super( setPropsDangerously( props ) 
  
    )
    const { IMAGE_WIDTH, IMAGE_HEIGHT } = Node
    const { TITLE_TEXT_COLOR, TITLE_TEXT_MARGIN_TOP } = Node
    const { DEFAULT_FONT_SIZE } = DrawText


    this.width = notNil( props.width ) ? props.width : this.width
    this.height = notNil( props.height ) ? props.height : this.height
    this.data = notNil( props.data ) ? props.data : this.data

    const { src, name = "Data Node" } = this.data

    const { x, y } = props

    if ( notNil( x ) && notNil( y ) ) {
      this.left = x - this.width / 2
      this.top = y - this.height / 2
    } else {
      this.left = notNil( props.left ) ? props.left : this.left
      this.top = notNil( props.top ) ? props.top : this.top
    }

    const { left, top, width, height } = this
    const { right, bottom } = this.bounds
    const { x: cx, y: cy } = this.itemCenter


    this.src = notNil( props.src ) ? props.src : this.src

    if ( notNil( src ) ) {
      this.src = src
    }

    this.image = new DrawImage( {
      draw     : this.draw,
      draggable: false,
      src      : this.src,
      x        : cx,
      y        : cy,
      width    : IMAGE_WIDTH,
    } )

    // this.image.interfaceOnImageLoaded = (() => {
    //   const { width, height } = this.image
    //   this.updateWidth( width )
    //   this.updateHeight( height )
    // }).bind( this )

    this.titleText = new DrawText( {
      draw     : this.draw,
      draggable: false,
      x        : cx,
      y        : bottom + DEFAULT_FONT_SIZE / 2 + TITLE_TEXT_MARGIN_TOP,
      text     : name,
      fillColor: TITLE_TEXT_COLOR
    } )

    this.rightLinking = new NodeRightLinking( { draw: this.draw, path: this } )

    
    function setPropsDangerously( props ) {
      const { width, height } = props
      props.width = notNil( width ) ? width : Node.DEFAULT_WIDTH
      props.height = notNil( height ) ? height : Node.DEFAULT_HEIGHT

      props.sizable = false
      props.fillColor = null
      props.shouldRenderInMiniMap = true
      return props
    }
  }

  get identityClass(): string {
    return NODE
  }

  get operation(): Operation {
    try {
      return this.rightLinking.operationLink.operation
    } catch ( e ) {}
    return null
  }

  get isDataNode(): boolean {
    return this.type === DATA_NODE
  }

  get isResultNode(): boolean {
    return this.type === RESULT_NODE
  }
  
  get shadePath2d(): Path2D {
    let path = new Path2D()
    let { width, height, left, top } = this
    left = left - 1
    top = top - 1
    width = width + 2
    height = height + 2
    path.rect( left, top, width, height )
    return path
  }

  get isSingleNode(): boolean {
    return isNil( this.operation ) 
  }

  updateData( data: any ) {
    this.data = data

    const { src, name } = this.data
    notNil( src ) && this.image.udpateSrc( src )
    notNil( name ) && this.titleText.updateText( name )
  }

  handleMouseIn() {
    this.strokeColor = "#293240"
  }

  handleMouseOut() {
    this.strokeColor = null
  }

  updateDrag( event, dragger ) {
    const point: Point2DInitial = this.getters.getInitialPoint( event )

    const dx = dragger.getDeltaXToPrevPoint( point )
    const dy = dragger.getDeltaYToPrevPoint( point )

    this.translate( dx, dy )
  }

  bindDrag() {
    this.image.dragger.interfaceDragging = this.updateDrag.bind( this )
    this.rightLinking.dragger.handleDragging = this.updateDrag.bind( this )

    this.titleText.dragger.interfaceDragging = this.updateDrag.bind( this )
  }

  translate( dx: number, dy: number ) {
    super.translate( dx, dy )
    this.image.translate( dx, dy )

    this.rightLinking.translate( dx, dy )
    this.titleText.translate( dx, dy )
  }

  translateCenterToPoint( center: Point2D ) {
    const { x: cx, y: cy } = this.itemCenter
    const { x, y } = center
    const dx = x - cx
    const dy = y - cy
    this.translate( dx, dy )
  }

  select() {
    this.rightLinking.select()
    super.select()
  }

  render() {
    const { ctx } = this.getters
    const { strokeColor, shouldSelect, selectedFillColor, selectedStrokeColor, path2d } = this

    if ( notNil( strokeColor ) ) {
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 1
      ctx.stroke( path2d )
    }

    if ( shouldSelect ) {
      ctx.fillStyle = selectedFillColor
      ctx.fill( path2d )

      ctx.lineWidth = 1
      ctx.strokeStyle = selectedStrokeColor
      ctx.stroke( path2d )
    }
    
    if ( ! shouldSelect ) {
      // ctx.fillStyle = BACKGROUND_COLOR
      // ctx.fill( path2d )
    }
  }

  remove() {
    this.image && this.image.remove()
    this.rightLinking && this.rightLinking.remove()
    this.titleText && this.titleText.remove()
    super.remove()
  }
}
