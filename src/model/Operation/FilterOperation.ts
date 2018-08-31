import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class FilterOperation extends Operation {
  
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { FILTER } = OPERATION_TYPES
      props.src =  imageUrls[ FILTER ]
      props.operationType =  FILTER
      return props
    }
  }
}