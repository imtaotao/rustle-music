import { RuntimeManager } from './runtime'

const remote = window.require('electron').remote

export function setRuntimeManager (rm: RuntimeManager) {
  // store.RuntimeManager = rm
  // console.log(remote.getGlobal('store'));
  remote.getCurrentWebContents().store = {c: 'tt'}
  console.log(remote.getCurrentWebContents());
  // remote.getGlobal('store').RuntimeManager = rm
  return rm
}