import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class SubtractMultiOperation extends Operation {
  
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { SUBTRACT_MULTI } = OPERATION_TYPES
      props.src =  imageUrls[ SUBTRACT_MULTI ]
      props.operationType =  SUBTRACT_MULTI
      return props
    }
  }
}