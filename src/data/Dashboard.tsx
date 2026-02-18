import type { ApexOptions } from 'apexcharts'
import type { WidgetData } from '../types/dashboard'
import type {
  MessageActivityStat,
  MessageByHour,
  MessageTypeStat,
  ReportTypeStat,
  UserGrowthMonthly,
  UserLocationDistribution,
} from '../types/api'

const getSafeData = <T,>(data: T[] | undefined): T[] => {
  return Array.isArray(data) ? data : []
}

export const WidgetList: WidgetData[] = [
  { id: 1, key: 'totalUsers', imgSrc: '/svg/1.svg', label: 'Total Users', styleClass: 'style-1' },
  { id: 2, key: 'totalCalls', imgSrc: '/svg/2.svg', label: 'Total Calls', styleClass: 'style-2' },
  { id: 3, key: 'totalGroups', imgSrc: '/svg/3.svg', label: 'Total Groups', styleClass: 'style-3' },
  { id: 4, key: 'newUsersThisWeek', imgSrc: '/svg/4.svg', label: 'This Week’s Users', styleClass: 'style-4' },
  { id: 5, key: 'totalMediaShared', imgSrc: '/svg/5.svg', label: 'Media Shared', styleClass: 'style-5' },
  { id: 6, key: 'totalFileShared', imgSrc: '/svg/6.svg', label: 'Files Shared', styleClass: 'style-6' },
  { id: 7, key: 'totalPendingReports', imgSrc: '/svg/7.svg', label: 'Pending Reports', styleClass: 'style-7' },
  { id: 8, key: 'totalBlockedUsers', imgSrc: '/svg/8.svg', label: 'Blocked Users', styleClass: 'style-8' },
]
export const MessageActivityOption = ({ data }: { data?: MessageActivityStat[] }) => {
  const safeData = getSafeData(data)

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const formattedMonths =
    data?.map((item) => {
      const [_, month, day] = item.date.split('-')
      const monthName = monthNames[parseInt(month, 10) - 1]
      return `${monthName}-${day}`
    }) || []

  const series = [
    {
      name: 'TEAM A',
      type: 'column',
      data: safeData?.map((item) => item.count)?.slice?.(0, 12) || [],
    },
    {
      name: 'TEAM B',
      type: 'area',
      data: safeData?.map((item) => item.count)?.slice?.(0, 12) || [],
    },
  ]

  const ChartOption: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      stacked: false,
      offsetX: -10,
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 6,
        blur: 2,
        color: '#0f98a0',
        opacity: 0.2,
      },
    },
    stroke: {
      width: [0, 2, 5],
      curve: 'stepline',
    },
    colors: ['#adadad', '#0f98a0'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,

      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: true },
      },
    },
    xaxis: {
      categories: formattedMonths,
      labels: {
        style: {
          fontFamily: 'Rubik',
          fontWeight: 600,
          colors: '#adadad',
        },
      },
      axisBorder: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: 'Rubik',
          fontWeight: 600,
          colors: '#333333',
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex][dataPointIndex]
        return `
          <div class="apex-tooltip p-2">
            <span>
              <span class="bg-primary"></span>
              Growth
              <h3>$${value}</h3>
            </span>
          </div>
        `
      },
    },
  }
  return { ChartOption, series }
}

export const MessageDistributionOption = ({ data }: { data?: MessageTypeStat[] }) => {
  const safeData = getSafeData(data)

  const series = [
    {
      name: 'Activity',
      data: safeData?.map((item) => item.count)?.slice?.(0, 6) || [],
    },
  ]

  const ChartOption: ApexOptions = {
    chart: {
      height: 320,
      type: 'donut',
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 10,
        left: 0,
        blur: 5,
        color: 'var(--theme-default)',
        opacity: 0.35,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '70%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: safeData?.map((item) => item.message_type)?.slice?.(0, 6) || [],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Rubik, sans-serif',
          colors: 'var(--chart-text-color)',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        formatter: (val: number) => `${val}`,
        style: {
          fontSize: '12px',
          fontFamily: 'Rubik, sans-serif',
          colors: 'var(--chart-text-color)',
        },
      },
    },
    grid: {
      borderColor: 'var(--chart-dashed-border)',
      strokeDashArray: 5,
    },
    colors: ['var(--theme-default)'],
  }
  return { ChartOption, series }
}

export const ReportTypesOption = ({ data }: { data?: ReportTypeStat[] }) => {
  const safeData = getSafeData(data)
  const series = safeData?.map((item) => item.count)?.slice?.(0, 4) || []
  const labels = safeData?.map((item) => item.reason)?.slice?.(0, 4) || []
  const colors = ['var(--theme-default)', '#ffb829', '#54BA4A', '#FF3364', '#FF8C00', '#3BAFDA', '#9C27B0']

  const ChartOption: ApexOptions = {
    labels,
    chart: {
      height: 200,
      type: 'donut',
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              offsetY: 4,
            },
            value: {
              fontSize: '18px',
              offsetY: -10,
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 400,
              color: '#52526C',
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Rubik, sans-serif',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                return `${total}`
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors,
    fill: {
      type: 'solid',
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 400,
      labels: {
        colors: 'var(--chart-text-color)',
      },
      formatter: (seriesName, opts) => `${seriesName} - ${opts.w.globals.series[opts.seriesIndex]}`,
      markers: {
        size: 6,
      },
    },
    stroke: {
      width: 2,
    },
  }

  return { ChartOption, series }
}

export const LocationsWiseUsersOption = ({ data }: { data?: UserLocationDistribution[] }) => {
  const safeData = getSafeData(data)
  const series = [
    {
      data: safeData?.map((item) => item.percentage)?.slice?.(0, 7) || [],
    },
  ]

  const ChartOption: ApexOptions = {
    chart: {
      type: 'bar',
      height: 325,
      offsetX: -10,
      toolbar: {
        show: false,
      },
    },
    colors: [
      'var(--theme-default)',
      'rgba(255,184,41,1)',
      '#F75270',
      '#556B2F',
      '#9E1C60',
      '#F87B1B',
      'rgba(214, 76, 89, 1)',
    ],
    fill: {
      opacity: 0.4,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: true,
        barHeight: '18%',
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val)
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 5,
        padding: 4,
        opacity: 0.9,
        borderWidth: 1,
        borderColor: '#fff',
      },
      style: {
        fontSize: '12px',
        colors: ['#f2f2f2'],
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      borderColor: '#f2f2f2',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    xaxis: {
      categories: safeData?.map((item) => item.country)?.slice?.(0, 7) || [],
      tickAmount: 10,
      min: 0,
      max: 100,
      labels: {
        minHeight: undefined,
        maxHeight: 18,
        offsetX: -5,
        offsetY: 0,
      },
      axisBorder: {
        show: false,
      },
      title: {
        offsetX: 0,
        offsetY: -28,
        style: {
          fontSize: '13px',
          color: '#959595',
          fontFamily: 'Lexend, sans-serif',
        },
      },
    },
    tooltip: {
      custom: function ({
        series,
        seriesIndex,
        dataPointIndex,
      }: {
        series: number[][]
        seriesIndex: number
        dataPointIndex: number
        w: any
      }) {
        return `
        <div class="apex-tooltip p-2">
          <span>
            <span class="bg-primary"></span>
            ${data?.[dataPointIndex]?.country || ''}
            <h3>${series[seriesIndex][dataPointIndex]}</h3>
          </span>
        </div>
      `
      },
    },
  }

  return { ChartOption, series }
}

export const MonthlyUsersGrowthOption = ({ data }: { data?: UserGrowthMonthly[] }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const formattedMonths = data?.map((item) => {
    const monthIndex = parseInt(item.month.split('-')[1], 10) - 1
    return monthNames[monthIndex] || item.month
  })

  const safeData = getSafeData(formattedMonths)

  const series = [
    {
      name: 'Total User',
      data: data?.map((item) => item.total_users) || [],
    },
    {
      name: 'New User',
      data: data?.map((item) => item.new_users) || [],
    },
  ]

  const ChartOption: ApexOptions = {
    chart: {
      type: 'bar',
      height: 270,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 6,
      colors: ['transparent'],
    },
    grid: {
      show: true,
      borderColor: 'var(--chart-border)',
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    colors: ['#FFA941', 'var(--theme-default)'],
    xaxis: {
      categories: safeData?.slice?.(0, 12),
      labels: {
        style: {
          fontFamily: 'Rubik, sans-serif',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          fontFamily: 'Rubik, sans-serif',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'Rubik, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: 'var(--chart-text-color)',
      },
      markers: {
        size: 6,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
  }

  return { ChartOption, series }
}

export const TodayHourlyActivityOption = ({ data }: { data?: MessageByHour[] }) => {
  const series = [
    {
      name: 'Count',
      data: data?.map((item) => item.count) || [],
    },
    {
      name: 'User Count',
      data: data?.map((item) => item.active_users) || [],
    },
  ]

  const ChartOption: ApexOptions = {
    chart: {
      height: 222,
      type: 'line',
      stacked: true,
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 10,
        left: 0,
        blur: 8,
        color: 'var(--theme-default)',
        opacity: 0.8,
      },
    },
    colors: ['var(--theme-default)'],
    stroke: {
      width: 2.5,
      curve: 'smooth',
    },
    xaxis: {
      type: 'category',
      categories: data?.map((item) => item.hour) || [],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Rubik, sans-serif',
          colors: '#52526C',
          fontWeight: 400,
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      tickAmount: 8,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Rubik, sans-serif',
          colors: '#52526C',
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: 'var(--chart-border)',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      type: ['gradient', 'solid'],
      gradient: {
        shade: 'dark',
        gradientToColors: ['var(--theme-default)'],
        shadeIntensity: 10,
        type: 'horizontal',
        opacityFrom: 0.9,
        opacityTo: 1,
        colorStops: [
          {
            offset: 0,
            color: '#08dbe6',
            opacity: 1,
          },
          {
            offset: 100,
            color: 'var(--theme-default)',
            opacity: 1,
          },
        ],
      },
    },
  }

  return { ChartOption, series }
}
