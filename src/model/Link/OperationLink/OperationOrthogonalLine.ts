import OrthogonalLine from "../../../../../Draw/src/model/shape/OrthogonalLine/OrthogonalLine";
import { LINE_COLOR } from '../../../constant/color';

export default class OperationOrthogonalLine extends OrthogonalLine {
  shouldRenderInMiniMap: boolean = true
  
  constructor( props ){
    super( setPropsDangerously( props ) )

    function setPropsDangerously( props ) {
      props.showCenterSegment = false
      props.showCorner = false
      props.startLineFillColor = LINE_COLOR
      props.endLineFillColor = LINE_COLOR
      props.innerLineFillColor = LINE_COLOR
      props.shouldRenderInMiniMap = true
      props.addedToBottom = true
      
      return props
    }
  }

  updateDrag() {
    
  }
}