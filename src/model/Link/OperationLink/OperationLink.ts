import Particle from "../../../../../Draw/src/model/Particle"
import Cell from "../../../../../Draw/src/model/Cell"
import Operation from "../../Operation/Operation"
import Node from '../../Node/Node';
import SingleOperationLink from "./SingleOperationLink"
import { LINK } from "../../../constant/name"
import { notNil } from "../../../../../Draw/src/util/lodash/index"
import { OPERATION_LINK } from '../../../constant/type';

const { min, max } = Math

export default class OperationLink extends Cell {
  type: string = OPERATION_LINK
  operation: Operation = null

  links: SingleOperationLink[] = []

  static END_LINE_LENGTH = 10

  constructor( props ) {
    super( setPropsDangerously( props ) )

    const { operation }: { operation: Operation } = props
    const { nodes }: { nodes: Node[] } = operation

    nodes.map( node => {
      const link: SingleOperationLink = new SingleOperationLink( {
        draw: this.draw,
        node,
        operation
      } )
      this.links.push( link )
      node.rightLinking.setOperationLink( this )
    } )

    this.operation = notNil( props.operation ) ? props.operation : this.operation

    this.operation.centerLinking.setOperationLink( this )

    function setPropsDangerously( props ) {
      return props
    }
  }


  get identityClass(): string {
    return LINK
  }

  get nodes(): Node[] {
    return this.links.map( ( { node } ) => node )
  }

  get bounds(): Bounds {
    const linksBounds = this.links.map( ( { bounds } ) => bounds )
    let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    left = min( ...linksBounds.map( ( { left } ) => left ) )
    right = max( ...linksBounds.map( ( { right } ) => right ) )
    top = min( ...linksBounds.map( ( { top } ) => top ) )
    bottom = max( ...linksBounds.map( ( { bottom } ) => bottom ) )

    return { left, right, top, bottom }
  }

  contain( x: number, y: number ) {
    return this.links.some( link => link.contain( x, y ) )
  }

  select() {
    this.sharedActions.selectCells( this.links )
    this.sharedActions.selectCells( this.nodes )
    this.operation.select()
    super.select()
  }

  updateDrag( event, dragger ) {
    if ( this.draggable ) {
      const point: Point2DInitial = this.getters.getInitialPoint( event )

      const dx = dragger.getDeltaXToPrevPoint( point )
      const dy = dragger.getDeltaYToPrevPoint( point )

      this.links.map( ( link ) => {
        const { cornerSegments } = link
        this.sharedActions.translateSegments( cornerSegments, dx, dy )
      } )
    }
  }

  translateVerticalLine( dx: number ) {
    this.links.map( link => link.translateVerticalLine( dx ) )
  }

  translateVerticalLinesToX( x: number ) {
    this.links.map( link => link.translateVerticalLineToX( x ) )
  }

  resetOperation( ) {
    this.operation = null
  }

  remove() {
    this.links.map( link => link && link.forceRemove() )
    super.remove()
  }
}
