import Setting from '@/../setting/setting.json'
import { createI18n } from 'vue-i18n'
import { getCategory } from './utils'
import { CategoryList, Locales, VoicesList } from './voices'

const CN: any = { ...Locales['zh-CN'], voice: {}, voicecategory: {} }
const JP: any = { ...Locales['ja-JP'], voice: {}, voicecategory: {} }

const NAME = Setting['name'] || {}

CN.info = {
  ...CN.info,
  ...NAME['CN'] || {
    title: '语音按钮',
    fullName: ''
  }
}

JP.info = {
  ...JP.info,
  ...NAME['JP'] || {
    title: 'Voices Button',
    fullName: ''
  }
}

for (const category of CategoryList) {
  if (category.translate) {
    if (category.translate['zh-CN']) {
      CN.voicecategory[category.name] = category.translate['zh-CN']
    }
    if (category.translate['ja-JP']) {
      JP.voicecategory[category.name] = category.translate['ja-JP']
    }
  }
}

/**
 * 获取音频对应语言的数量
 */
let CNNum = 0
let ENNum = 0
let HideCNNum = 0
let HideENNum = 0
for (const voice of VoicesList) {
  if (voice.translate) {
    const category = getCategory(voice.category)!
    if (voice.translate['zh-CN'] && category.translate['zh-CN']) {
      CN.voice[voice.name] = voice.translate['zh-CN']
      if (voice.hide || category.hide) {
        HideCNNum++
      } else {
        CNNum++
      }
    }
    if (voice.translate['ja-JP'] && category.translate['ja-JP']) {
      JP.voice[voice.name] = voice.translate['ja-JP']
      if (voice.hide || category.hide) {
        HideENNum++
      } else {
        ENNum++
      }
    }
  }
}

CN.voiceTotal = CNNum.toString()
JP.voiceTotal = ENNum.toString()
CN.hideVoiceTotal = (CNNum + HideCNNum).toString()
JP.hideVoiceTotal = (ENNum + HideENNum).toString()

/**
 * 获取音频对应语言的更新日期和更新数量
 */
let CNLastDate = ''
let ENLastDate = ''
let CNTemp: null | Date = null
let ENTemp: null | Date = null
let hideCNLastDate = ''
let hideENLastDate = ''
let hideCNTemp: null | Date = null
let hideENTemp: null | Date = null
for (const voice of VoicesList) {
  if (voice.date) {
    const voiceDate = new Date(voice.date!)
    const category = getCategory(voice.category)!
    if (voice.translate['zh-CN'] && category.translate['zh-CN']) {
      if (!(voice.hide || category.hide)) {
        if (!CNTemp) {
          CNTemp = voiceDate
          CNLastDate = voice.date!
        }
        if (voiceDate > CNTemp) {
          CNTemp = voiceDate
          CNLastDate = voice.date!
        }
      }
      if (!hideCNTemp) {
        hideCNTemp = voiceDate
        hideCNLastDate = voice.date!
      }
      if (voiceDate > hideCNTemp) {
        hideCNTemp = voiceDate
        hideCNLastDate = voice.date!
      }
    }
    if (voice.translate['ja-JP'] && category.translate['ja-JP']) {
      if (!(voice.hide || category.hide)) {
        if (!ENTemp) {
          ENTemp = voiceDate
          ENLastDate = voice.date!
        }
        if (voiceDate > ENTemp) {
          ENTemp = voiceDate
          ENLastDate = voice.date!
        }
      }
      if (!hideENTemp) {
        hideENTemp = voiceDate
        hideENLastDate = voice.date!
      }
      if (voiceDate > hideENTemp) {
        hideENTemp = voiceDate
        hideENLastDate = voice.date!
      }
    }
  }
}

CN.lastDate = CNLastDate || ''
JP.lastDate = ENLastDate || ''
CN.hideLastDate = hideCNLastDate || ''
JP.hideLastDate = hideENLastDate || ''

CN.newVoice = VoicesList.filter((item) => item.date && item.date === CNLastDate && item.translate['zh-CN'] && CategoryList.find(category => category.name === item.category)!.translate['zh-CN']).length.toString() || ''
JP.newVoice = VoicesList.filter((item) => item.date && item.date === ENLastDate && item.translate['ja-JP'] && CategoryList.find(category => category.name === item.category)!.translate['ja-JP']).length.toString() || ''
CN.hideNewVoice = VoicesList.filter((item) => item.date && item.date === hideCNLastDate && item.translate['zh-CN'] && CategoryList.find(category => category.name === item.category)!.translate['zh-CN']).length.toString() || ''
JP.hideNewVoice = VoicesList.filter((item) => item.date && item.date === hideENLastDate && item.translate['ja-JP'] && CategoryList.find(category => category.name === item.category)!.translate['ja-JP']).length.toString() || ''

const i18n = createI18n({
  locale: /JP/i.test(navigator.language) ? 'ja-JP' : 'zh-CN',
  messages: {
    'zh-CN': CN,
    'ja-JP': JP
  }
})

export default i18n
