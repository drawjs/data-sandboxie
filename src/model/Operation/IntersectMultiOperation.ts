import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class IntersectMultiOperation extends Operation {
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { INTERSECT_MULTI } = OPERATION_TYPES
      props.src =  imageUrls[ INTERSECT_MULTI ]
      props.operationType =  INTERSECT_MULTI
      return props
    }
  }
}