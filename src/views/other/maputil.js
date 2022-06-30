import zhongguo from '@/assets/mapJson/data-city.json'
import anhui from '@/assets/mapJson/data-anhui.json'
import aomen from '@/assets/mapJson/data-aomen.json'
import beijing from '@/assets/mapJson/data-beijing.json'
import chongqing from '@/assets/mapJson/data-chongqing.json'
import fujian from '@/assets/mapJson/data-fujian.json'
import gansu from '@/assets/mapJson/data-gansu.json'
import guangdong from '@/assets/mapJson/data-guangdong.json'
import guangxi from '@/assets/mapJson/data-guangxi.json'
import guizhou from '@/assets/mapJson/data-guizhou.json'
import hainan from '@/assets/mapJson/data-hainan.json'
import hebei from '@/assets/mapJson/data-hebei.json'
import heilongjiang from '@/assets/mapJson/data-heilongjiang.json'
import henan from '@/assets/mapJson/data-henan.json'
import hubei from '@/assets/mapJson/data-hubei.json'
import hunan from '@/assets/mapJson/data-hunan.json'
import jiangsu from '@/assets/mapJson/data-jiangsu.json'
import jiangxi from '@/assets/mapJson/data-jiangxi.json'
import jilin from '@/assets/mapJson/data-jilin.json'
import liaoning from '@/assets/mapJson/data-liaoning.json'
import neimenggu from '@/assets/mapJson/data-neimenggu.json'
import ningxia from '@/assets/mapJson/data-ningxia.json'
import qinghai from '@/assets/mapJson/data-qinghai.json'
import shandong from '@/assets/mapJson/data-shandong.json'
import shanghai from '@/assets/mapJson/data-shanghai.json'
import shanxi1 from '@/assets/mapJson/data-shanxi1.json'
import shanxi2 from '@/assets/mapJson/data-shanxi2.json'
import sichuan from '@/assets/mapJson/data-sichuan.json'
import taiwan from '@/assets/mapJson/data-taiwan.json'
import tianjin from '@/assets/mapJson/data-tianjin.json'
import xianggang from '@/assets/mapJson/data-xianggang.json'
import xinjiang from '@/assets/mapJson/data-xinjiang.json'
import xizang from '@/assets/mapJson/data-xizang.json'
import yunnan from '@/assets/mapJson/data-yunnan.json'
import zhejiang from '@/assets/mapJson/data-zhejiang.json'

const mapDict = {
  安徽省: 'anhui',
  澳门特别行政区: 'aomen',
  北京市: 'beijing',
  重庆市: 'chongqing',
  福建省: 'fujian',
  甘肃省: 'gansu',
  广东省: 'guangdong',
  广西壮族自治区: 'guangxi',
  贵州省: 'guizhou',
  海南省: 'hainan',
  河北省: 'hebei',
  黑龙江省: 'heilongjiang',
  河南省: 'henan',
  湖北省: 'hubei',
  湖南省: 'hunan',
  江苏省: 'jiangsu',
  江西省: 'jiangxi',
  吉林省: 'jilin',
  辽宁省: 'liaoning',
  内蒙古自治区: 'neimenggu',
  宁夏回族自治区: 'ningxia',
  青海省: 'qinghai',
  山东省: 'shandong',
  上海市: 'shanghai',
  山西省: 'shanxi1',
  陕西省: 'shanxi2',
  四川省: 'sichuan',
  台湾省: 'taiwan',
  天津市: 'tianjin',
  香港特别行政区: 'xianggang',
  新疆维吾尔自治区: 'xinjiang',
  西藏自治区: 'xizang',
  云南省: 'yunnan',
  浙江省: 'zhejiang'
}

const mapData = {
  anhui,
  aomen,
  beijing,
  chongqing,
  fujian,
  gansu,
  guangdong,
  guangxi,
  guizhou,
  hainan,
  hebei,
  heilongjiang,
  henan,
  hubei,
  hunan,
  jiangsu,
  jiangxi,
  jilin,
  liaoning,
  neimenggu,
  ningxia,
  qinghai,
  shandong,
  shanghai,
  shanxi1,
  shanxi2,
  sichuan,
  taiwan,
  tianjin,
  xianggang,
  xinjiang,
  xizang,
  yunnan,
  zhejiang
}

export function getMap (mapName) {
  const cityName = mapDict[mapName]
  if (cityName) {
    return [cityName, mapData[cityName]]
  }
  return ['china', zhongguo]
}
