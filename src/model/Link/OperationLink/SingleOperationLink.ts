import Node from '../../Node/Node';
import Operation from '../../Operation/Operation';
import OperationLink from './OperationLink';
import OperationOrthogonalLine from './OperationOrthogonalLine';
import { notNil } from '../../../../../Draw/src/util/lodash/index';
import { LINK } from '../../../constant/name';

export default class SingleOperationLink extends OperationOrthogonalLine {
  node: Node
  operation: Operation

  constructor( props ){
    super( setPropsDangerously( props ) )

    const { node, operation }: { node: Node, operation: Operation } = props      

    this.node = notNil( node ) ? node: this.node
    this.node.rightLinking.setSingleOperationLink( this )

    this.operation = notNil( operation ) ? operation: this.operation
    

    this.startLine.getErasingPath2d = () => node.path2d
    this.endLine.getErasingPath2d = () => node.path2d

    function setPropsDangerously( props ) {
      const { node, operation }: { node: Node, operation: Operation } = props      
      const corners = getCorners( node, operation )

      props.startSegment = node.rightLinking
      props.endSegment = operation.centerLinking
      props.corners = corners
      props.showArrow = false

      return props

      function getCorners( node: Node, operation: Operation ): Point2D[] {
        const source = node.rightLinking
        const target = operation.centerLinking

        const { x: sx, y: sy } = source
        const { x: tx, y: ty } = target

        const corner: Point2D = {
          x: tx,
          y: sy
        }
        return [ corner ]
      }
    }

  }

  translateVerticalLine( dx: number ) {
    this.cornerSegments.map( cornerSegment => {
      const { x, y } = cornerSegment
      const newX = x + dx
      cornerSegment.translateToPoint( { x: newX, y } )
    } ) 
  } 

  translateVerticalLineToX( x: number ) {
    this.cornerSegments.map( cornerSegment => {
      const { y } = cornerSegment
      cornerSegment.translateToPoint( { x, y } )
    } )
  }
}