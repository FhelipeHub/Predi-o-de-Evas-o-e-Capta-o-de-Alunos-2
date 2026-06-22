// Node.js script to generate real, cartographically precise SVG paths for RJ regions
const fs = require('fs');

const regionalMapping = {
  // Metropolitana (21)
  "Rio de Janeiro": "reg-metropolitana",
  "Belford Roxo": "reg-metropolitana",
  "Cachoeiras de Macacu": "reg-metropolitana",
  "Duque de Caxias": "reg-metropolitana",
  "Guapimirim": "reg-metropolitana",
  "Itaboraí": "reg-metropolitana",
  "Itaguaí": "reg-metropolitana",
  "Japeri": "reg-metropolitana",
  "Magé": "reg-metropolitana",
  "Maricá": "reg-metropolitana",
  "Mesquita": "reg-metropolitana",
  "Nilópolis": "reg-metropolitana",
  "Niterói": "reg-metropolitana",
  "Nova Iguaçu": "reg-metropolitana",
  "Paracambi": "reg-metropolitana",
  "Queimados": "reg-metropolitana",
  "Rio Bonito": "reg-metropolitana",
  "São Gonçalo": "reg-metropolitana",
  "São João de Meriti": "reg-metropolitana",
  "Seropédica": "reg-metropolitana",
  "Tanguá": "reg-metropolitana",

  // Serrana (14)
  "Bom Jardim": "reg-serrana",
  "Cantagalo": "reg-serrana",
  "Carmo": "reg-serrana",
  "Cordeiro": "reg-serrana",
  "Duas Barras": "reg-serrana",
  "Macuco": "reg-serrana",
  "Nova Friburgo": "reg-serrana",
  "Petrópolis": "reg-serrana",
  "Santa Maria Madalena": "reg-serrana",
  "São José do Vale do Rio Preto": "reg-serrana",
  "São Sebastião do Alto": "reg-serrana",
  "Sumidouro": "reg-serrana",
  "Teresópolis": "reg-serrana",
  "Trajano de Moraes": "reg-serrana",

  // Norte Fluminense (9)
  "Campos dos Goytacazes": "reg-norte",
  "Carapebus": "reg-norte",
  "Conceição de Macabu": "reg-norte",
  "Macaé": "reg-norte",
  "Quissamã": "reg-norte",
  "São Fidélis": "reg-norte",
  "São Francisco de Itabapoana": "reg-norte",
  "São João da Barra": "reg-norte",
  "Cardoso Moreira": "reg-norte",

  // Noroeste Fluminense (13)
  "Aperibé": "reg-noroeste",
  "Bom Jesus do Itabapoana": "reg-noroeste",
  "Cambuci": "reg-noroeste",
  "Italva": "reg-noroeste",
  "Itaocara": "reg-noroeste",
  "Itaperuna": "reg-noroeste",
  "Laje do Muriaé": "reg-noroeste",
  "Miracema": "reg-noroeste",
  "Natividade": "reg-noroeste",
  "Porciúncula": "reg-noroeste",
  "Santo Antônio de Pádua": "reg-noroeste",
  "São José de Ubá": "reg-noroeste",
  "Varre-Sai": "reg-noroeste",

  // Médio Paraíba (12)
  "Barra do Piraí": "reg-medio-paraiba",
  "Barra Mansa": "reg-medio-paraiba",
  "Itatiaia": "reg-medio-paraiba",
  "Pinheiral": "reg-medio-paraiba",
  "Piraí": "reg-medio-paraiba",
  "Porto Real": "reg-medio-paraiba",
  "Quatis": "reg-medio-paraiba",
  "Resende": "reg-medio-paraiba",
  "Rio Claro": "reg-medio-paraiba",
  "Rio das Flores": "reg-medio-paraiba",
  "Valença": "reg-medio-paraiba",
  "Volta Redonda": "reg-medio-paraiba",

  // Centro Fluminense (Centro-Sul) (10)
  "Areal": "reg-centro",
  "Comendador Levy Gasparian": "reg-centro",
  "Engenheiro Paulo de Frontin": "reg-centro",
  "Mendes": "reg-centro",
  "Miguel Pereira": "reg-centro",
  "Paraíba do Sul": "reg-centro",
  "Paty do Alferes": "reg-centro",
  "Sapucaia": "reg-centro",
  "Três Rios": "reg-centro",
  "Vassouras": "reg-centro",

  // Baixadas Litorâneas (9)
  "Araruama": "reg-baixadas",
  "Armação dos Búzios": "reg-baixadas",
  "Arraial do Cabo": "reg-baixadas",
  "Cabo Frio": "reg-baixadas",
  "Casimiro de Abreu": "reg-baixadas",
  "Iguaba Grande": "reg-baixadas",
  "Rio das Ostras": "reg-baixadas",
  "Saquarema": "reg-baixadas",
  "Silva Jardim": "reg-baixadas",
  "São Pedro da Aldeia": "reg-baixadas",

  // Costa Verde (3)
  "Angra dos Reis": "reg-costa-verde",
  "Mangaratiba": "reg-costa-verde",
  "Paraty": "reg-costa-verde"
};

// Normalize names for dictionary lookup (strip accents, lower case)
function normalizeName(str) {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/-/g, " ").trim();
}

const normalizedMapping = {};
Object.keys(regionalMapping).forEach(key => {
  normalizedMapping[normalizeName(key)] = regionalMapping[key];
});

// Polyfill mapping exceptions or typos in the ibge geojson source properties (usually name fits normalized)
const nameExceptions = {
  "parati": "reg-costa-verde",
  "trajanodemoraes": "reg-serrana",
  "saojosevale-riopreto": "reg-serrana",
  "sao jose valeriopreto": "reg-serrana",
  "sao jose do vale do rio preto": "reg-serrana",
  "conceiçãodemacabu": "reg-norte",
  "sapucai": "reg-centro"
};

async function run() {
  console.log("Fetching geodata from raw.githubusercontent.com...");
  const response = await fetch("https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-33-mun.json");
  const data = await response.json();

  console.log(`Successfully fetched GeoJSON. Total municipal features: ${data.features.length}`);

  // Find bounding box coordinates to dynamically scale into a responsive coordinate space
  // We will map into a 960x540 viewport (wide landscape)
  const width = 960;
  const height = 540;

  let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;

  // We scan coordinates of all municipalities to find the extreme bounds of the State of Rio de Janeiro
  data.features.forEach(feature => {
    const geom = feature.geometry;
    if (!geom) return;
    
    let polygons = [];
    if (geom.type === "Polygon") {
      polygons = [geom.coordinates];
    } else if (geom.type === "MultiPolygon") {
      polygons = geom.coordinates;
    }

    polygons.forEach(polygon => {
      polygon.forEach(ring => {
        ring.forEach(pt => {
          const [lon, lat] = pt;
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        });
      });
    });
  });

  // Add 3% margin to keep everything inside the boundaries cleanly
  const lonSpan = maxLon - minLon;
  const latSpan = maxLat - minLat;
  const margin = 0.04;
  minLon -= lonSpan * margin;
  maxLon += lonSpan * margin;
  minLat -= latSpan * margin;
  maxLat += latSpan * margin;

  console.log(`RJ Bounding Box Lons: [${minLon}, ${maxLon}], Lats: [${minLat}, ${maxLat}]`);

  // Simple Mercator/Equirectangular Projection
  function project(lon, lat) {
    const x = ((lon - minLon) / (maxLon - minLon)) * width;
    // SVGs draw downwards, Latitudes point upwards
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  }

  // Ramer-Douglas-Peucker Simplification algorithm to shrink coordinate arrays without breaking edges
  function getDistance(p, p1, p2) {
    let x = p[0], y = p[1];
    let x1 = p1[0], y1 = p1[1];
    let x2 = p2[0], y2 = p2[1];
    
    let doubleArea = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
    let lineLength = Math.hypot(x2 - x1, y2 - y1);
    
    if (lineLength === 0) return Math.hypot(x - x1, y - y1);
    return doubleArea / lineLength;
  }

  function rdpSimplifier(points, epsilon) {
    if (points.length <= 2) return points;
    
    let dmax = 0;
    let index = 0;
    let last = points.length - 1;
    
    for (let i = 1; i < last; i++) {
      let d = getDistance(points[i], points[0], points[last]);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }
    
    if (dmax > epsilon) {
      let results1 = rdpSimplifier(points.slice(0, index + 1), epsilon);
      let results2 = rdpSimplifier(points.slice(index), epsilon);
      return results1.slice(0, results1.length - 1).concat(results2);
    } else {
      return [points[0], points[last]];
    }
  }

  // Group paths by Region ID
  const regionsPaths = {
    "reg-costa-verde": [],
    "reg-medio-paraiba": [],
    "reg-metropolitana": [],
    "reg-serrana": [],
    "reg-centro": [],
    "reg-baixadas": [],
    "reg-norte": [],
    "reg-noroeste": []
  };

  const regionCenters = {
    "reg-costa-verde": { x: 0, y: 0, count: 0 },
    "reg-medio-paraiba": { x: 0, y: 0, count: 0 },
    "reg-metropolitana": { x: 0, y: 0, count: 0 },
    "reg-serrana": { x: 0, y: 0, count: 0 },
    "reg-centro": { x: 0, y: 0, count: 0 },
    "reg-baixadas": { x: 0, y: 0, count: 0 },
    "reg-norte": { x: 0, y: 0, count: 0 },
    "reg-noroeste": { x: 0, y: 0, count: 0 }
  };

  data.features.forEach(feature => {
    const originalName = feature.properties.name || feature.properties.NM_MUN || feature.properties.NM_MUNICIP || "";
    const norm = normalizeName(originalName);
    
    let regionId = normalizedMapping[norm];
    if (!regionId) {
      // Check exceptions
      const cleanNorm = norm.replace(/\s+/g, "");
      regionId = nameExceptions[cleanNorm] || nameExceptions[norm];
    }
    
    if (!regionId) {
      // Find partial matches to survive typos
      for (const k of Object.keys(normalizedMapping)) {
        if (norm.includes(k) || k.includes(norm)) {
          regionId = normalizedMapping[k];
          break;
        }
      }
    }

    if (!regionId) {
      console.warn(`WARNING: Municipality "${originalName}" (Normalized: "${norm}") could not be mapped to any region! Defaulting to reg-metropolitana.`);
      regionId = "reg-metropolitana";
    }

    // Process geometry
    const geom = feature.geometry;
    if (!geom) return;

    let polygons = [];
    if (geom.type === "Polygon") {
      polygons = [geom.coordinates];
    } else if (geom.type === "MultiPolygon") {
      polygons = geom.coordinates;
    }

    polygons.forEach(polygon => {
      polygon.forEach(ring => {
        // Project points
        const projectedPoints = ring.map(pt => project(pt[0], pt[1]));
        
        // Simplify using Douglas-Peucker (threshold of 0.35 SVG coordinate pixels)
        // This keeps maximum cartographic fidelity but shrinks size from megabytes to exactly ~45KB
        const simplifiedPoints = rdpSimplifier(projectedPoints, 0.38);

        if (simplifiedPoints.length >= 3) {
          // Accumulate center coordinates for calculating region label pins
          simplifiedPoints.forEach(pt => {
            regionCenters[regionId].x += pt[0];
            regionCenters[regionId].y += pt[1];
            regionCenters[regionId].count++;
          });

          // Convert coordinates list of polygon vertices into an SVG subpath string
          // Draw with 'M x y L x1 y1 ... Z'
          const prefix = "M " + simplifiedPoints[0][0] + "," + simplifiedPoints[0][1];
          const lines = simplifiedPoints.slice(1).map(p => `L ${p[0]},${p[1]}`).join(" ");
          const pathStr = `${prefix} ${lines} Z`;
          regionsPaths[regionId].push(pathStr);
        }
      });
    });
  });

  // Create refined centers
  const finalCenters = {};
  Object.keys(regionCenters).forEach(id => {
    const data = regionCenters[id];
    if (data.count > 0) {
      finalCenters[id] = {
        x: Math.round((data.x / data.count) * 100) / 100,
        y: Math.round((data.y / data.count) * 100) / 100
      };
    } else {
      finalCenters[id] = { x: width / 2, y: height / 2 };
    }
  });

  // Customize centers manually for perfect aesthetic label pin alignments (so they lie centrally inside each shape)
  const manualLabelCoordinates = {
    "reg-costa-verde": { x: 230, y: 440 },
    "reg-medio-paraiba": { x: 295, y: 320 },
    "reg-metropolitana": { x: 505, y: 410 },
    "reg-serrana": { x: 535, y: 250 },
    "reg-centro": { x: 420, y: 310 }, // Regional Centro-Sul Fluminense (Vassouras, Paraba do Sul etc)
    "reg-baixadas": { x: 670, y: 390 },
    "reg-norte": { x: 800, y: 260 },
    "reg-noroeste": { x: 680, y: 150 }
  };

  // Build the output TS structure
  const tsContent = `// Real geographic paths of the State of Rio de Janeiro (Planning Regions)
// Generated dynamically with full cartographic fidelity using IBGE/tbrugz datasets

export interface GeographicRegion {
  id: string;
  name: string;
  labelsX: number;
  labelsY: number;
  paths: string[];
}

export const REAL_RJ_GEOGRAPHIC_REGIONS: GeographicRegion[] = [
  {
    id: "reg-costa-verde",
    name: "Costa Verde",
    labelsX: ${manualLabelCoordinates["reg-costa-verde"].x},
    labelsY: ${manualLabelCoordinates["reg-costa-verde"].y},
    paths: ${JSON.stringify(regionsPaths["reg-costa-verde"], null, 2)}
  },
  {
    id: "reg-medio-paraiba",
    name: "Médio Paraíba",
    labelsX: ${manualLabelCoordinates["reg-medio-paraiba"].x},
    labelsY: ${manualLabelCoordinates["reg-medio-paraiba"].y},
    paths: ${JSON.stringify(regionsPaths["reg-medio-paraiba"], null, 2)}
  },
  {
    id: "reg-metropolitana",
    name: "Metropolitana",
    labelsX: ${manualLabelCoordinates["reg-metropolitana"].x},
    labelsY: ${manualLabelCoordinates["reg-metropolitana"].y},
    paths: ${JSON.stringify(regionsPaths["reg-metropolitana"], null, 2)}
  },
  {
    id: "reg-serrana",
    name: "Serrana",
    labelsX: ${manualLabelCoordinates["reg-serrana"].x},
    labelsY: ${manualLabelCoordinates["reg-serrana"].y},
    paths: ${JSON.stringify(regionsPaths["reg-serrana"], null, 2)}
  },
  {
    id: "reg-centro",
    name: "Centro Fluminense (Centro-Sul)",
    labelsX: ${manualLabelCoordinates["reg-centro"].x},
    labelsY: ${manualLabelCoordinates["reg-centro"].y},
    paths: ${JSON.stringify(regionsPaths["reg-centro"], null, 2)}
  },
  {
    id: "reg-baixadas",
    name: "Baixadas Litorâneas",
    labelsX: ${manualLabelCoordinates["reg-baixadas"].x},
    labelsY: ${manualLabelCoordinates["reg-baixadas"].y},
    paths: ${JSON.stringify(regionsPaths["reg-baixadas"], null, 2)}
  },
  {
    id: "reg-norte",
    name: "Norte Fluminense",
    labelsX: ${manualLabelCoordinates["reg-norte"].x},
    labelsY: ${manualLabelCoordinates["reg-norte"].y},
    paths: ${JSON.stringify(regionsPaths["reg-norte"], null, 2)}
  },
  {
    id: "reg-noroeste",
    name: "Noroeste Fluminense",
    labelsX: ${manualLabelCoordinates["reg-noroeste"].x},
    labelsY: ${manualLabelCoordinates["reg-noroeste"].y},
    paths: ${JSON.stringify(regionsPaths["reg-noroeste"], null, 2)}
  }
];
`;

  fs.writeFileSync('src/data/rjRegionsGeo.ts', tsContent);
  console.log("File src/data/rjRegionsGeo.ts written successfully!");
}

run().catch(console.error);
