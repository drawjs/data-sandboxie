import NodeLinking from "./Linking";
import Path from "../../../../Draw/src/model/Path";

export default class CenterLinking extends NodeLinking {
  constructor( props ){
    super( setPropsDangerously( props ) )

    function setPropsDangerously( props ) {
      const { path }: { path: Path } = props
      const { cy, bounds } = path
      const { left, right, bottom, top } = bounds
      props.x = ( left + right ) / 2
      props.y = ( bottom + top ) / 2

      props.fillColor = 'blue'
      return props
    }
  }
}