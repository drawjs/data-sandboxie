import { OPERATION_BG_COLOR, OPERATION_SELECTED_BG_COLOR } from './../../constant/color'
import { notNil, isNil } from "../../../../Draw/src/util/lodash/index"
import DrawImage from "../../../../Draw/src/model/image/DrawImage"
import Rect from "../../../../Draw/src/model/shape/Rect"
import Node from "../Node/Node"
import Cell from "../../../../Draw/src/model/Cell"
import getPointsBoundsCenter from "../../../../Draw/src/util/geometry/getPointsBoundsCenter"
import { firstElement } from "../../../../Draw/src/util/js/array"
import DrawText from "../../../../Draw/src/model/text/DrawText"
import OperationLink from "../Link/OperationLink/OperationLink"
import ResultNode from "../Node/ResultNode/ResultNode"
import ResultLink from "../Link/ResultLink/ResultLink"
import RightLinking from "../Linking/RightLinking"
import { OPERATION } from "../../constant/name"
import Flow from "../Tool/Formatter/Flow"
import Circle from "../../../../Draw/src/model/shape/Circle"
import OperationCenterLinking from "./OperationLinking/OperationCenterLinking"
import { OPERATION_BORDER_COLOR, OPERATION_SELECTED_BORDER_COLOR } from '../../constant/color'
import Ds from '../../index'

const { PI } = Math

export default class Operation extends Circle {
  type: string = OPERATION

  operationType: string = null

  data: any = null

  src: string
  image: DrawImage

  // titleText: DrawText

  operationLink: OperationLink

  nodes: Node[] = []

  resultNode: ResultNode

  resultLink: ResultLink

  centerLinking: OperationCenterLinking
  rightLinking: RightLinking

  static DEFAULT_RADIUS = 20
  static HOVERING_RADIUS = 23

  static DEFAULT_ICON_WIDTH = 24
  static DEFAULT_ICON_HEIGHT = 24

  hovering: boolean = false
  // selctedBackgroundRadius: number = 25

  renderFnInMiniMap: Function = () => {
    // const { ctx } = this.getters
    // ctx.fillStyle = "skyBlue"
    // this.path2d && ctx.fill( this.path2d )
  }

  constructor( props: { src: string; nodes: Node[], data: any, operationType: string } ) {
    super( setPropsDangerously( props ) )

    const { nodes } = props
    const { DEFAULT_ICON_WIDTH, DEFAULT_ICON_HEIGHT } = Operation

    this.src = notNil( props.src ) ? props.src : this.src
    this.nodes = notNil( nodes ) ? nodes : this.nodes
    this.operationType = notNil( props.operationType ) ? props.operationType : this.operationType
    this.data = notNil( props.data ) ? props.data : this.data

    const { x, y } = this

    this.image = new DrawImage( {
      draw     : this.draw,
      draggable: false,
      src      : this.src,
      x,
      y,
      width    : DEFAULT_ICON_WIDTH
      //  height: DEFAULT_ICON_HEIGHT ,
    } )
    // this.titleText = new DrawText( { draw: this.draw, draggable: false, x: cx, y: top + 45, text: '相交', fillColor: 'white' } )

    this.centerLinking = new OperationCenterLinking( {
      draw: this.draw,
      path: this
    } )
    this.rightLinking = new RightLinking( { draw: this.draw, path: this } )

    this.operationLink = new OperationLink( { draw: this.draw, operation: this } )

    function setPropsDangerously( props ) {
      const { DEFAULT_RADIUS } = Operation
      const { DATA_TO_OPERATION_CENTER } = Flow

      let { nodes = [], radius } = props

      radius = notNil( radius ) ? radius : DEFAULT_RADIUS

      const firstNode: Node = firstElement( nodes )
      const points = nodes.map( ( { segmentsCenter }: Node ) => segmentsCenter )
      const center = getPointsBoundsCenter( points )
      const { y: cy } = center
      const x =
        DATA_TO_OPERATION_CENTER +
        ( notNil( firstNode ) ? firstNode.bounds.right : 0 )

      props.radius = radius
      props.x = x
      props.y = cy

      props.sizable = false
      props.fillColor = OPERATION_BG_COLOR
      props.strokeColor = OPERATION_BORDER_COLOR
      // props.shouldRenderInMiniMap = true

      return props
    }
  }

  get identityClass(): string {
    return OPERATION
  }

  // get backgroundPath2d(): Path2D {
  //   let path = new Path2D()
  //   const { x, y, selctedBackgroundRadius } = this
  //   path.arc( x, y, selctedBackgroundRadius, 0, 2 * PI )
  //   return path
  // }

  updateData( data: any ) {
    this.data = data
  }

  createResultNode( props = {} ) {
    const ds = <Ds>this.draw
    if ( isNil( this.resultNode ) ) {
      const { cy } = this
      const { right } = this.bounds
      this.resultNode = ds.createResultNode( {
        draw           : this.draw,
        x              : right + Node.DEFAULT_WIDTH / 2 + ResultNode.MARGIN,
        y              : cy,
        sourceOperation: this,
        ...props
      } )
      this.resultLink = new ResultLink( {
        draw      : this.draw,
        operation : this,
        resultNode: this.resultNode
      } )
      return this.resultNode
    }
  }

  connectToResultNode( resultNode ) {
    if ( isNil( this.resultNode ) && notNil( resultNode ) ) {
      this.resultNode = resultNode
      resultNode.setSourceOperation( this )

      this.resultLink = new ResultLink( {
        draw      : this.draw,
        operation : this,
        resultNode: this.resultNode
      } )
      
      return resultNode
    }
  }

  removeResultNode( ) {
    this.resultNode && this.resultNode.remove()
    this.resultLink && this.resultLink.remove()
    this.resultNode = null
    this.resultLink = null
  }

  regenerateResultNode( props = {} ) {
    this.removeResultNode()
    return this.createResultNode( props )      
  }

  handleMouseIn() {
    const { HOVERING_RADIUS, DEFAULT_RADIUS } = Operation
    this.hovering = true

    const rate = HOVERING_RADIUS / DEFAULT_RADIUS
    this.size( rate, rate, this.itemCenter )
    this.image.sizeOnCenter( rate, rate )
  }

  handleMouseOut() {
    this.hovering = true
    this.size( 1, 1, this.itemCenter )
    this.image.sizeOnCenter( 1, 1 )
  }

  updateDrag( event, dragger ) {
    const point: Point2DInitial = this.getters.getInitialPoint( event )

    const dx = dragger.getDeltaXToPrevPoint( point )
    const dy = dragger.getDeltaYToPrevPoint( point )

    this.translate( dx, dy )
  }

  bindDrag() {
    this.image.dragger.interfaceDragging = this.updateDrag.bind( this )
    // this.titleText.dragger.interfaceDragging = this.updateDrag.bind( this )

    this.centerLinking.dragger.handleDragging = this.updateDrag.bind( this )
    this.rightLinking.dragger.interfaceDragging = this.updateDrag.bind( this )
  }

  translate( dx: number, dy: number ) {
    super.translate( dx, dy )

    this.image.translate( dx, dy )
    // this.titleText.translate( dx, dy )

    this.centerLinking.translate( dx, dy )
    this.rightLinking.translate( dx, dy )
  }

  translateCenterToPoint( center: Point2D ) {
    const { x: cx, y: cy } = this.itemCenter
    const { x, y } = center
    const dx = x - cx
    const dy = y - cy
    this.translate( dx, dy )
  }

  render() {
    const { ctx } = this.getters
    const {
      fillColor,
      strokeColor,
      shouldSelect,
      path2d,
      // backgroundPath2d,
      hovering
    } = this

    if ( shouldSelect ) {
      ctx.fillStyle = OPERATION_SELECTED_BG_COLOR
      ctx.fill( path2d )

      ctx.lineWidth = 6
      ctx.strokeStyle = OPERATION_SELECTED_BORDER_COLOR
      ctx.stroke( path2d )
    }

    if ( ! shouldSelect ) {
      ctx.fillStyle = fillColor
      ctx.fill( path2d )

      ctx.lineWidth = 1
      ctx.strokeStyle = strokeColor
      ctx.stroke( path2d )
    }

    
  }

  remove() {
    this.operationLink.resetOperation()

    this.actions.REMOVE_ELEMENTS( [
      this.image,
      this.operationLink,
      this.centerLinking,
      this.resultNode,
      this.resultLink,
      this.rightLinking,
    ] )
    super.remove()
  }
}

