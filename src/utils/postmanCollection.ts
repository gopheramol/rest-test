import { Collection, SavedRequest } from '../services/CollectionService';

/**
 * Maps between our one-level Collection model and the Postman Collection v2.1
 * format. Postman supports nested folders and richer URL/body shapes than we
 * model, so import flattens folders (prefixing request names with the folder
 * path) and reads only the fields we support.
 */

const POSTMAN_SCHEMA = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';

/** Builds a Postman v2.1 document from one of our collections. */
export function exportToPostman(collection: Collection): any {
  return {
    info: {
      name: collection.name,
      _postman_id: collection.id,
      schema: POSTMAN_SCHEMA
    },
    item: collection.requests.map(requestToPostmanItem)
  };
}

function requestToPostmanItem(req: SavedRequest): any {
  const header = (req.headers || [])
    .filter(h => h.key)
    .map(h => ({ key: h.key, value: h.value }));

  const query = (req.queryParams || [])
    .filter(q => q.key)
    .map(q => ({ key: q.key, value: q.value }));

  const item: any = {
    name: req.name,
    request: {
      method: (req.method || 'GET').toUpperCase(),
      header,
      url: { raw: req.url, query }
    }
  };

  if (req.body && req.body.trim()) {
    item.request.body = { mode: 'raw', raw: req.body };
  }
  return item;
}

/**
 * Parses a Postman v2.1 document into one of our collections. Throws on a
 * document that is clearly not a Postman collection.
 */
export function importFromPostman(json: any): Omit<Collection, 'id'> {
  if (!json || typeof json !== 'object' || !json.info || !Array.isArray(json.item)) {
    throw new Error('Not a valid Postman collection (missing info/item).');
  }

  const requests: Omit<SavedRequest, 'id'>[] = [];
  flattenItems(json.item, '', requests);

  return {
    name: typeof json.info.name === 'string' && json.info.name.trim() ? json.info.name : 'Imported Collection',
    requests: requests as SavedRequest[]
  };
}

/** Recursively walks Postman items, flattening folders into prefixed requests. */
function flattenItems(items: any[], prefix: string, out: Omit<SavedRequest, 'id'>[]): void {
  for (const node of items) {
    if (node && Array.isArray(node.item)) {
      // Folder node.
      const folderName = node.name ? `${prefix}${node.name} / ` : prefix;
      flattenItems(node.item, folderName, out);
    } else if (node && node.request) {
      out.push(postmanItemToRequest(node, prefix));
    }
  }
}

function postmanItemToRequest(node: any, prefix: string): Omit<SavedRequest, 'id'> {
  const request = node.request || {};
  const method = (typeof request.method === 'string' ? request.method : 'GET').toUpperCase();
  const url = parseUrl(request.url);

  const headers = Array.isArray(request.header)
    ? request.header
        .filter((h: any) => h && h.key && !h.disabled)
        .map((h: any) => ({ key: String(h.key), value: String(h.value ?? '') }))
    : [];

  const queryParams = Array.isArray(request.url?.query)
    ? request.url.query
        .filter((q: any) => q && q.key && !q.disabled)
        .map((q: any) => ({ key: String(q.key), value: String(q.value ?? '') }))
    : [];

  let body = '';
  if (request.body && request.body.mode === 'raw' && typeof request.body.raw === 'string') {
    body = request.body.raw;
  }

  return {
    name: `${prefix}${node.name || 'Untitled'}`,
    method,
    url,
    body,
    headers,
    queryParams
  };
}

/** Postman url can be a plain string or an object with `raw`/`host`/`path`. */
function parseUrl(url: any): string {
  if (!url) { return ''; }
  if (typeof url === 'string') { return url; }
  if (typeof url.raw === 'string') { return url.raw; }

  const protocol = url.protocol ? `${url.protocol}://` : '';
  const host = Array.isArray(url.host) ? url.host.join('.') : (url.host || '');
  const path = Array.isArray(url.path) ? '/' + url.path.join('/') : (url.path || '');
  return `${protocol}${host}${path}`;
}
