import Node from "../Node"
import DrawText from "../../../../../Draw/src/model/text/DrawText"
import { DATA_NODE } from "../../../constant/type"
import imageUrls from "../../../store/imageUrls"

export default class DataNode extends Node {
  type: string = DATA_NODE


  renderFnInMiniMap: Function = () => {
    const { ctx } = this.getters
    ctx.fillStyle = "#00c3c3"
    this.path2d && ctx.fill( this.path2d )

  }

  constructor( props ) {
    super( setPropsDangerously( props ) )
    
    function setPropsDangerously( props ) {
      props.src = imageUrls.FILE_XLSX
      return props
    }
  }
}
