import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class RelateOperation extends Operation {
  
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { RELATE } = OPERATION_TYPES
      props.src =  imageUrls[ RELATE ]
      props.operationType =  RELATE
      return props
    }
  }
}