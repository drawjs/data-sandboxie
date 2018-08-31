import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class SubsetOperation extends Operation {
  
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { SUBSET } = OPERATION_TYPES
      props.src =  imageUrls[ SUBSET ]
      props.operationType =  SUBSET
      return props
    }
  }
}