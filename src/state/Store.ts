import Ds from "../Ds"
import Node from "../model/Node/Node"
import Operation from "../model/Operation/Operation"
import DrawStore from "../../../Draw/src/store/draw/DrawStore"
import Formatter from "../model/Tool/Formatter/Formatter"

export default class Store extends DrawStore {
  ds: Ds

  formatter: Formatter = null

  setting: Setting

  constructor( ds: Ds ) {
    super()
    this.ds = ds
  }
}
