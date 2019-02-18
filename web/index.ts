import 'web/components/root'
import 'web/components/global'
import { notice } from 'web/utils'
import 'web/assets/play/icomoon/style'

window.onNetworkError = () => {
  notice('网络错误')
}