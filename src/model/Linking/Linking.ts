import Segment from "../../../../Draw/src/model/Segment";


export default class Linking extends Segment {
  show: boolean = false
  constructor( props ) {
    super( setPropsDangerously( props ) )

    function setPropsDangerously( props ) {
      props.draggable = false
      return props
    }
  }
}
