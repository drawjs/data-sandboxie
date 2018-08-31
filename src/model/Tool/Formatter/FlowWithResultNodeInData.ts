import Flow from "./Flow"
import Operation from "../../Operation/Operation"
import Node from "../../Node/Node"
import { prevElement } from "../../../../../Draw/src/util/js/array"
import ResultNode from "../../Node/ResultNode/ResultNode"
import Store from "../../../state/Store"

export default class FlowWithResultNodeInData extends Flow {
  constructor( props, operation: Operation ) {
    super( props, operation )
  }

  format() {
    this.formatSortedData()
    this.formatOperationLink()
    this.formatOperation()
    this.formatResult()
  }

  formatSortedData() {
    const self = this
    const store = <Store>this.drawStore
    const { formatter } = store
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
      const { x, y } = basicCenter
      let newCenter = {
        x,
        y
      }

      if ( node !== mostTopDataElement ) {
        const prevNode = prevElement( sortedData, index )
        const prevHalfHeight = prevNode ? prevNode.height / 2 : 0
        const curHalfHeight = node.height / 2
        
        if ( node.isDataNode ) {
          deltaY =
            deltaY + DATA_ELEMENT_INTERVAL + prevHalfHeight + curHalfHeight

          newCenter.y = newCenter.y + deltaY
          node.translateCenterToPoint( newCenter )
        }

        if ( node.isResultNode ) {
          const upperNode = prevElement( sortedData, index )

          if ( upperNode ) {
            const deltaVerticalDistance = formatter.getResultNodeVerticalDistanceToUpperNode(
              <ResultNode>node,
              upperNode,
              sortedData
            )
            deltaY = deltaY + deltaVerticalDistance + prevHalfHeight + curHalfHeight
            newCenter.y = newCenter.y + deltaY

            const dx = newCenter.x - node.itemCenter.x
            const dy = newCenter.y - node.itemCenter.y

            const targetFlow = formatter.getFlowByResult( <ResultNode>node )

            targetFlow && targetFlow.translate( dx, dy )
          }
        }
      }
    }
  }
}
