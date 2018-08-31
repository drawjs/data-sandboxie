import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class IntersectTwoOperation extends Operation {
  
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { INTERSECT_TWO } = OPERATION_TYPES
      props.src =  imageUrls[ INTERSECT_TWO ]
      props.operationType =  INTERSECT_TWO
      return props
    }
  }
}