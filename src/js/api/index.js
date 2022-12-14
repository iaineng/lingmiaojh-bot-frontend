import folder from './folder'
import task from './task'
import log from './log'
import user from './user'
import { f7 } from 'framework7-svelte'
import config from '@/js/api/config'

export default {
  folder,
  task,
  log,
  user,
  req (reqFunc, okAlert, errAlert, progressTitle) {
    let progressDialog = null
    if (progressTitle) {
      progressDialog = f7.dialog.progress(progressTitle)
    }

    function closeProgressDialog () {
      if (progressDialog) {
        progressDialog.close()
      }
    }

    function showOkAlert (param) {
      if (okAlert) {
        if (typeof okAlert === 'function') {
          f7.dialog.alert(okAlert(param), '提示')
        } else {
          f7.dialog.alert(okAlert, '提示')
        }
      }
    }

    return new Promise((resolve, reject) => {
      reqFunc().then(resp => {
        if (resp === 'ignored') {
          closeProgressDialog()
          showOkAlert()
          resolve()
          return
        }

        const respObj = JSON.parse(resp.data)
        if (respObj && respObj?.status === config.statusSuccessCode) {
          closeProgressDialog()
          showOkAlert(respObj)
          resolve(respObj)
        } else {
          closeProgressDialog()
          if (errAlert) {
            if (typeof errAlert === 'function') {
              f7.dialog.alert(
                `${errAlert(respObj ?? resp)} - ${respObj?.message ?? resp}`,
                '提示')
            } else {
              f7.dialog.alert(
                `${errAlert} - ${respObj?.message ?? resp}`,
                '提示')
            }
          }
          reject(respObj ?? resp)
        }
      }).catch(err => {
        closeProgressDialog()
        if (errAlert) {
          if (typeof errAlert === 'function') {
            f7.dialog.alert(`${errAlert(err)} - ${err}`, '提示')
          } else {
            f7.dialog.alert(`${errAlert} - ${err}`, '提示')
          }
        }
        reject(err)
      })
    })
  }
}
