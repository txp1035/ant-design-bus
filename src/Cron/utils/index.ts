import parser from 'cron-parser';

export function checkFrequency(params: any[], type: any) {
  let isAdd = true;
  params.forEach((item: any) => {
    if (item === '') {
      isAdd = false;
    }
  });
  if (params.length >= 5 && type === 'linux') {
    isAdd = false;
  }
  if (params.length >= 5 && type === 'spring') {
    isAdd = false;
  }
  if (params.length >= 6 && type === 'quartz') {
    isAdd = false;
  }
  return isAdd;
}
export function getSchedulingTime(time: string, times: number = 5): string[] {
  let timeStr = time;
  const timeArr = time.split(' ');
  if (timeArr.length === 7) {
    timeArr.pop();
    timeStr = timeArr.join(' ');
  }
  try {
    const interval = parser.parseExpression(timeStr);
    const arr = [];
    for (let index = 0; index < times; index += 1) {
      arr[index] = interval.next().toString();
    }
    return arr;
  } catch (err) {
    return ['error'];
  }
}
