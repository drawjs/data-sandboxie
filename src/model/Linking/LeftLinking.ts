import NodeLinking from "./Linking";
import Path from "../../../../Draw/src/model/Path";

export default class LeftLinking extends NodeLinking {
  constructor( props ){
    super( setPropsDangerously( props ) )

    function setPropsDangerously( props ) {
      const { path }: { path: Path } = props
      const { cy, bounds } = path
      const { left } = bounds
      props.x = left
      props.y = cy

      props.fillColor = 'blue'
      return props
    }
  }
}