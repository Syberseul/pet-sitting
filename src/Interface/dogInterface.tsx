export interface BreedInfo {
  name: string;
  normalWeightRange: [number, number];
  searchName?: string;
  size?: DogSize;
  dailyPrice?: number;
}

export enum DogSize {
  X_SMALL = "X_SMALL",
  SMALL = "小型犬",
  MEDIUM = "中型犬",
  LARGE = "大型犬",
  X_LARGE = "超大型犬",
}

export const breedMap: Record<string, BreedInfo> = {
  // 简单品种（无子品种）
  affenpinscher: { name: "猴面梗", normalWeightRange: [3, 6] },
  african: { name: "非洲犬", normalWeightRange: [20, 30] },
  airedale: { name: "艾尔谷梗", normalWeightRange: [20, 30] },
  akita: { name: "秋田犬", normalWeightRange: [30, 50] },
  appenzeller: { name: "阿彭策尔山犬", normalWeightRange: [22, 32] },
  basenji: { name: "巴仙吉犬", normalWeightRange: [9, 11] },
  beagle: { name: "比格犬", normalWeightRange: [9, 11] },
  bluetick: { name: "蓝斑猎浣熊犬", normalWeightRange: [20, 36] },
  borzoi: { name: "俄罗斯狼犬", normalWeightRange: [34, 48] },
  bouvier: { name: "布维耶犬", normalWeightRange: [30, 50] },
  boxer: { name: "拳师犬", normalWeightRange: [25, 32] },
  brabancon: { name: "布鲁塞尔格里芬犬", normalWeightRange: [3.5, 6] },
  briard: { name: "布里牧犬", normalWeightRange: [25, 40] },
  cavapoo: { name: "卡瓦普犬", normalWeightRange: [5, 12] },
  chihuahua: { name: "吉娃娃", normalWeightRange: [1.5, 3] },
  chow: { name: "松狮犬", normalWeightRange: [20, 32] },
  clumber: { name: "克伦伯猎犬", normalWeightRange: [25, 39] },
  cockapoo: { name: "可卡贵宾犬", normalWeightRange: [5, 11] },
  cotondetulear: { name: "棉花面纱犬", normalWeightRange: [4, 7] },
  dalmatian: { name: "斑点犬", normalWeightRange: [20, 32] },
  dhole: { name: "豺犬", normalWeightRange: [12, 20] },
  dingo: { name: "澳洲野犬", normalWeightRange: [13, 20] },
  doberman: { name: "杜宾犬", normalWeightRange: [30, 45] },
  entlebucher: { name: "恩特布赫山犬", normalWeightRange: [20, 30] },
  eskimo: { name: "爱斯基摩犬", normalWeightRange: [20, 35] },
  germanshepherd: { name: "德国牧羊犬", normalWeightRange: [30, 40] },
  groenendael: { name: "比利时格罗安达犬", normalWeightRange: [20, 30] },
  havanese: { name: "哈瓦那犬", normalWeightRange: [3, 6] },
  husky: { name: "哈士奇", normalWeightRange: [16, 27] },
  keeshond: { name: "荷兰毛狮犬", normalWeightRange: [16, 20] },
  komondor: { name: "可蒙犬", normalWeightRange: [40, 60] },
  kuvasz: { name: "库瓦兹犬", normalWeightRange: [30, 52] },
  labradoodle: { name: "拉布拉多贵宾犬", normalWeightRange: [20, 30] },
  labrador: { name: "拉布拉多犬", normalWeightRange: [25, 36] },
  leonberg: { name: "莱昂伯格犬", normalWeightRange: [45, 77] },
  lhasa: { name: "拉萨犬", normalWeightRange: [5, 8] },
  malamute: { name: "阿拉斯加雪橇犬", normalWeightRange: [34, 39] },
  malinois: { name: "比利时玛利诺犬", normalWeightRange: [20, 30] },
  maltese: { name: "马尔济斯犬", normalWeightRange: [2, 4] },
  mexicanhairless: { name: "墨西哥无毛犬", normalWeightRange: [4, 14] },
  mix: { name: "混种犬", normalWeightRange: [5, 40] }, // 范围较大
  newfoundland: { name: "纽芬兰犬", normalWeightRange: [50, 70] },
  otterhound: { name: "水獭猎犬", normalWeightRange: [30, 55] },
  papillon: { name: "蝴蝶犬", normalWeightRange: [2.5, 5] },
  pekinese: { name: "北京犬", normalWeightRange: [3, 6] },
  pembroke: { name: "彭布罗克柯基犬", normalWeightRange: [10, 14] },
  pitbull: { name: "比特犬", normalWeightRange: [14, 27] },
  pomeranian: { name: "博美犬", normalWeightRange: [1.5, 3.5] },
  pug: { name: "巴哥犬", normalWeightRange: [6, 8] },
  puggle: { name: "巴哥混血犬", normalWeightRange: [7, 14] },
  redbone: { name: "红骨猎浣熊犬", normalWeightRange: [20, 32] },
  rottweiler: { name: "罗威纳犬", normalWeightRange: [35, 60] },
  saluki: { name: "萨路基犬", normalWeightRange: [18, 27] },
  samoyed: { name: "萨摩耶犬", normalWeightRange: [20, 30] },
  schipperke: { name: "比利时小牧羊犬", normalWeightRange: [4, 7] },
  sharpei: { name: "沙皮犬", normalWeightRange: [18, 25] },
  shiba: { name: "柴犬", normalWeightRange: [8, 10] },
  shihtzu: { name: "西施犬", normalWeightRange: [4, 7] },
  stbernard: { name: "圣伯纳犬", normalWeightRange: [60, 90] },
  tervuren: { name: "比利时特伏丹犬", normalWeightRange: [20, 30] },
  vizsla: { name: "维兹拉犬", normalWeightRange: [20, 30] },
  weimaraner: { name: "魏玛犬", normalWeightRange: [25, 40] },
  whippet: { name: "惠比特犬", normalWeightRange: [10, 20] },

  // 展开的子品种（格式: "父品种 子品种"）
  "australian kelpie": {
    name: "澳大利亚卡尔比犬",
    normalWeightRange: [14, 20],
  },
  "australian shepherd": {
    name: "澳大利亚牧羊犬",
    normalWeightRange: [18, 30],
  },
  "bakharwal indian": { name: "印度巴克瓦犬", normalWeightRange: [30, 45] },
  "bulldog boston": { name: "波士顿斗牛犬", normalWeightRange: [5, 11] },
  "bulldog english": { name: "英国斗牛犬", normalWeightRange: [18, 25] },
  "bulldog french": { name: "法国斗牛犬", normalWeightRange: [9, 13] },
  "bullterrier staffordshire": {
    name: "斯塔福德牛头梗",
    normalWeightRange: [13, 17],
  },
  "cattledog australian": { name: "澳洲牧牛犬", normalWeightRange: [15, 22] },
  "chippiparai indian": { name: "印度奇皮帕莱犬", normalWeightRange: [15, 25] },
  "collie border": { name: "边境柯利牧羊犬", normalWeightRange: [14, 20] },
  "corgi cardigan": { name: "卡迪根柯基犬", normalWeightRange: [11, 17] },
  "dane great": { name: "大丹犬", normalWeightRange: [50, 90] },
  "danish swedish": { name: "瑞典丹麦犬", normalWeightRange: [30, 35] },
  "deerhound scottish": { name: "苏格兰猎鹿犬", normalWeightRange: [36, 45] },
  "elkhound norwegian": { name: "挪威猎鹿犬", normalWeightRange: [20, 25] },
  "finnish lapphund": { name: "芬兰拉普猎犬", normalWeightRange: [15, 24] },
  "frise bichon": { name: "比熊犬", normalWeightRange: [5, 10] },
  "gaddi indian": { name: "印度加迪犬", normalWeightRange: [25, 40] },
  "greyhound indian": { name: "印度灵缇犬", normalWeightRange: [25, 30] },
  "greyhound italian": { name: "意大利灵缇犬", normalWeightRange: [2.5, 5] },
  "hound afghan": { name: "阿富汗猎犬", normalWeightRange: [23, 27] },
  "hound basset": { name: "巴吉度猎犬", normalWeightRange: [20, 29] },
  "hound blood": { name: "血猎犬", normalWeightRange: [36, 50] },
  "hound english": { name: "英国猎犬", normalWeightRange: [25, 35] },
  "hound ibizan": { name: "伊比赞猎犬", normalWeightRange: [20, 29] },
  "hound plott": { name: "普罗特猎犬", normalWeightRange: [20, 25] },
  "hound walker": { name: "步行猎犬", normalWeightRange: [20, 30] },
  "mastiff bull": { name: "斗牛獒犬", normalWeightRange: [45, 60] },
  "mastiff english": { name: "英国獒犬", normalWeightRange: [70, 120] },
  "mastiff indian": { name: "印度獒犬", normalWeightRange: [70, 90] },
  "mastiff tibetan": { name: "藏獒", normalWeightRange: [70, 90] },
  "mountain bernese": { name: "伯恩山犬", normalWeightRange: [35, 55] },
  "mountain swiss": { name: "瑞士山地犬", normalWeightRange: [30, 50] },
  "mudhol indian": { name: "印度穆德霍尔犬", normalWeightRange: [15, 25] },
  "ovcharka caucasian": { name: "高加索牧羊犬", normalWeightRange: [45, 70] },
  "pariah indian": { name: "印度帕利亚犬", normalWeightRange: [15, 25] },
  "pinscher miniature": { name: "迷你平斯澈犬", normalWeightRange: [4, 6] },
  "pointer german": { name: "德国指示犬", normalWeightRange: [20, 32] },
  "pointer germanlonghair": {
    name: "德国长毛指示犬",
    normalWeightRange: [25, 35],
  },
  "poodle medium": { name: "中型贵宾犬", normalWeightRange: [10, 15] },
  "poodle miniature": { name: "迷你贵宾犬", normalWeightRange: [5, 9] },
  "poodle standard": { name: "标准贵宾犬", normalWeightRange: [20, 32] },
  "poodle toy": { name: "玩具贵宾犬", normalWeightRange: [3, 4] },
  "rajapalayam indian": {
    name: "印度拉贾帕拉亚姆犬",
    normalWeightRange: [25, 30],
  },
  "retriever chesapeake": {
    name: "切萨皮克寻回犬",
    normalWeightRange: [25, 36],
  },
  "retriever curly": { name: "卷毛寻回犬", normalWeightRange: [25, 40] },
  "retriever flatcoated": { name: "平毛寻回犬", normalWeightRange: [25, 36] },
  "retriever golden": { name: "金毛寻回犬", normalWeightRange: [25, 34] },
  "ridgeback rhodesian": {
    name: "罗得西亚脊背犬",
    normalWeightRange: [32, 36],
  },
  "schnauzer giant": { name: "巨型雪纳瑞", normalWeightRange: [25, 48] },
  "schnauzer miniature": { name: "迷你雪纳瑞", normalWeightRange: [5, 9] },
  "segugio italian": { name: "意大利塞古吉奥犬", normalWeightRange: [18, 28] },
  "setter english": { name: "英国塞特犬", normalWeightRange: [20, 36] },
  "setter gordon": { name: "戈登塞特犬", normalWeightRange: [20, 36] },
  "setter irish": { name: "爱尔兰塞特犬", normalWeightRange: [25, 32] },
  "sheepdog english": { name: "英国牧羊犬", normalWeightRange: [18, 30] },
  "sheepdog indian": { name: "印度牧羊犬", normalWeightRange: [20, 30] },
  "sheepdog shetland": { name: "喜乐蒂牧羊犬", normalWeightRange: [5, 11] },
  "spaniel blenheim": { name: "布伦海姆西班牙猎犬", normalWeightRange: [5, 8] },
  "spaniel brittany": { name: "布列塔尼猎犬", normalWeightRange: [14, 20] },
  "spaniel cocker": { name: "可卡犬", normalWeightRange: [10, 14] },
  "spaniel irish": { name: "爱尔兰西班牙猎犬", normalWeightRange: [16, 20] },
  "spaniel japanese": { name: "日本西班牙猎犬", normalWeightRange: [5, 10] },
  "spaniel sussex": { name: "苏塞克斯猎犬", normalWeightRange: [16, 20] },
  "spaniel welsh": { name: "威尔士西班牙猎犬", normalWeightRange: [15, 20] },
  "spitz indian": { name: "印度尖嘴犬", normalWeightRange: [15, 25] },
  "spitz japanese": { name: "日本尖嘴犬", normalWeightRange: [5, 10] },
  "springer english": { name: "英国史宾格犬", normalWeightRange: [20, 25] },
  "terrier american": { name: "美国梗犬", normalWeightRange: [5, 7] },
  "terrier australian": { name: "澳大利亚梗犬", normalWeightRange: [5, 7] },
  "terrier bedlington": { name: "贝灵顿梗", normalWeightRange: [8, 10] },
  "terrier border": { name: "边境梗", normalWeightRange: [5, 7] },
  "terrier cairn": { name: "凯恩梗", normalWeightRange: [6, 7] },
  "terrier dandie": { name: "丹迪丁蒙梗", normalWeightRange: [8, 11] },
  "terrier fox": { name: "猎狐梗", normalWeightRange: [7, 9] },
  "terrier irish": { name: "爱尔兰梗", normalWeightRange: [11, 12] },
  "terrier kerryblue": { name: "凯利蓝梗", normalWeightRange: [15, 18] },
  "terrier lakeland": { name: "湖畔梗", normalWeightRange: [7, 8] },
  "terrier norfolk": { name: "诺福克梗", normalWeightRange: [5, 6] },
  "terrier norwich": { name: "诺维奇梗", normalWeightRange: [5, 6] },
  "terrier patterdale": { name: "帕特代尔梗", normalWeightRange: [5, 6] },
  "terrier russell": { name: "罗素梗", normalWeightRange: [4, 7] },
  "terrier scottish": { name: "苏格兰梗", normalWeightRange: [8, 10] },
  "terrier sealyham": { name: "西里汉梗", normalWeightRange: [8, 9] },
  "terrier silky": { name: "丝毛梗", normalWeightRange: [4, 5] },
  "terrier tibetan": { name: "西藏梗", normalWeightRange: [4, 7] },
  "terrier toy": { name: "玩具梗", normalWeightRange: [2, 3] },
  "terrier welsh": { name: "威尔士梗", normalWeightRange: [9, 10] },
  "terrier westhighland": { name: "西高地白梗", normalWeightRange: [7, 10] },
  "terrier wheaten": { name: "软毛麦色梗", normalWeightRange: [14, 18] },
  "terrier yorkshire": { name: "约克夏梗", normalWeightRange: [2, 3] },
  "waterdog spanish": { name: "西班牙水犬", normalWeightRange: [14, 22] },
  "wolfhound irish": { name: "爱尔兰猎狼犬", normalWeightRange: [45, 55] },
};

export interface DogTreeNode {
  value: string;
  title: string;
  searchValue: string;
  normalWeightRange?: [number, number];
  [key: string]: any;
  children?: DogTreeNode[];
}
export interface DogFormDetails {
  breedType: string;
  breedName: string;
  dogName: string;
  startDate: string;
  endDate: string;
  weight?: string | number;
  dailyPrice?: number;
  ownerName?: string;
  contactNo?: string;
  notes: string[];
  tourList?: DogTourList[];
  dogLogId?: string;
}

export interface DogTourList {
  startDate: string;
  endDate: string;
  dailyPrice: number;
  weight: number;
  notes: string[];
  checked: boolean;
  [key: string]: any;
}

export interface NoteDetails {
  showAddNoteModal: boolean;
  content: string;
  isEdit: boolean;
  editIndex: number;
}

export interface DogInfoCreate {
  breedType: string;
  breedName: string;
  dogName: string;
  weight: number;
  alive: boolean;
  ownerId?: string;
  uid?: string;
  desex?: boolean;
  sex?: number;
}

export interface DogInfo extends DogInfoCreate {
  ownerId: string;
  uid: string;
  desex: boolean;
  sex: number;
}

export interface DogListInfo {
  dog: DogInfoCreate;
  key: string;
  label: string;
}
