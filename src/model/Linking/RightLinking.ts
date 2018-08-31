import NodeLinking from './Linking';
import Path from '../../../../Draw/src/model/Path';

export default class RightLinking extends NodeLinking {
  constructor( props ){
    super( setPropsDangerously( props ) )

    function setPropsDangerously( props ) {
      const { path }: { path: Path } = props
      const { cy, bounds } = path
      const { right } = bounds
      props.x = right - 1
      props.y = cy

      props.fillColor = 'red'
      return props
    }
  }
}