interface GeneralLanguage {
  or: string;
  cancel: string;
  ok: string;
  submit: string;
  add: string;
  edit: string;
  delete: string;
  update: string;
  updating: string;
  notice: string;
  later: string;
  creating: string;
  unknown: string;
  loading: string;
  view: string;
  details: string;
  notNow: string;
  day: string;
  days: string;
}

interface AuthLanguage {
  email: string;
  password: string;
  confirmPassword: string;
  signIn: string;
  signOut: string;
  create: string;
  createNewUser: string;
  loginViaEmail: string;
  errorTitle: string;
  loginFailMsg: string;
  createUserFailMsg: string;
  userName: string;
}

interface RouteLanguage {
  indexPage: string;
  introPage: string;
  ownersPage: string;
  usersPage: string;
  toursPage: string;
}

interface UserListLanguage {
  editUserRole: string;
  confirmChangeRolePreText: string;
  confirmChangeRoleMidText: string;
  confirmChangeRoleEndText: string;
  confirmChangeRoleNoticeText: string;
}

interface RoleLanguage {
  admin: string;
  developer: string;
  dogOwner: string;
  visitor: string;
}

interface TableLanguage {
  id: string;
  role: string;
  mobileDevices: string;
  receiveNotifications: string;
  name: string;
  contactNo: string;
  actions: string;
}

interface ActionLanguage {
  addDog: string;
  editDogOwner: string;
  removeDogOwner: string;
  confirmRemoveDogOwnerText: string;
  editDog: string;
  removeDog: string;
  confirmRemoveDogText: string;
}

interface DogOwnerLanguage {
  addDogOwner: string;
  ownerInfo: string;
  enterNameText: string;
  createTourUnderOwner: string;
  referenceNoCopySuccess: string;
  referenceNoCopyFailed: string;
  generateAndCopyRefNo: string;
}

interface DogLanguage {
  dogInfo: string;
  dogName: string;
  enterDogName: string;
  breed: string;
  selectBreed: string;
  watchMore: string;
  sex: string;
  weight: string;
  weightUnit: string;
  enterValidWeightNotice: string;
  overweight: string;
  underweight: string;
  avgWeightGap: string;
  genderMale: string;
  genderUnknown: string;
  genderFemale: string;
  desexStatus: string;
  desex: string;
  nonDesex: string;
  dogSizeExtraSmall: string;
  dogSizeSmall: string;
  dogSizeMedium: string;
  dogSizeLarge: string;
  dogSizeExtraLarge: string;
}

interface CalendarLanguage {
  addTour: string;
  editTour: string;
  removeAndBackupTour: string;
  displayCalendar: string;
  displayLine: string;
  dogAmount: string;
  newTourAmount: string;
  finishTourAmount: string;
  noTourText: string;
  monthlyMax: string;
  monthlyMin: string;
  monthlyNewTours: string;
  monthlyFinishTours: string;
  generalView: string;
  tourId: string;
  tourPeriod: string;
  totalEstimatePrice: string;
}

interface DogTourLanguage {
  selectDogOwner: string;
  anonymous: string;
  noSelectedOwner: string;
  sameTourDate: string;
  startDate: string;
  endDate: string;
  includeInTour: string;
  removeFromTour: string;
  dateRange: string;
  dailyFee: string;
  notes: string;
  removeNote: string;
  confirmRemoveNote: string;
  noNotesText: string;
  addNotePlaceholder: string;
  addNote: string;
  deleteTourTitle: string;
  confirmDeleteTour: string;
  markAsFinish: string;
  tourFinished: string;
}

type Language = GeneralLanguage &
  AuthLanguage &
  RouteLanguage &
  UserListLanguage &
  RoleLanguage &
  TableLanguage &
  ActionLanguage &
  DogOwnerLanguage &
  DogLanguage &
  CalendarLanguage &
  DogTourLanguage;

export const enLanguage: Language = {
  or: "OR",
  cancel: "Cancel",
  ok: "OK",
  submit: "Submit",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  update: "Update",
  updating: "Updating",
  notice: "Notice",
  later: "Later",
  creating: "Creating",
  unknown: "Unknown",
  loading: "Loading",
  view: "View",
  details: "Details",
  notNow: "Not Now",
  day: "Day",
  days: "Days",

  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
  signIn: "Sign In",
  signOut: "Log Out",
  create: "Create",
  createNewUser: "Create New User",
  loginViaEmail: "Log In Via Email",
  errorTitle: "Error",
  loginFailMsg: "Log In Failed",
  createUserFailMsg: "Create User Failed",
  userName: "User Name",

  indexPage: "Calendar",
  introPage: "Home",
  ownersPage: "Owners",
  usersPage: "Users",
  toursPage: "Tours",

  editUserRole: "Change User Role",
  confirmChangeRolePreText: "Are you sure to change user role from",
  confirmChangeRoleMidText: "to",
  confirmChangeRoleEndText: "",
  confirmChangeRoleNoticeText:
    "Notice: Change user role MAY CAUSE change of user permission!",

  admin: "ADMIN",
  developer: "DEVELOPER",
  dogOwner: "DOG OWNER",
  visitor: "VISITOR",

  id: "ID",
  role: "Role",
  mobileDevices: "Mobile Devices",
  receiveNotifications: "Receive Notifications",
  name: "Name",
  contactNo: "Contact No.",
  actions: "Actions",

  addDog: "Add Dog",
  editDogOwner: "Edit Dog Owner",
  removeDogOwner: "Remove Dog Owner",
  confirmRemoveDogOwnerText: "Are you sure to remove this dog owner?",
  editDog: "Edit Dog",
  removeDog: "Remove Dog",
  confirmRemoveDogText: "Are you sure to remove this dog?",

  addDogOwner: "Add Dog Owner",
  ownerInfo: "Owner Info",
  enterNameText: "Please enter name",
  createTourUnderOwner: "Create dog sitting for this owner now?",
  referenceNoCopySuccess: "Reference number copied!",
  referenceNoCopyFailed: "Failed copy reference number.",
  generateAndCopyRefNo: "Generate and copy reference code",

  dogInfo: "Dog Info",
  dogName: "Dog Name",
  enterDogName: "Please enter dog name",
  breed: "Breed",
  selectBreed: "Select Breed",
  watchMore: "Watch More",
  sex: "Sex",
  weight: "Weight",
  weightUnit: "kg",
  enterValidWeightNotice: "Please enter a valid weight value",
  overweight: "Dog is a bit Overweight",
  underweight: "Dog is a bit Underweight",
  avgWeightGap: "Avg. Weight between: ",
  genderMale: "Male",
  genderUnknown: "Unknown",
  genderFemale: "Female",
  desexStatus: "Desex Status",
  desex: "Desex",
  nonDesex: "Non-Desex",
  dogSizeExtraSmall: "X_Small Dog",
  dogSizeSmall: "Small Dog",
  dogSizeMedium: "Medium Dog",
  dogSizeLarge: "Large Dog",
  dogSizeExtraLarge: "X_Large Dog",

  addTour: "Add Tour",
  editTour: "Edit Tour",
  removeAndBackupTour: "Backup and remove finished tours",
  displayCalendar: "Calendar Display",
  displayLine: "Line Guide Display",
  dogAmount: "Dog amount",
  newTourAmount: "New",
  finishTourAmount: "Finish",
  noTourText: "No tours...",
  monthlyMax: "Max this month",
  monthlyMin: "Min this month",
  monthlyNewTours: "New this month",
  monthlyFinishTours: "Finish this month",
  generalView: "General View",
  tourId: "Tour ID",
  tourPeriod: "Tour period",
  totalEstimatePrice: "Total price (estimate)",

  selectDogOwner: "Select a dog owner",
  anonymous: "anonymous",
  noSelectedOwner: "No selected dog owner yet",
  sameTourDate: "Same Tour Date",
  startDate: "Start Date",
  endDate: "End Date",
  includeInTour: "Add to this tour",
  removeFromTour: "Remove from this tour",
  dateRange: "Date Range",
  dailyFee: "Daily Charge",
  notes: "Notes",
  removeNote: "Remove Note",
  confirmRemoveNote: "Are you sure to remove this note?",
  noNotesText: "No added notes yet, add content below",
  addNotePlaceholder: "Please enter note content",
  addNote: "Add Note",
  deleteTourTitle: "Delete tour",
  confirmDeleteTour: "Are you sure to delete this tour?",
  markAsFinish: "Mark tour finish",
  tourFinished: "Finished",
};

export const zhLanguage: Language = {
  or: "或者",
  cancel: "取消",
  ok: "确认",
  submit: "提交",
  add: "添加",
  edit: "修改",
  delete: "删除",
  update: "更新",
  updating: "更新中",
  notice: "提示",
  later: "再等等",
  creating: "创建中",
  unknown: "未知",
  loading: "加载中",
  view: "查看",
  details: "详情",
  notNow: "暂时不",
  day: "天",
  days: "天",

  email: "邮箱",
  password: "密码",
  confirmPassword: "确认密码",
  signIn: "登录",
  signOut: "登出",
  create: "创建",
  createNewUser: "创建新用户",
  loginViaEmail: "通过邮箱登录",
  errorTitle: "错误",
  loginFailMsg: "登录失败",
  createUserFailMsg: "用户创建失败",
  userName: "用户名",

  indexPage: "日历",
  introPage: "首页",
  ownersPage: "宠物主人",
  usersPage: "用户管理",
  toursPage: "旅行信息",

  editUserRole: "修改用户身份",
  confirmChangeRolePreText: "确定要将用户的身份从",
  confirmChangeRoleMidText: "更改为",
  confirmChangeRoleEndText: "吗",
  confirmChangeRoleNoticeText:
    "请注意：变更用户身份有可能会导致用户权限发生更改！",

  admin: "管理员",
  developer: "开发员",
  dogOwner: "宠物主人",
  visitor: "游客",

  id: "ID",
  role: "身份",
  mobileDevices: "移动设备数",
  receiveNotifications: "接收手机提示",
  name: "姓名",
  contactNo: "联系电话",
  actions: "操作",

  addDog: "添加狗狗",
  editDogOwner: "修改狗狗主人",
  removeDogOwner: "删除狗狗主人",
  confirmRemoveDogOwnerText: "你确定要删除这个狗狗主人么?",
  editDog: "修改狗狗",
  removeDog: "删除狗狗",
  confirmRemoveDogText: "你确定要删除这个狗狗么?",

  addDogOwner: "添加狗狗主人",
  ownerInfo: "主人信息",
  enterNameText: "请输入姓名",
  createTourUnderOwner: "您要现在为狗狗主人创建寄养吗？",
  referenceNoCopySuccess: "宠物主人对应号复制成功！",
  referenceNoCopyFailed: "宠物主人对应号复制失败。",
  generateAndCopyRefNo: "生成并复制对应号",

  dogInfo: "狗狗信息",
  dogName: "狗狗名字",
  enterDogName: "请输入狗狗的名字!",
  breed: "犬种",
  selectBreed: "选择犬种",
  watchMore: "看其他",
  sex: "性别",
  weight: "体重",
  weightUnit: "公斤",
  enterValidWeightNotice: "请输入有效的体重值",
  overweight: "狗狗有些超重",
  underweight: "狗狗有些瘦",
  avgWeightGap: "平均体重区间: ",
  genderMale: "公",
  genderUnknown: "性别未知",
  genderFemale: "母",
  desexStatus: "绝育状态",
  desex: "已绝育",
  nonDesex: "未绝育",
  dogSizeExtraSmall: "超小型犬",
  dogSizeSmall: "小型犬",
  dogSizeMedium: "中型犬",
  dogSizeLarge: "大型犬",
  dogSizeExtraLarge: "超大型犬",

  addTour: "添加寄养",
  editTour: "修改寄养",
  removeAndBackupTour: "删除并备份已完成的寄养",
  displayCalendar: "日历显示",
  displayLine: "时间线显示",
  dogAmount: "狗狗数量",
  newTourAmount: "新增",
  finishTourAmount: "接走",
  noTourText: "没有狗狗...",
  monthlyMax: "本月峰值",
  monthlyMin: "本月低谷",
  monthlyNewTours: "本月新狗狗",
  monthlyFinishTours: "本月接走狗狗",
  generalView: "总览",
  tourId: "寄养ID",
  tourPeriod: "总寄养天数",
  totalEstimatePrice: "总金额（预估）",

  selectDogOwner: "选择一位寄养者",
  anonymous: "匿名",
  noSelectedOwner: "还没有寄养者",
  sameTourDate: "同时寄取",
  startDate: "起始时间",
  endDate: "结束时间",
  includeInTour: "添加本次寄养",
  removeFromTour: "移除本次寄养",
  dateRange: "接送日期",
  dailyFee: "单日寄养费",
  notes: "备忘录",
  removeNote: "删除备忘录",
  confirmRemoveNote: "你确定要删除这条备忘录吗？",
  noNotesText: "未添加备忘录，在下面输入内容并添加",
  addNotePlaceholder: "输入备忘录内容...",
  addNote: "添加备忘录",
  deleteTourTitle: "删除寄养",
  confirmDeleteTour: "确定删除本次寄养？",
  markAsFinish: "标记寄养完成",
  tourFinished: "寄养完成",
};
