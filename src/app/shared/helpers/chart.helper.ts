import {NumberConstant} from '../../constant/utility/number.constant';
import {DashboardConstant} from '../../constant/dashboard/dashboard.constant';
import {TranslateService} from '@ngx-translate/core';
import {ChatConstant} from '../../constant/chat/chat.constant';
import {Language, Languages, englishMonthNames, frenshMonthNames, Labels} from '../../constant/shared/services.constant';
import {Colorset} from '../../dashboard/Colorset';


const chartList = new Array<any>();


export function pieChartOption(title: string, pieData: any, rankCriteria: boolean, userCurrencyCode: any, userCurrencySymbole: any,
                               valueApperance: boolean, radius: any): any {
  const valuePostfix = (rankCriteria) ? DashboardConstant.WIHTE_SPACE + userCurrencyCode : '';
  const option = ({
    title: {
      show: false,
      text: title
    },
    grid: {
      containLabel: true,
      right: '0%',
      left: '0%',
      bottom: '0%',
      top: '0%'
    },
    legend: {
      show: 'true',
      orient: 'vertical',
      left: '0%',
      top: '0%',
      type: 'scroll',
      formatter(params: string) {
        if (params.length < NumberConstant.FIFTEEN) {
          return params;
        } else if (params.indexOf('-') > NumberConstant.MINUS_ONE && params.indexOf('-') !== params.lastIndexOf('-')) {
          return params.substring(params.indexOf('-') + NumberConstant.ONE, params.lastIndexOf('-'));
        } else {
          return params.substr(NumberConstant.ZERO, NumberConstant.FIFTEEN) + '...';
        }
      },
      tooltip: {
        show: true,
        confine: true
      }
    },
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter(args) {
        return `${args.marker} <b>TOP ` + (args.dataIndex + 1) + '</b> <br/>' + args.name + ' : ' +
          Number(args.value).toLocaleString('fr-FR').concat(' ', valuePostfix) + ' (' + args.percent + '%)';
      }
    },
    series: [
      {
        name: 'Top ' + pieData.length,
        color: Colorset.colorsets.cs4.allChart,
        type: 'pie',
        radius: radius,
        center: ['70%', '50%'],
        itemStyle: {
          normal: {
            label: {
              show: true,
              fontWeight: 'bolder',
              formatter(params) {
                if (valueApperance && rankCriteria) { // Value && Amnt
                  params = params.value.toString() + '.';
                  if (params.substring(NumberConstant.ZERO, params.indexOf('.')).length > NumberConstant.THREE) {
                    return params.substring(
                      NumberConstant.ZERO, params.indexOf('.') - NumberConstant.THREE) + 'K' + valuePostfix;
                  } else {
                    return params.substring(NumberConstant.ZERO, params.indexOf('.')) + valuePostfix;
                  }
                } else if (valueApperance && !rankCriteria) { // Value && Qty
                  return params.value + valuePostfix;
                } else { //  Percent && Qty || Percent && Amnt
                  return params.percent + '%';
                }
              }
            },
            labelLine: {
              show: true,
              length: NumberConstant.FIVE,
              length2: NumberConstant.THREE,
              shadowBlur: NumberConstant.ONE
            },
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          }
        },
        data: pieData,
        avoidLabelOverlap: true,
      }],
  });
  return option;
}

export function totalWorkDaysAndDaysOffPieChartOption(pieData: any, radius: any, translate: TranslateService): any {
  const option = ({
    grid: {
      containLabel: true,
      right: '0%',
      left: '0%',
      bottom: '0%',
      top: '0%'
    },
    legend: {
      show: 'true',
      orient: 'vertical',
      left: '0%',
      top: '0%',
      type: 'scroll',
      formatter(params: string) {
        return `${translate.instant(params)}`;
      },
      tooltip: {
        show: true,
        confine: true
      }
    },
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter(args) {
        return `${args.marker} ` + `${translate.instant(args.name)}` + Number(args.value);
      }
    },
    series: [{
      color: ['#edb046', '#626ef2'],
      type: 'pie',
      radius: radius,
      center: ['70%', '50%'],
      itemStyle: {
        normal: {
          label: {
            show: true,
            fontWeight: 'bolder',
            formatter(params) {
              return params.value.toString() + ' ' + `${translate.instant(DashboardConstant.DAYS)}`;
            }
          },
          labelLine: {
            show: true,
            length: NumberConstant.FIVE,
            length2: NumberConstant.THREE,
            shadowBlur: NumberConstant.ONE
          },
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        }
      },
      data: pieData,
      avoidLabelOverlap: true
    }],
  });
  return option;
}

export function barChartOption(title: string, purchasesData: any[], salesData: any[], userCurrencyCode: any, userCurrencySymbole: any,
                               LabelsName: string[], language: string): any {
  let seriesParameter = [];
  let xAxisParameter = [];
  let yAxisParameter = [];
  const LabelZeroData = [];
  const LabelOneData = [];
  if (purchasesData) {
    purchasesData.forEach(purchase => LabelOneData.push(purchase.invoiceAmount));
    salesData.forEach(sale => LabelZeroData.push(sale.invoiceAmount));
  } else {
    salesData.forEach(sale => {
      LabelZeroData.push(sale.invoiceAmount);
      LabelOneData.push(sale.remainingAmount);
    });
  }
  seriesParameter = [
    {
      name: LabelsName[NumberConstant.ZERO],
      type: 'bar',
      data: LabelZeroData,
      cursor: 'auto',
      barWidth: '15%',
      itemStyle: {
        normal: {
          borderRadius: 5,
          borderColor: Colorset.colorsets.cs4.allChartshadaw[NumberConstant.ZERO],
          borderWidth: 5
        }
      }
    },
    {
      name: LabelsName[NumberConstant.ONE],
      type: 'bar',
      data: LabelOneData,
      barWidth: '15%',
      cursor: 'auto',
      itemStyle: {
        normal: {
          borderRadius: 5,
          borderColor: Colorset.colorsets.cs4.allChartshadaw[NumberConstant.ONE],
          borderWidth: 5
        }
      }
    }
  ];
  xAxisParameter = [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0.7)'
        }
      },
      splitLine: {
        show: false
      },
      data: fromMonthNumberToMonthName(salesData, language)
    }
  ];
  yAxisParameter = [
    {
      type: 'log',
      name: userCurrencyCode,
      axisPointer: {
        show: false
      },
      minorTick: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0.7)'
        }
      },
      axisLabel: {
        formatter: function (value: number) {
          const val = value.toString();
          if (val.length > NumberConstant.THREE) {
            return val.substring(NumberConstant.ZERO, val.length - NumberConstant.THREE) + 'K';
          } else {
            return val;
          }
        }
      }
    },
  ];
  const option = ({
    color: Colorset.colorsets.cs4.allChart,
    title: {
      show: false,
      text: title
    },
    legend: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (args) => {
        let tooltip = `<p>${args[NumberConstant.ZERO].axisValue}</p> `;
        args.forEach(({marker, seriesName, value}) => {
          value = (value) ? Number(value).toLocaleString('fr-FR').concat(' ', userCurrencySymbole) : NumberConstant.ZERO;
          tooltip += `<p>${marker} ${seriesName} : ${value}</p>`;
        });
        return tooltip;
      }
    },
    grid: {
      containLabel: true,
      right: '3%',
      left: '3%',
      bottom: '0%'
    },
    xAxis: xAxisParameter,
    yAxis: yAxisParameter,
    series: seriesParameter
  });
  return option;
}

export function familyBarChartOption(title: string, Ddata: any[], numberOfData: number, rankCriteria: boolean, userCurrencyCode: any,
                                     userCurrencySymbole: any, translate: TranslateService): any {
  const widthUnit = NumberConstant.ONE_HUNDRED / numberOfData;
  const valuePostfix = (rankCriteria) ? userCurrencyCode : '';
  const seriesParameter: Array<{
    data: [{ name: string, value: number }],
    label: {
      show: boolean,
      position: string,
      formatter: string,
      offset: number[],
      color: string,
      rotate: string,
      fontSize: string
    },
    itemStyle: {
      normal: {
        color: any,
        borderRadius: any,
        borderWidth: any
      },
    },
    type: string,
    barGap: number,
    barWidth: string,
    cursor: string,
    xAxisIndex: number,
    yAxisIndex: number,
  }> = Array();
  let xAxisParameter = [];
  const xData = [];
  let yAxisParameter = [];
  const yData = [];

  Ddata['data'].forEach(utilData => {
    xData.push(utilData.code);
    yData.push(utilData.value);
  });

  const seriesParam = [{
    data: yData,
    label:
      {
        show: false,
        position: 'top',
        color: '#555',
      },
    barWidth: '45%',
    itemStyle: {
      normal: {
        color: (params) => {
          return Colorset.colorsets.cs4.allChart[Ddata['data'][params.dataIndex].familyIndex - NumberConstant.ONE];
        },
        borderRadius: 5,
        borderWidth: 5
      }
    },
    type: 'bar',
    cursor: 'auto',
    xAxisIndex: NumberConstant.ZERO,
    yAxisIndex: NumberConstant.ZERO,
  }];

  Ddata['familyData'].forEach((family) => seriesParameter.push({
    data: [{name: family.name.split(' ').join('\n'), value: 0.1}],
    label: {
      show: false,
      position: 'inside',
      formatter: '{b}\n' + Number(family.value).toLocaleString('fr-FR').concat('\n', valuePostfix),
      offset: [NumberConstant.ZERO, NumberConstant.TEN],
      color: '#000',
      rotate: '25',
      fontSize: '90%',
    },
    itemStyle: {
      normal: {
        color: (params) => {
          return Colorset.colorsets.cs4.familyChart[params.componentIndex - NumberConstant.ONE];
        },
        borderRadius: 5,
        borderWidth: 5
      }
    },
    type: 'bar',
    barGap: NumberConstant.ZERO,
    barWidth: widthUnit * family.items + '%',
    cursor: 'auto',
    xAxisIndex: NumberConstant.ONE,
    yAxisIndex: NumberConstant.ONE
  }));

  xAxisParameter = [{
    type: 'category',
    data: xData,
    gridIndex: NumberConstant.ZERO,
    position: 'top',
    axisLabel: {
      color: '#000',
      rotate: '-25'
    },
    axisLine: {
      lineStyle: {
        color: '#e7e7e7'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#e7e7e7'
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed'
      }
    },
    zlevel: NumberConstant.TWO
  }, {
    type: 'category',
    gridIndex: NumberConstant.ONE,
    axisLine: {
      show: false
    },
    zlevel: NumberConstant.ONE
  }];
  yAxisParameter = [{
    type: 'log',
    name: (rankCriteria) ? userCurrencyCode : DashboardConstant.PIECES,
    nameTextStyle: {
      fontSize: NumberConstant.TEN,
      fontWeight: 'bolder'
    },
    nameGap: NumberConstant.THIRTY,
    gridIndex: NumberConstant.ZERO,
    axisLabel: {
      color: '#333',
      formatter: function (value: number) {
        const val = value.toString();
        if (val.length > NumberConstant.THREE) {
          return val.substring(NumberConstant.ZERO, val.length - NumberConstant.THREE) + 'K';
        } else {
          return val;
        }
      }
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    minorTick: {
      show: true
    },
    minorSplitLine: {
      show: true

    },
    axisLine: {
      lineStyle: {
        color: '#000'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#e0F'
      }
    }
  }, {
    type: 'value',
    gridIndex: NumberConstant.ONE,
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  }];

  const option = ({
    color: Colorset.colorsets.cs4.allChart,
    title: {
      show: false,
      text: title
    },
    legend: {},
    tooltip: {
      trigger: 'item',
      confine: true,
      axisPointer: {
        type: 'shadow'
      },
      formatter: (args) => {
        let tooltip: string;
        if (args.seriesIndex === NumberConstant.ZERO) {
          const value = Number(args.value).toLocaleString('fr-FR').concat(' ', valuePostfix);
          tooltip = `<p>${args.marker}  ${translate.instant(DashboardConstant.FAMILY)}: ` +
            Ddata['data'][`${args.dataIndex}`].familyName +
            `<br> ${translate.instant(DashboardConstant.ITEM_CODE)}: ${args.name}
                        <br> ${translate.instant(DashboardConstant.ITEM_DESIGNATION)}: `
            + Ddata['data'][args.dataIndex].description +
            `<br> ${translate.instant(DashboardConstant.VALUE)}: ${value}</br>`;
        } else {
          tooltip = `<p>${args.marker} ${args.name}<br> Total: ` +
            Number(Ddata['familyData'][`${args.componentIndex - NumberConstant.ONE}`].value)
              .toLocaleString('fr-FR').concat(' ', valuePostfix) + '</p>';
        }
        return tooltip;
      }
    },
    grid: [{
      top: NumberConstant.FIFTY,
      bottom: NumberConstant.ELEVEN,
      left: '20%',
      right: '10%'
    },
      {
        height: NumberConstant.TEN,
        bottom: NumberConstant.ZERO,
        left: '20%',
        right: '10%'
      }
    ],
    xAxis: xAxisParameter,
    yAxis: yAxisParameter,
    series: seriesParam.concat(seriesParameter)
  });
  return option;
}

export function familyHorizontalBarChartOption(title: string, Ddata: any[], numberOfData: number, rankCriteria: boolean,
                                               userCurrencyCode: any, userCurrencySymbole: any, translate: TranslateService): any {
  const widthUnit = NumberConstant.ONE_HUNDRED / numberOfData;
  const valuePostfix = (rankCriteria) ? userCurrencyCode : '';
  const seriesParameter: Array<{
    data: [{ name: string, value: number }],
    label: {
      show: boolean,
      position: string,
      formatter: string,
      offset: number[],
      color: string,
      rotate: string,
      fontSize: string
    },
    itemStyle: {
      normal: {
        color: any
      }
    },
    type: string,
    barGap: number,
    barWidth: string,
    cursor: string,
    xAxisIndex: number,
    yAxisIndex: number,
  }> = Array();
  let xAxisParameter = [];
  const xData = [];
  let yAxisParameter = [];
  const yData = [];

  Ddata['data'].forEach(utilData => {
    xData.push(utilData.code);
    yData.push(utilData.value);
  });

  const seriesParam = [{
    data: yData,
    label:
      {
        show: false,
        position: 'top',
        color: '#555',
      },
    itemStyle: {
      normal: {
        color: (params) => {
          return Colorset.colorsets.cs4.allChart[Ddata['data'][params.dataIndex].familyIndex - NumberConstant.ONE];
        }
      }
    },
    type: 'bar',
    cursor: 'auto',
    xAxisIndex: NumberConstant.ZERO,
    yAxisIndex: NumberConstant.ZERO,
  }];
  xAxisParameter = [{
    type: 'category',
    data: xData,
    gridIndex: NumberConstant.ZERO,
    position: 'top',
    axisLabel: {
      color: '#000',
      rotate: '-25'
    },
    axisLine: {
      lineStyle: {
        color: '#e7e7e7'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#e7e7e7'
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed'
      }
    },
    zlevel: NumberConstant.TWO
  }, {
    type: 'category',
    gridIndex: NumberConstant.ONE,
    axisLine: {
      show: false
    },
    zlevel: NumberConstant.ONE
  }];
  yAxisParameter = [{
    type: 'log',
    name: (rankCriteria) ? userCurrencyCode : DashboardConstant.PIECES,
    nameLocation: 'middle',
    nameTextStyle: {
      fontSize: NumberConstant.TEN,
      fontWeight: 'bolder'
    },
    nameGap: NumberConstant.THIRTY,
    gridIndex: NumberConstant.ZERO,
    axisLabel: {
      color: '#333',
      formatter: function (value: number) {
        const val = value.toString();
        if (val.length > NumberConstant.THREE) {
          return val.substring(NumberConstant.ZERO, val.length - NumberConstant.THREE) + 'K';
        } else {
          return val;
        }
      }
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    minorTick: {
      show: true
    },
    minorSplitLine: {
      show: true

    },
    axisLine: {
      lineStyle: {
        color: '#000'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#e0F'
      }
    }
  }, {
    type: 'value',
    gridIndex: NumberConstant.ONE,
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  }];

  const option = ({
    color: Colorset.colorsets.cs4.allChart,
    title: {
      show: false,
      text: title
    },
    legend: {},
    tooltip: {
      trigger: 'item',
      confine: true,
      axisPointer: {
        type: 'shadow'
      },
      formatter: (args) => {
        let tooltip: string;
        if (args.seriesIndex === NumberConstant.ZERO) {
          const value = Number(args.value).toLocaleString('fr-FR').concat(' ', valuePostfix);
          tooltip = `<p>${args.marker}  ${translate.instant(DashboardConstant.FAMILY)}: ` +
            Ddata['data'][`${args.dataIndex}`].familyName +
            `<br> ${translate.instant(DashboardConstant.ITEM_CODE)}: ${args.name}
                        <br> ${translate.instant(DashboardConstant.ITEM_DESIGNATION)}: `
            + Ddata['data'][args.dataIndex].description +
            `<br> ${translate.instant(DashboardConstant.VALUE)}: ${value}</br>`;
        } else {
          tooltip = `<p>${args.marker} ${args.name}<br> Total: ` +
            Number(Ddata['familyData'][`${args.componentIndex - NumberConstant.ONE}`].value)
              .toLocaleString('fr-FR').concat(' ', valuePostfix) + '</p>';
        }
        return tooltip;
      }
    },
    grid: [{
      containLabel: true,
      top: 20,
      bottom: 10,
    },
      {
        height: NumberConstant.TEN,
        bottom: NumberConstant.ZERO
      },

    ],
    xAxis: yAxisParameter,
    yAxis: xAxisParameter,
    series: seriesParam.concat(seriesParameter)
  });
  return option;
}

export function changeChartSize(widget): any {
  if (!chartList.includes(widget)) {
    chartList.push(widget);
  }
  window.onresize = function () {
    chartList.forEach(chart => {
      setLabel(chart);
    });
    if (document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON) &&
      document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.left >= NumberConstant.NINETY.toString()) {
      document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.left = (NumberConstant.NINETY +
        Math.floor(((Math.floor(window.innerWidth / NumberConstant.TEN) - NumberConstant.FIFTY)
          / Math.floor(window.innerWidth / NumberConstant.TEN)) * NumberConstant.TEN)) + '%';
    }
    if (document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON) &&
      document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.top >= NumberConstant.EIGHTY_EIGHT.toString()) {
      document.getElementById(ChatConstant.OPEN_CONTACT_FORM_BUTTON).style.top = (NumberConstant.NINETY +
        Math.floor(((Math.floor(window.innerHeight / NumberConstant.TEN) - NumberConstant.FIFTY) /
          Math.floor(window.innerHeight / NumberConstant.TEN)) * NumberConstant.TEN)) + '%';
    }
  };
  window.onclick = function () {
    chartList.forEach(chart => {
      setLabel(chart);
    });
  };
}

export function setLabel(chart) {
  const opt = chart.getOption();
  setTimeout(function () {
    chart.resize();
    if (chart._dom.id && chart[DashboardConstant.GET_WIDTH]() && document.getElementById(chart._dom.id)) {
      document.getElementById(chart._dom.id).style.height = (chart[DashboardConstant.GET_WIDTH]() * NumberConstant.HALF) + 'px';
    }
    if (opt.series[NumberConstant.ZERO]) {
      if (opt.series[NumberConstant.ZERO].type === DashboardConstant.PIE) {
        if (chart[DashboardConstant.GET_WIDTH]() <= 280) {
          opt.series[NumberConstant.ZERO].label.position = DashboardConstant.INSIDE;
        } else {
          opt.series[NumberConstant.ZERO].label.position = DashboardConstant.OUTSIDE;
        }
      } else if (opt.series[NumberConstant.ZERO].type === DashboardConstant.HEATMAP) {
        if (parseInt(document.getElementById(chart._dom.id).style.height, 10) * NumberConstant.HALF <= 160) {
          opt.visualMap[NumberConstant.ZERO].top = 'center';
        } else {
          opt.visualMap[NumberConstant.ZERO].top = '20%';
        }
      }
    }
    if (opt.series[NumberConstant.ZERO]) {
      if (opt.series[NumberConstant.ZERO].type !== 'tree') {
        chart.setOption(opt);
      }
    }
    chart.resize();
    if (chart._dom.id && chart._dom.id === DashboardConstant.STAFF_TURNOVER && chart[DashboardConstant.GET_WIDTH]()
      && document.getElementById(chart._dom.id)) {
      document.getElementById(chart._dom.id).style.height = '160px';
    }
  }, NumberConstant.TWO_HUNDRED);
}

export function fromMonthNumberToMonthName(listData, language: string): string[] | undefined {
  const listOfMonthName = [];
  if (language === Languages.EN.value) {
    listData.forEach(data => listOfMonthName.push(englishMonthNames[(data.month) - NumberConstant.ONE]));
  } else {
    listData.forEach(data => listOfMonthName.push(frenshMonthNames[(data.month) - NumberConstant.ONE]));
  }
  return listOfMonthName;
}

export function fromMonthNumberToMonthYearName(listData): string[] | undefined {
  const listOfMonthName = [];
  const lang = localStorage.getItem(Language);
  if (lang === Languages.EN.value) {
    listData.forEach(data => listOfMonthName.push(englishMonthNames[(data.month) - NumberConstant.ONE] + ' ' + data.year));
  } else {
    listData.forEach(data => listOfMonthName.push(frenshMonthNames[(data.month) - NumberConstant.ONE] + ' ' + data.year));
  }
  return listOfMonthName;
}

function fromMonthNumberListToMonthName(data: any, language: string) {
  const listOfMonthName = [];
  if (language === Languages.EN.value) {
    data.forEach(month => listOfMonthName.push(englishMonthNames[month]));
  } else {
    data.forEach(month => listOfMonthName.push(frenshMonthNames[month]));
  }
  return listOfMonthName;
}

export function InitLabels(language: string): any {
  if (language === Languages.EN.value) {
    return Labels.EN;
  } else {
    return Labels.FR;
  }

}

export function barChartOptions(title: string, purchasesData: any[], salesData: any[], userCurrencyCode: any, userCurrencySymbole: any,
                                LabelsName: string[]): any {
  let seriesParameter = [];
  let xAxisParameter = [];
  let yAxisParameter = [];
  const LabelZeroData = [];
  const LabelOneData = [];
  const LabelTwoData = [];

  salesData.sort((a: any, b: any) => (a.month > b.month) ? NumberConstant.ONE : NumberConstant.MINUS_ONE);

  salesData.forEach(sale => {
    LabelZeroData.push(sale.OrderCode);
    LabelOneData.push(sale.HtAmount);
    LabelTwoData.push(sale.TiersName);
  });

  seriesParameter = [
    {
      name: 'Montant HT',
      type: 'bar',
      data: LabelOneData,
      cursor: 'auto',
      label:
        {
          show: false,
          position: 'top',
          color: '#555',
        },
    },
    {
      name: 'Fournisseur',
      type: 'bar',
      data: LabelTwoData,
    }
  ];
  xAxisParameter = [
    {
      type: 'category',
      gridIndex: NumberConstant.ZERO,
      position: 'top',
      axisLabel: {
        color: '#000',
        rotate: '-25'
      },
      axisTick: {
        lineStyle: {
          color: '#e7e7e7'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#e7e7e7'
        }
      },
      data: LabelZeroData
    }
  ];
  yAxisParameter = [
    {
      type: 'log',
      name: userCurrencyCode,
      axisPointer: {
        show: false
      },
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0.7)'
        }
      },
      axisLabel: {
        formatter: function (value: number) {
          const val = value.toString();
          if (val.length > NumberConstant.THREE) {
            return val.substring(NumberConstant.ZERO, val.length - NumberConstant.THREE) + 'K';
          } else {
            return val;
          }
        }
      }
    },
  ];
  const option = ({
    color: Colorset.colorsets.cs4.allChart,
    title: {
      show: false,
      text: title
    },
    legend: {
      data: [],
      display: false
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (args) => {
        let tooltip: string;
        args.forEach(({marker, seriesName, value}) => {
          if (seriesName === 'Montant HT') {
            value = (value) ? Number(value).toLocaleString('fr-FR').concat(' ', userCurrencySymbole) : NumberConstant.ZERO;
            tooltip = `<p>${marker} ${args[NumberConstant.ZERO].axisValue}` + ` <br> ${seriesName} : ${value}`;
          } else {
            tooltip += `<br>${seriesName} : ${value}</p>`;
          }

        });
        return tooltip;
      }
    },
    grid: [{
      top: NumberConstant.FIFTY,
      bottom: NumberConstant.ELEVEN,
    }
    ],
    xAxis: xAxisParameter,
    yAxis: yAxisParameter,
    series: seriesParameter
  });
  return option;
}

export function lineChartOption(title: string, salesData: any[], userCurrencyCode: any, userCurrencySymbole: any,
                                translate: TranslateService) {
  const colors = ['#4DC2F1', '#FFB64D'];
  const option = {
    color: colors,

    tooltip: {
      trigger: 'none',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {},
    grid: {
      top: 70,
      bottom: 30
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[NumberConstant.ONE]
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return translate.instant(DashboardConstant.TURNOVER) + ' ' + params.value
                + (params.seriesData.length ? '：'
                  + Number(params.seriesData[NumberConstant.ZERO].data).toLocaleString('fr-FR')
                    .concat(' ', userCurrencySymbole) : '');
            }
          }
        },
        data: fromMonthNumberToMonthYearName(salesData.map(x => {
          return {'month': x.month, 'year': x.lastYear};
        }))
      },
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[NumberConstant.ZERO]
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return translate.instant(DashboardConstant.TURNOVER) + ' ' + params.value
                + (params.seriesData.length ? '：'
                  + Number(params.seriesData[NumberConstant.ZERO].data).toLocaleString('fr-FR')
                    .concat(' ', userCurrencySymbole) : '');
            }
          }
        },
        data: fromMonthNumberToMonthYearName(salesData.map(x => {
          return {'month': x.month, 'year': x.year};
        }))
      }
    ],
    yAxis: [
      {
        name: userCurrencySymbole,
        type: 'value',
        axisLabel: {
          formatter: function (value: number) {
            const val = value.toString();
            if (val.length > NumberConstant.THREE) {
              return val.substring(NumberConstant.ZERO, val.length - NumberConstant.THREE) + 'K';
            } else {
              return val;
            }
          }
        }
      }
    ],
    series: [
      {
        name: translate.instant('SALES') + ' ' + salesData[NumberConstant.ZERO].year,
        type: 'line',
        xAxisIndex: 1,
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        areaStyle: {
          color: 'rgba(66, 177, 205, 0.45)'
        },
        symbol: 'circle',
        symbolSize: 8,
        data: salesData.map(sale => sale.yTDInvoiceAmountTTC)
      },
      {
        name: translate.instant('SALES') + ' ' + salesData[NumberConstant.ZERO].lastYear,
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        areaStyle: {
          color: 'rgb(227 228 124 / 45%)'
        },
        symbol: 'circle',
        symbolSize: 8,
        data: salesData.map(sale => sale.lYTDInvoiceAmountTTC)
      }
    ]
  };
  return option;
}

export function treeChart(data: any[]) {

  const option = ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [
      {
        type: 'tree',
        data: [data],
        top: '1%',
        left: '25%',
        bottom: '1%',
        roam: true,
        symbolSize: 17,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          formatter: '{b}: {c}',
          fontSize: 13,
          fontWeight: 'bold'
        },

        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },

        emphasis: {
          focus: 'ancestor'
        },
        zoom: 0.75,
        expandAndCollapse: true,
        animationDuration: NumberConstant.FIVE_HUNDRED_FIFTY,
        animationDurationUpdate: NumberConstant.SEVEN_HUNDRED_FIFTY
      }
    ]
  });
  return option;
}

export function gaugeChart(data: any) {

  const option = ({

    series: [
      {
        type: 'gauge',
        center: ['50%', '80%'],
        radius: '150%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: data.submittedCandidacies,
        splitNumber: 1,
        itemStyle: {
          color: '#B8BFED'
        },
        progress: {
          show: true,
          width: 50
        },
        pointer: {
          show: false,
        },
        data: [data.successfulCandidacies],
        axisLine: {
          lineStyle: {
            width: 50,
            color: [[(data.successfulCandidacies / data.submittedCandidacies), '#e76c5d'], [1, '#fffaf0']]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          distance: -70,
          length: -30,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-15%'],
          fontSize: 60,
          fontWeight: 'bold',
          formatter: '{value}',
          color: 'grey'
        }
      }
    ]
  });
  return option;
}

export function startersExitsBarChartOption(data: any, LabelsName: string[], language: string) {
  const colors = ['#626ef2', '#FFB64D'];
  const option = {
    color: colors,
    tooltip: {
      trigger: 'axis'
    },
    legend: {},
    grid: {
      top: 70,
      bottom: 30
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: true,
          alignWithLabel: true,
          interval: 'auto',
          inside: false,
          length: 7
        },
        axisLine: {
          onZero: false
        },
        axisLabel: {
          interval: 0
        },
        data: Object.keys(data.month).length ? fromMonthNumberListToMonthName(data.month, language) : [],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        name: '',
        type: 'value'
      }
    ],
    series: [
      {
        name: LabelsName[NumberConstant.ZERO],
        type: 'bar',
        smooth: true,
        symbolSize: 8,
        data: data.starters
      },
      {
        name: LabelsName[NumberConstant.ONE],
        type: 'bar',
        smooth: true,
        symbolSize: 8,
        data: data.exits
      }
    ]
  };
  return option;
}


export function staffTurnoverHeatmapChartOption(data: any, translate: TranslateService, language: string) {
  const option = {
    tooltip: {
      position: 'top'
    },
    grid: {
      left: '15%',
      height: '10%',
      top: '4%'
    },
    xAxis: {
      type: 'category',
      data: Object.keys(data.month).length ? fromMonthNumberListToMonthName(data.month, language) : [],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: [translate.instant(DashboardConstant.STAFF_TURNOVER_RATE_LABEL)],
      splitArea: {
        show: true
      },
      label: {
        show: false
      }
    },
    visualMap: {
      min: data.min,
      max: data.max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: '2%',
      inRange: {
        color: ['#4F8CD6', '#3D5082'] // From smaller to bigger value
      },
      precision: 2
    },
    series: [{
      type: 'heatmap',
      data: data.res,
      label: {
        show: true,
        formatter: function (params) {
          return params.value[NumberConstant.TWO] + '%';
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 100,
          shadowColor: 'rgba(0.6, 0.3, 0.8, 0.5)'
        }
      }
    }]
  };
  return option;
}

export function timeToFillBarChartOption(data: any, LabelsName: string[], translate: TranslateService, language: string) {
  const colors = ['#626ef2', '#FFB64D'];
  const option = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (args) => {
        let toolttip = `<p>${args[0].axisValue}</p> `;
        args.slice().reverse().forEach(({marker, seriesName, value, componentIndex}) => {
          value = (args.length > NumberConstant.ONE) ? ((value / (value + args[Math.abs(componentIndex - NumberConstant.ONE)].value)) *
            NumberConstant.ONE_HUNDRED).toFixed(NumberConstant.TWO) : value;
          toolttip += `<p>${marker} ${seriesName} : ${value}`;
          toolttip += (args.length > NumberConstant.ONE) ? `%</p>` : `</p>`;
        });
        return toolttip;
      }
    },
    legend: {},
    grid: {
      top: 70,
      bottom: 30
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: true,
          alignWithLabel: true,
          interval: 'auto',
          inside: false,
          length: 7
        },
        axisLine: {
          onZero: false
        },
        axisLabel: {
          interval: 0
        },
        data: data.RecruitmentDescription,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        name: translate.instant(DashboardConstant.DAYS),
        type: 'value'
      }
    ],
    series: [
      {
        name: LabelsName[NumberConstant.ZERO],
        type: 'bar',
        smooth: true,
        symbolSize: 8,
        label: {
          show: true,

        },
        stack: DashboardConstant.STACKED,
        data: data.DelayBeforeRecruitment
      },
      {
        name: LabelsName[NumberConstant.ONE],
        type: 'bar',
        smooth: true,
        symbolSize: 8,
        label: {
          show: true
        },
        stack: DashboardConstant.STACKED,
        data: data.RecruitmentDuration
      }
    ]
  };
  return option;
}

