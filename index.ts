import { getOrderDetails, updateOrderStatus } from './src/order'
import { events } from './src/types'
import api, { init, updateInstanceUrl, updateToken } from './src/api'

export {
  api,
  events,
  getOrderDetails,
  updateOrderStatus,
  updateInstanceUrl,
  updateToken,
  init
}