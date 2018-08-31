import LeftLinking from "../../Linking/LeftLinking"
import OperationOrthogonalLine from "../../Link/OperationLink/OperationOrthogonalLine"
import { notNil } from "../../../../../Draw/src/util/lodash/index"
import { notEmpty } from "../../../../../Draw/src/util/js/array"
import OperationLink from "../../Link/OperationLink/OperationLink"
import Linking from '../../Linking/Linking';
import CenterLinking from '../../Linking/CenterLinking';

export default class OperationCenterLinking extends CenterLinking {
  operationLink: OperationLink = null

  constructor( props ) {
    super( setPropsDangerously( props ) )

    function setPropsDangerously( props ) {
      props.show = false
      return props
    }
  }

  get operationOrthogonalLines(): OperationOrthogonalLine[] {
    return this.operationLink.links
  }

  setOperationLink( operationLink: OperationLink ) {
    this.operationLink = operationLink
  }

  translate( dx: number, dy: number ) {
    const { operationOrthogonalLines } = this
    const notEmptyOperationOrthogonalLines = notEmpty( operationOrthogonalLines )
    const { shouldSelect } = this.operationLink

    notEmptyOperationOrthogonalLines &&
      operationOrthogonalLines.map( operationOrthogonalLine => {
        const { x, y } = this
        const { endLinking } = operationOrthogonalLine
        !shouldSelect && endLinking && endLinking.translateLinkingToPoint( { x: x + dx, y: y + dy } )
      } )

    super.translate( dx, dy )
  }
}
