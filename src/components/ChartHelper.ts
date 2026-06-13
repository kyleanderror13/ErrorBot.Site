export const chartMainFont = 'JetBrains Mono';

export const chartMainSeriesBackgroundColour = 'rgba(102, 178, 255, 0.8)';
export const chartMainSeriesBorderColour = 'rgba(102, 178, 255, 0.6)';

export const chartMainLineSeries = {
  fill: false,
  borderColor: chartMainSeriesBackgroundColour,
  backgroundColor: chartMainSeriesBackgroundColour,
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

export const chartGridLineColour = 'rgba(255,255,255,0.05)';

export const chartDisabledBackgroundColour = 'rgba(128, 128, 128, 0.8)';
export const chartDisabledBorderColour = 'rgba(128, 128, 128, 0.6)';
export const chartExcellentBackgroundColour = 'rgba(178, 255, 102, 0.8)';
export const chartExcellentBorderColour = 'rgba(178, 255, 102, 0.6)';
export const chartMediumBackgroundColour = 'rgba(255, 255, 102, 0.8)';
export const chartMediumBorderColour = 'rgba(255, 255, 102, 0.6)';
export const chartPoorBackgroundColour = 'rgba(255, 178, 102, 0.8)';
export const chartPoorBorderColour = 'rgba(255, 178, 102, 0.6)';
export const chartDangerBackgroundColour = 'rgba(255, 102, 102, 0.8)';
export const chartDangerBorderColour = 'rgba(255, 102, 102, 0.6)';