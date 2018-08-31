import RightLinking from "../../Linking/RightLinking"
import OperationOrthogonalLine from "../../Link/OperationLink/OperationOrthogonalLine"
import { notNil } from "../../../../../Draw/src/util/lodash/index"
import OperationLink from '../../Link/OperationLink/OperationLink';
import SingleOperationLink from '../../Link/OperationLink/SingleOperationLink';

export default class NodeRightLinking extends RightLinking {
  operationLink: OperationLink = null
  singleOperationLink: SingleOperationLink = null

  constructor( props ) {
    super( setPropsDangerously( props ) )

    function setPropsDangerously( props ) {
      return props
    }
  }

  get operationOrthogonalLines(): OperationOrthogonalLine[] {
    return this.operationLink.links
  }

  setOperationLink( operationLink: OperationLink ) {
    this.operationLink = operationLink
  }

  setSingleOperationLink( singleOperationLink: SingleOperationLink ) {
    this.singleOperationLink = singleOperationLink
  }

  translate( dx: number, dy: number ) {
    const self = this
    const { singleOperationLink } = this

    if ( notNil( singleOperationLink ) ) {
      const { x, y } = self
      const { startLinking, shouldSelect } = singleOperationLink
      !shouldSelect && startLinking && startLinking.translateLinkingToPoint( { x: x + dx, y: y + dy } )
    }

    super.translate( dx, dy )

  }
}
