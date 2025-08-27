// Service Worker for PWA functionality and offline caching
const CACHE_NAME = 'glamflow-cache-v1';
const API_CACHE_NAME = 'glamflow-api-cache-v1';

// Resources to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/app',
  '/calendar',
  '/tasks',
  '/profile',
  '/manifest.json',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/rest\/v1\/profiles/,
  /\/rest\/v1\/tasks/,
  /\/rest\/v1\/appointments/
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests with Network First strategy
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with Cache First strategy
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle navigation requests with Network First, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(networkFirstWithOfflinePage(request));
    return;
  }

  // Default: Network First strategy
  event.respondWith(networkFirstStrategy(request));
});

// Network First strategy - try network, fallback to cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful API responses
    if (networkResponse.ok && shouldCacheRequest(request)) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    if (request.url.includes('supabase.co')) {
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'This data is not available offline',
          offline: true 
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Cache First strategy - try cache, fallback to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch resource', error);
    throw error;
  }
}

// Network First with offline page fallback
async function networkFirstWithOfflinePage(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
}

// Check if request should be cached
function shouldCacheRequest(request) {
  const url = new URL(request.url);
  
  // Cache API requests that match patterns
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync-appointments') {
    event.waitUntil(syncOfflineAppointments());
  }
  
  if (event.tag === 'background-sync-tasks') {
    event.waitUntil(syncOfflineTasks());
  }
});

// Sync offline appointments when back online
async function syncOfflineAppointments() {
  try {
    const offlineAppointments = await getOfflineData('pending-appointments');
    
    for (const appointment of offlineAppointments) {
      try {
        await fetch('/rest/v1/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${appointment.token}`
          },
          body: JSON.stringify(appointment.data)
        });
        
        // Remove from offline storage after successful sync
        await removeOfflineData('pending-appointments', appointment.id);
      } catch (error) {
        console.error('Failed to sync appointment:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync offline tasks when back online
async function syncOfflineTasks() {
  try {
    const offlineTasks = await getOfflineData('pending-tasks');
    
    for (const task of offlineTasks) {
      try {
        await fetch('/rest/v1/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${task.token}`
          },
          body: JSON.stringify(task.data)
        });
        
        await removeOfflineData('pending-tasks', task.id);
      } catch (error) {
        console.error('Failed to sync task:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline data management
async function getOfflineData(key) {
  // Implementation would depend on your offline storage strategy
  return [];
}

async function removeOfflineData(key, id) {
  // Implementation would depend on your offline storage strategy
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: data.data,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action) {
    // Handle notification action clicks
    clients.openWindow(`/${event.action}`);
  } else {
    // Handle notification body click
    clients.openWindow('/app');
  }
});