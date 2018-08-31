import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class IntersectOperation extends Operation {
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { INTERSECT } = OPERATION_TYPES
      props.src =  imageUrls[ INTERSECT ]
      props.operationType =  INTERSECT
      return props
    }
  }
}