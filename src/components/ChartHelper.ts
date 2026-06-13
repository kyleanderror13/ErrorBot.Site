export const chartMainFont = 'JetBrains Mono';

export const chartMainSeriesColour = 'rgba(102, 178, 255, 0.8)';

export const chartMainLineSeries = {
  fill: false,
  borderColor: chartMainSeriesColour,
  backgroundColor: chartMainSeriesColour,
  tension: 0.2
}

export const chartTrendLineSeries = {
  borderColor: '#f97316',
  borderWidth: 2,
  borderDash: [6, 3],
  pointRadius: 0,
  tension: 0.1,
  fill: false
}

export const chartPBStaircaseSeries = {
  borderColor: '#00fa9a',
  borderWidth: 2,
  borderDash: [6, 3],
  pointRadius: 0,
  tension: 0,
  fill: false,
  stepped: 'before'
}

export const chartTooltipFont = { family: chartMainFont };

export const chartTickColor = '#adadb8';

export const chartTickFont = { family: chartMainFont, size: 11 };

export const chartGridLineColor = 'rgba(255,255,255,0.05)';

export const chartDisabledBackgroundColor = 'rgba(128, 128, 128, 0.8)';
export const chartDisabledBorderColor = 'rgba(128, 128, 128, 0.6)';
export const chartExcellentBackgroundColor = 'rgba(178, 255, 102, 0.8)';
export const chartExcellentBorderColor = 'rgba(178, 255, 102, 0.6)';
export const chartMediumBackgroundColor = 'rgba(255, 255, 102, 0.8)';
export const chartMediumBorderColor = 'rgba(255, 255, 102, 0.6)';
export const chartPoorBackgroundColor = 'rgba(255, 178, 102, 0.8)';
export const chartPoorBorderColor = 'rgba(255, 178, 102, 0.6)';
export const chartDangerBackgroundColor = 'rgba(255, 102, 102, 0.8)';
export const chartDangerBorderColor = 'rgba(255, 102, 102, 0.6)';