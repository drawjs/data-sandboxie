import Cell from "../../../../../Draw/src/model/Cell"
import Flow from "./Flow"
import {
  getBoundsByManyBounds,
  getBoundsPath
} from "../../../../../Draw/src/drawUtil/bounds"
import { CHAIN } from "../../../constant/type"
import { notNil, isNil, uniq } from "../../../../../Draw/src/util/lodash/index"
import Path from "../../../../../Draw/src/model/Path"
import OperationLink from '../../Link/OperationLink/OperationLink'
import Store from "../../../state/Store"
import ResultNode from "../../Node/ResultNode/ResultNode"

const { abs } = Math

/**
 * Used for position flows module
 */
export default class Chain extends Cell {
  type: string = CHAIN
  flows: Flow[] = []

  constructor( props, flows: Flow[] ) {
    super( props )

    this.flows = flows
  }

  get dsElements(): Path[] {
    let res: Path[] = []
    this.flows.map( ( { dsElements } ) => {
      res = [
        ...res,
        ...dsElements
      ]
    } )
    res = uniq( res )
    return res
  }

  get bounds(): Bounds {
    const { flows } = this
    const flowsBounds = flows.map( flow => flow.bounds )
    return getBoundsByManyBounds( flowsBounds )
  }

  get boundsPath(): Path2D {
    return getBoundsPath( this.bounds )
  }

  get leftTop(): Point2D {
    const { left, top } = this.bounds
    return {
      x: left,
      y: top
    }
  }

  get center(): Point2D {
    const { left, right, top, bottom } = this.bounds
    return {
      x: ( left + right ) / 2,
      y: ( top + bottom ) / 2
    }
  }

  get width(): number {
    const { left, right } = this.bounds
    return abs( right - left )
  }

  get height(): number {
    const { top, bottom } = this.bounds
    return abs( bottom - top )
  }

  get isFormatterHorizontal(): boolean {
    const store = <Store>this.drawStore
    return store.formatter.isHorizontal
  }

  get isFormatterVertical(): boolean {
    const store = <Store>this.drawStore
    return store.formatter.isVertical
  }

  /**
   * Being used outside
   */
  get finalResultNode(): ResultNode {
    let res = null
    try { res = this.flows.filter( ( { resultFlow } ) => isNil( resultFlow ) )[ 0 ].result } catch ( e ) { }
    return res
  }

  contain() {}

  render() {
    const { ctx } = this.getters
    const { boundsPath } = this
    ctx.strokeStyle = "red"

    ctx.stroke( boundsPath )
  }

  translateLeftTopToPoint( leftTop: Point2D ) {
    const { x, y } = leftTop
    const { left, top } = this.bounds

    const dx = x - left
    const dy = y - top

    this.dsElements.map( dsElement => dsElement && dsElement.translate( dx, dy ) )
  }

  translate( dx: number, dy: number ) {
    this.dsElements.map( dsElement => dsElement && dsElement.translate( dx, dy ) )
  }
}
