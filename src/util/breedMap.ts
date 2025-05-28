import {
  breedMap,
  BreedInfo,
  DogSize,
  DogTreeNode,
} from "@/Interface/dogInterface";

export const SIZE_PRICE_MAP: Record<DogSize, number> = {
  [DogSize.X_SMALL]: 30,
  [DogSize.SMALL]: 30,
  [DogSize.MEDIUM]: 35,
  [DogSize.LARGE]: 40,
  [DogSize.X_LARGE]: 50,
};

export interface DogStatus {
  isLoadingDogImg: boolean;
  isDogInWeightRange: boolean;
  isDogOverWeight: boolean;
  showImg: boolean;
  imgUrl: string;
}

export const transformBreedMapToTree = (
  isChinese: boolean = true
): DogTreeNode[] => {
  const result: DogTreeNode[] = [];
  const parentMap: Record<
    string,
    { node: DogTreeNode; childrenKeys: string[] }
  > = {};

  // 第一次遍历：处理所有简单品种和创建父节点
  Object.entries(breedMap).forEach(([key, breedInfo]) => {
    const parts = key.split(" ");
    if (parts.length === 1) {
      // 简单品种直接添加到结果中
      result.push({
        value: isChinese ? breedInfo.name : key,
        title: isChinese ? breedInfo.name : key,
        searchValue: key,
        originalKey: key,
        normalWeightRange: breedInfo.normalWeightRange,
      });
    } else {
      // 复合品种，创建父节点（如果还不存在）
      const [parent] = parts;
      if (!parentMap[parent]) {
        parentMap[parent] = {
          node: {
            value: parent,
            title: parent, // 初始使用英文key作为标题
            searchValue: parent,
            originalKey: parent,
            children: [],
          },
          childrenKeys: [],
        };
      }
      parentMap[parent].childrenKeys.push(key);
    }
  });

  // 处理父节点和子节点关系
  Object.entries(parentMap).forEach(([parent, { node, childrenKeys }]) => {
    if (childrenKeys.length === 1) {
      // 只有一个子节点：提升子节点为父节点
      const [onlyChildKey] = childrenKeys;
      const breedInfo = breedMap[onlyChildKey];
      result.push({
        value: isChinese ? breedInfo.name : onlyChildKey,
        title: isChinese ? breedInfo.name : onlyChildKey,
        searchValue: onlyChildKey,
        originalKey: onlyChildKey,
        normalWeightRange: breedInfo.normalWeightRange,
      });
    } else {
      // 多个子节点：提取公共中文名称部分
      const childrenNames = childrenKeys.map((key) => breedMap[key].name);
      const commonChineseName = findCommonChineseSuffix(childrenNames);

      // 设置父节点标题
      node.title = isChinese
        ? commonChineseName
          ? `${commonChineseName} (${childrenKeys.length}种)`
          : `${parent} (${childrenKeys.length}种)`
        : `${parent} (${childrenKeys.length} varieties)`;

      // 添加子节点
      childrenKeys.forEach((childKey) => {
        const breedInfo = breedMap[childKey];
        node.children!.push({
          value: isChinese ? breedInfo.name : childKey,
          title: isChinese
            ? breedInfo.name
            : childKey.replace(parent, "").trim(),
          searchValue: childKey,
          originalKey: childKey,
          normalWeightRange: breedInfo.normalWeightRange,
        });
      });

      result.push(node);
    }
  });

  return result;
};

const findCommonChineseSuffix = (names: string[]): string | null => {
  if (names.length === 0) return null;

  // 找出所有可能的公共后缀
  const first = names[0];
  let maxCommonLength = 0;

  for (let i = 1; i <= first.length; i++) {
    const suffix = first.slice(first.length - i);
    if (names.every((name) => name.endsWith(suffix))) {
      maxCommonLength = i;
    } else {
      break;
    }
  }

  return maxCommonLength > 0
    ? first.slice(first.length - maxCommonLength)
    : null;
};

export const getBreedInfo = (
  nameOrKey: string
): (BreedInfo & { size?: DogSize; dailyPrice?: number }) | undefined => {
  // 先尝试作为key查找
  let breedInfo: BreedInfo | undefined;
  let searchName: string | undefined;

  if (breedMap[nameOrKey]) {
    breedInfo = breedMap[nameOrKey];
    searchName = nameOrKey;
  } else {
    // 再尝试作为name查找
    const entry = Object.entries(breedMap).find(
      ([_, info]) => info.name === nameOrKey
    );
    if (entry) {
      breedInfo = entry[1];
      searchName = entry[0];
    }
  }

  if (!breedInfo) return undefined;

  // 计算平均体重
  const [minWeight, maxWeight] = breedInfo.normalWeightRange;
  const avgWeight = (minWeight + maxWeight) / 2;

  // 根据平均体重确定size
  let size: DogSize;
  if (avgWeight < 5) {
    size = DogSize.X_SMALL;
  } else if (avgWeight < 15) {
    size = DogSize.SMALL;
  } else if (avgWeight < 30) {
    size = DogSize.MEDIUM;
  } else if (avgWeight < 50) {
    size = DogSize.LARGE;
  } else {
    size = DogSize.X_LARGE;
  }

  // 获取对应价格
  const dailyPrice = SIZE_PRICE_MAP[size];

  return {
    ...breedInfo,
    searchName,
    size,
    dailyPrice,
  };
};
