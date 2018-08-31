import Operation from "../../Operation/Operation"
import ResultNode from "../../Node/ResultNode/ResultNode"
import Node from "../../Node/Node"
import Cell from "../../../../../Draw/src/model/Cell"
import getRectPoints from "../../../../../Draw/src/util/getRectPoints"
import connectPolygonPoints from "../../../../../Draw/src/util/canvas/connectPolygonPoints"
import {
  notFirst,
  prevElement,
  lastElement,
  firstElement
} from "../../../../../Draw/src/util/js/array"
import getPointsCenter from "../../../../../Draw/src/util/geometry/getPointsCenter"
import OperationLink from "../../Link/OperationLink/OperationLink"
import Path from "../../../../../Draw/src/model/Path"
import { getBoundsPath } from "../../../../../Draw/src/drawUtil/bounds"
import { FLOW } from "../../../constant/type"
import { notNil } from "../../../../../Draw/src/util/lodash/index"
import { getDistanceFromNodesBoundsToOperationCenter } from "../../../dsUtil/formatter"

const { min, max, abs } = Math

export default class Flow extends Cell {
  type: string = FLOW
  data: Node[]
  operation: Operation
  result: ResultNode
  resultFlow: Flow

  static DATA_ELEMENT_INTERVAL = 100
  static DATA_TO_OPERATION_CENTER = 100
  static OPERATION_CENTER_TO_RESULT = 200

  constructor( props, operation: Operation ) {
    super( props )
    const { nodes: data, resultNode: result } = operation
    let resultFlow: Flow = null

    if ( result && result.operation ) {
      resultFlow = new Flow( { draw: this }, result.operation )
    }

    this.data = data
    this.operation = operation
    this.result = result
    this.resultFlow = resultFlow
  }

  get operationLink(): OperationLink {
    return this.operation.operationLink
  }

  get dsElements(): Path[] {
    return [ ...this.data, this.operation, this.result ].filter( notNil )
  }

  get sortedData(): Node[] {
    const clonedData = [ ...this.data ]
    return clonedData.sort( sortFromTopToBottom )

    function sortFromTopToBottom( a, b ) {
      const topA = a.bounds.top
      const topB = b.bounds.top
      return topA - topB
    }
  }

  get dataBounds(): Bounds {
    const dataBounds = this.data.map( ( { bounds } ) => bounds )
    let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    left = min( ...dataBounds.map( ( { left } ) => left ) )
    right = max( ...dataBounds.map( ( { right } ) => right ) )
    top = min( ...dataBounds.map( ( { top } ) => top ) )
    bottom = max( ...dataBounds.map( ( { bottom } ) => bottom ) )

    return { left, right, top, bottom }
  }

  get dataBorderPath(): Path2D {
    return getBoundsPath( this.dataBounds )
  }

  get boundsPath(): Path2D {
    return getBoundsPath( this.bounds )
  }

  get mostTopDataElement(): Node {
    return firstElement( this.sortedData )
  }

  get mostBottomDataElement(): Node {
    return lastElement( this.sortedData )
  }

  get twoSideNodesCenter(): Point2D {
    const { mostTopDataElement, mostBottomDataElement } = this
    let nodes = [ mostTopDataElement, mostBottomDataElement ].filter( notNil )
    const nodesCenters = nodes.map( node => node.itemCenter )
    return getPointsCenter( nodesCenters )
  }

  get bounds(): Bounds {
    const dsElementsBounds = this.dsElements.map( ( { bounds } ) => bounds )
    let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    left = min( ...dsElementsBounds.map( ( { left } ) => left ) )
    right = max( ...dsElementsBounds.map( ( { right } ) => right ) )
    top = min( ...dsElementsBounds.map( ( { top } ) => top ) )
    bottom = max( ...dsElementsBounds.map( ( { bottom } ) => bottom ) )

    return { left, right, top, bottom }
  }

  contain() {}

  render() {
    const { ctx } = this.getters
    const { dataBorderPath, boundsPath } = this
    ctx.strokeStyle = "rgba( 255, 255, 255, 0.1 )"

    // ctx.stroke( dataBorderPath )
    ctx.stroke( boundsPath )
  }

  format() {
    this.formatSortedData()
    this.formatOperationLink()
    this.formatOperation()
    this.formatResult()
  }

  formatSortedData() {
    const { mostTopDataElement, sortedData } = this
    const { DATA_ELEMENT_INTERVAL } = Flow

    let deltaY = 0
    let basicCenter: Point2D = {
      x: 0,
      y: 0
    }

    if ( mostTopDataElement ) {
      basicCenter = mostTopDataElement.itemCenter
    }

    sortedData.map( format )

    function format( node: Node, index: number, sortedData: Node[] ) {
      if ( node !== mostTopDataElement ) {
        const prevNode = prevElement( sortedData, index )
        const prevHalfHeight = prevNode ? prevNode.height / 2 : 0
        const curHalfHeight = node.height / 2
        deltaY = deltaY + DATA_ELEMENT_INTERVAL + prevHalfHeight + curHalfHeight
        const { x, y } = basicCenter
        const newCenter = {
          x: x,
          y: y + deltaY
        }
        node.translateCenterToPoint( newCenter )
      }
    }
  }

  formatOperation() {
    const { DATA_TO_OPERATION_CENTER } = Flow
    const { operation, twoSideNodesCenter, data = [] } = this
    let { x, y } = twoSideNodesCenter
    let cx = getDistanceFromNodesBoundsToOperationCenter( data ) || null
    const operationCenter = {
      x: cx,
      y
    }

    notNil( cx ) && operation.translateCenterToPoint( operationCenter )
  }

  formatOperationLink() {
    const { DATA_TO_OPERATION_CENTER } = Flow
    const { operation, twoSideNodesCenter, data } = this
    const { x, y } = twoSideNodesCenter
    let cx = getDistanceFromNodesBoundsToOperationCenter( data ) || null

    notNil( cx ) && this.operationLink.translateVerticalLinesToX( cx )
  }

  formatResult() {
    const { result } = this

    if ( result ) {
      const { operation } = this

      const { OPERATION_CENTER_TO_RESULT } = Flow
      const { x, y } = operation.itemCenter
      const resultCenter = {
        x: x + OPERATION_CENTER_TO_RESULT,
        y
      }

      result.translateCenterToPoint( resultCenter )
    }
  }

  translate( dx: number, dy: number ) {
    this.data.map( node => node.translate( dx, dy ) )
    this.operation && this.operation.translate( dx, dy )
    this.result && this.result.translate( dx, dy )
  }

  forceRemove() {
    const { data, operation, result, resultFlow } = this

    this.actions.REMOVE_ELEMENTS( [ ...data, operation, result, resultFlow ] )

    this.remove()
  }
}
