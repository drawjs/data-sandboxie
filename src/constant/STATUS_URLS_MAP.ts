import { TASK_STATUS } from "./resultNodeStatus"
import imageUrls from "../store/imageUrls"

export default  {
  [ TASK_STATUS.SUCCESS ]   : () => imageUrls.STATUS_COMPLETE,
  [ TASK_STATUS.FAILURE ]   : () => imageUrls.STATUS_ERROR,
  [ TASK_STATUS.PROCESSING ]: () => imageUrls.STATUS_LOADING,
  [ TASK_STATUS.INVALID ]   : () => imageUrls.STATUS_NOT_RUNNING,
  [ TASK_STATUS.WAITING ]   : () => imageUrls.STATUS_WAITING,
}