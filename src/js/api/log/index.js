import framework7 from 'framework7'
import config from '@/js/api/config'

export default {
  getServerLogs () {
    return framework7.request.get(`${config.baseUrl}/api/v1/log`)
  }
}
