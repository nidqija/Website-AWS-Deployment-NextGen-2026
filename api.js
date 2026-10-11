/**
 * Solstice Coffee Roasters - Backend API Router & Handlers
 * Compatible with Node.js http, Express, Vite dev middleware, and AWS Lambda
 */

export const MENU_DATA = [
  {
    id: 'ethiopia-guji',
    name: 'Ethiopia Guji Highland Pour-Over',
    category: 'pour-over',
    price: '$7.50',
    origin: 'Oromia, Ethiopia • Natural Process • 2,100 MASL',
    notes: 'Jasmine blossom, wild blueberry, bergamot tea, and candied Meyer lemon.',
    tags: ['Light Roast', 'Direct Trade', 'SCA 91.5'],
    inStock: true
  },
  {
    id: 'colombia-geisha',
    name: 'Huila Cerro Azul Geisha Reserve',
    category: 'pour-over',
    price: '$9.00',
    origin: 'Huila, Colombia • Anaerobic Washed • 1,950 MASL',
    notes: 'White peach, lemongrass, honeysuckle, and silky champagne sparkle.',
    tags: ['Micro-Lot', 'Limited Harvest', 'SCA 93.5'],
    inStock: true
  },
  {
    id: 'solstice-flat-white',
    name: 'Artisan Velvet Flat White',
    category: 'espresso',
    price: '$5.50',
    origin: 'Signature Solstice Roast • Brazil Cerrado & Guatemala Antigua',
    notes: 'Double ristretto shot with micro-textured oat or whole dairy milk, notes of milk chocolate & toffee.',
    tags: ['Customer Favorite', 'Creamy Microfoam'],
    inStock: true
  },
  {
    id: 'cortado-amber',
    name: 'Amber Brown Sugar Cortado',
    category: 'espresso',
    price: '$5.25',
    origin: 'Single-Origin Guatemala Huehuetenango',
    notes: '1:1 ratio of espresso and warm textured milk infused with organic muscovado and smoked sea salt.',
    tags: ['Signature', 'Balanced'],
    inStock: true
  },
  {
    id: 'cascara-nitro-brew',
    name: 'Cascara Nitro Cold Brew',
    category: 'cold-brew',
    price: '$6.50',
    origin: '20-Hour Steeping • Tarrazu, Costa Rica Cascara + Ethiopian Beans',
    notes: 'Velvety nitrogen-infused cascade with hints of dried cherry, hibiscus, and wildflower honey.',
    tags: ['Nitrogen Tap', 'Low Acidity', 'Refreshing'],
    inStock: true
  },
  {
    id: 'smoked-vanilla-shakerato',
    name: 'Smoked Vanilla Shakerato',
    category: 'cold-brew',
    price: '$6.75',
    origin: 'Espresso Elegante shaken vigorously over crystal hand-cut ice',
    notes: 'House-made bourbon vanilla bean syrup, espresso crema foam, and orange peel oils.',
    tags: ['Iced Specialty', 'Cocktail Inspired'],
    inStock: true
  },
  {
    id: 'almond-croissant',
    name: 'Twice-Baked Almond Frangipane Croissant',
    category: 'bakery',
    price: '$5.75',
    origin: 'Daily Fresh from Our In-House Hearth Bakery',
    notes: 'Golden flaky artisanal French butter pastry stuffed with rich almond cream and toasted flaked almonds.',
    tags: ['Organic Flour', 'Baked Fresh 6 AM'],
    inStock: true
  },
  {
    id: 'cardamom-morning-bun',
    name: 'Swedish Cardamom & Orange Morning Bun',
    category: 'bakery',
    price: '$5.25',
    origin: 'Hand-laminated sourdough pastry with freshly crushed green cardamom',
    notes: 'Crisp caramelized edges, fragrant cardamom spice, and a zesty candied Valencia orange glaze.',
    tags: ['Vegan Option', 'House Special'],
    inStock: true
  }
];

// Helper to read JSON request body
export function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Main API request dispatcher
export async function handleApiRoute(req, res) {
  // CORS & JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // 1. Health & Server Status Endpoint
  if (pathname === '/api/status' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      status: 'online',
      service: 'Solstice Coffee Roasters Backend API',
      version: '1.0.0',
      uptime: process.uptime ? Math.floor(process.uptime()) : 120,
      timestamp: new Date().toISOString(),
      architecture: 'Node.js Backend (AWS Lambda & Server Compatible)',
      roastSchedule: {
        currentBatch: 'Ethiopia Guji Highland Natural',
        roastMaster: 'Elena V.',
        tempProfile: '204°C Loring S15 Air Roaster'
      }
    }));
    return true;
  }

  // 2. Coffee Menu Endpoint
  if (pathname === '/api/menu' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      count: MENU_DATA.length,
      lastUpdated: new Date().toISOString(),
      items: MENU_DATA
    }));
    return true;
  }

  // 3. Table / Tasting Reservation Endpoint
  if (pathname === '/api/reserve' && req.method === 'POST') {
    try {
      const data = await parseRequestBody(req);

      // Validation
      if (!data.fullName || !data.email) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({
          success: false,
          error: 'Missing required fields: fullName and email are required.'
        }));
        return true;
      }

      // Generate realistic booking ID
      const bookingId = `SLS-${Math.floor(100000 + Math.random() * 900000)}`;
      const serverTimestamp = new Date().toISOString();

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Reservation successfully confirmed and recorded by Solstice backend!',
        bookingId,
        receivedAt: serverTimestamp,
        confirmationSummary: {
          guestName: data.fullName,
          guestEmail: data.email,
          guestPhone: data.phone || 'N/A',
          serviceType: data.serviceType || 'Tasting Flight & Table',
          date: data.date,
          timeSlot: data.timeSlot || '10:00 AM',
          partySize: data.partySize || '2 Guests',
          seatingArea: data.seatingArea || 'Sunlit Window Nook',
          tastingFlightCount: data.flightItems ? data.flightItems.length : 0,
          specialNotes: data.notes || 'None'
        },
        backendMeta: {
          server: 'Node.js API Engine',
          endpoint: '/api/reserve',
          httpStatus: 200,
          cloudStatus: 'Ready for AWS API Gateway + AWS Lambda handler'
        }
      }));
      return true;
    } catch (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to parse JSON or process reservation: ' + err.message
      }));
      return true;
    }
  }

  // 4. Newsletter Subscription Endpoint
  if (pathname === '/api/newsletter' && req.method === 'POST') {
    try {
      const data = await parseRequestBody(req);
      if (!data.email || !data.email.includes('@')) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({
          success: false,
          error: 'Valid email address is required.'
        }));
        return true;
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Welcome to Roasters Circle! Your promo code has been created.',
        discountCode: 'SOLSTICE15',
        email: data.email,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({
        success: false,
        error: 'Error processing newsletter: ' + err.message
      }));
      return true;
    }
  }

  // Not handled by API
  return false;
}
