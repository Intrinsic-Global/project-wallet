export const prepareSplitObjects = (splitAccounts, split) => {
  if (splitAccounts === undefined) {
    return [];
  }
  return splitAccounts.map((x, i) => {
    return {
      account: x,
      split: split && Number(split[i]),
    };
  });
};

const indexToColor = index => {
  const colors = {
    0: "#22577a",
    1: "#38a3a5",
    2: "#57cc99",
    3: "#80ed99",
    4: "#38a3a5",
    5: "#c7f9cc",
  };
  return colors[index % Object.keys(colors).length];
};

export const splitPercentFormatter = value => {
  return `${value / 100}%`;
};

export const formatPieChartData = splitObjects => {
  const result = splitObjects.map((x, i) => {
    return { title: x.account, value: x.split, color: indexToColor(i) };
  });
  return result;
};
