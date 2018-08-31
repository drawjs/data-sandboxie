import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class SubtractOperation extends Operation {
  
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { SUBTRACT } = OPERATION_TYPES
      props.src =  imageUrls[ SUBTRACT ]
      props.operationType =  SUBTRACT
      return props
    }
  }
}