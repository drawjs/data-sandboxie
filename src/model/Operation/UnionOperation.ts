import Operation from './Operation'
import imageUrls from '../../store/imageUrls'
import OPERATION_TYPES from '../../constant/OPERATION_TYPES'

export default class UnionOperation extends Operation {
  
  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    this.bindDrag()
    function setPropsDangerously( props ) {
      const { UNION } = OPERATION_TYPES
      props.src =  imageUrls[ UNION ]
      props.operationType =  UNION
      return props
    }
  }
}