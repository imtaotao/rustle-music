import 'web/components/root'
import 'web/components/global'
import { notice } from 'web/utils'

window.onNetworkError = () => {
  notice('网络错误')
}