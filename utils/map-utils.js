/**
 * Calculate bounds between points based on distance threshold and options
 */
export const calculateBounds = ({
  fetchedData,
  loadedSources,
  distanceThreshold,
  drawSameSourceDataBounds,
  onlyCrossSourceBounds,
  boundsWeight,
  calculateDistance
}) => {
  // If no bounds should be drawn, return empty array
  if (!drawSameSourceDataBounds && !onlyCrossSourceBounds) {
    return [];
  }
  
  // Collect all points with their source
  const allPoints = [];
  loadedSources.forEach((source) => {
    (fetchedData[source.name] || []).forEach((point) => {
      if (point.latitude && point.longitude) {
        allPoints.push({
          source: source.name, 
          lat: point.latitude, 
          lng: point.longitude,
          data: point
        });
      }
    });
  });
  
  // Calculate bounds between points
  const bounds = [];
  for (let i = 0; i < allPoints.length; i++) {
    for (let j = i + 1; j < allPoints.length; j++) {
      const point1 = allPoints[i];
      const point2 = allPoints[j];
      const distance = calculateDistance(point1, point2);
      
      if (distance <= distanceThreshold) {
        let boundsColor = null;
        
        if (drawSameSourceDataBounds && point1.source === point2.source) {
          boundsColor = 'blue';
        }
        
        if (onlyCrossSourceBounds && point1.source !== point2.source) {
          boundsColor = 'red';
        }
        
        if (boundsColor) {
          bounds.push({
            bounds: [[point1.lat, point1.lng], [point2.lat, point2.lng]],
            color: boundsColor,
            weight: boundsWeight,
            point1: point1,
            point2: point2,
            distance: distance
          });
        }
      }
    }
  }
  
  return bounds;
};
