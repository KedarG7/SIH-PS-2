import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStates, indiaOutline, meta } from 'vardhan-maps/data';

const width = 720;
const height = 690;
const padding = 30;
const simplifyTolerance = 0.5;
const here = dirname(fileURLToPath(import.meta.url));
const output = resolve(here, '../src/data/india-state-paths.json');
const features = getStates();
const bounds = [Infinity, Infinity, -Infinity, -Infinity];

for (const { geometry } of features) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const [longitude, latitude] of ring) {
        bounds[0] = Math.min(bounds[0], longitude);
        bounds[1] = Math.min(bounds[1], latitude);
        bounds[2] = Math.max(bounds[2], longitude);
        bounds[3] = Math.max(bounds[3], latitude);
      }
    }
  }
}

const [minLongitude, minLatitude, maxLongitude, maxLatitude] = bounds;
const middleLatitude = (minLatitude + maxLatitude) / 2;
const longitudeScale = Math.cos(middleLatitude * Math.PI / 180);
const geographicWidth = (maxLongitude - minLongitude) * longitudeScale;
const geographicHeight = maxLatitude - minLatitude;
const availableWidth = width - padding * 2;
const availableHeight = height - padding * 2;
const scale = Math.min(availableWidth / geographicWidth, availableHeight / geographicHeight);
const drawWidth = geographicWidth * scale;
const drawHeight = geographicHeight * scale;
const offsetX = padding + (availableWidth - drawWidth) / 2;
const offsetY = padding + (availableHeight - drawHeight) / 2;

function project(longitude, latitude) {
  return [
    offsetX + (longitude - minLongitude) * longitudeScale * scale,
    offsetY + (maxLatitude - latitude) * scale,
  ];
}

function distanceToSegmentSquared(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  const amount = lengthSquared === 0
    ? 0
    : Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared));
  const distanceX = point[0] - (start[0] + amount * dx);
  const distanceY = point[1] - (start[1] + amount * dy);
  return distanceX * distanceX + distanceY * distanceY;
}

function simplifyOpenLine(points) {
  if (points.length <= 2) return points;
  let index = -1;
  let maximumDistance = simplifyTolerance * simplifyTolerance;
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = distanceToSegmentSquared(points[i], points[0], points.at(-1));
    if (distance > maximumDistance) {
      maximumDistance = distance;
      index = i;
    }
  }
  if (index < 0) return [points[0], points.at(-1)];
  const left = simplifyOpenLine(points.slice(0, index + 1));
  const right = simplifyOpenLine(points.slice(index));
  return left.slice(0, -1).concat(right);
}

function simplifyRing(coordinates) {
  let points = coordinates.map(([longitude, latitude]) => project(longitude, latitude));
  if (points.length > 2 && points[0][0] === points.at(-1)[0] && points[0][1] === points.at(-1)[1]) {
    points = points.slice(0, -1);
  }
  if (points.length <= 4) return points;

  let farthestIndex = 1;
  let farthestDistance = -1;
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i][0] - points[0][0];
    const dy = points[i][1] - points[0][1];
    const distance = dx * dx + dy * dy;
    if (distance > farthestDistance) {
      farthestDistance = distance;
      farthestIndex = i;
    }
  }

  const firstHalf = simplifyOpenLine(points.slice(0, farthestIndex + 1));
  const secondHalf = simplifyOpenLine(points.slice(farthestIndex).concat([points[0]]));
  const simplified = firstHalf.slice(0, -1).concat(secondHalf);
  return simplified.length >= 3 ? simplified : points.slice(0, 3);
}

function geometryPath(geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  let path = '';
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const points = simplifyRing(ring);
      if (points.length < 3) continue;
      path += `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`;
    }
  }
  return path;
}

const map = {
  viewBox: `0 0 ${width} ${height}`,
  source: 'vardhan-maps state and union-territory boundaries, derived from OpenStreetMap',
  datasetVersion: meta.version,
  simplifyTolerancePx: simplifyTolerance,
  projection: { minLongitude, maxLatitude, longitudeScale, scale, offsetX, offsetY },
  outline: geometryPath(indiaOutline.geometry),
  features: features.map(({ properties, geometry }) => ({
    name: properties.name,
    code: properties.code,
    d: geometryPath(geometry),
  })),
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(map)}\n`);
console.log(`Wrote ${map.features.length} state/UT outlines to ${output}`);
