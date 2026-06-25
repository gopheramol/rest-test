import * as vscode from 'vscode';

export interface SavedRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  body: string;
  headers: { key: string; value: string }[];
  queryParams: { key: string; value: string }[];
}

export interface Collection {
  id: string;
  name: string;
  requests: SavedRequest[];
}

/**
 * Owns persistence for request collections. Requests always live inside a
 * collection; legacy flat saved requests are migrated into a "Default"
 * collection on first read.
 */
export class CollectionService {
  private static readonly KEY = 'restApiTesterCollections';
  private static readonly LEGACY_KEY = 'restApiTesterSavedRequests';
  private idCounter = 0;

  constructor(private context: vscode.ExtensionContext) {}

  /** Generates a process-unique id. Date.now() is fine in extension code. */
  generateId(prefix = 'id'): string {
    this.idCounter += 1;
    return `${prefix}_${Date.now().toString(36)}_${this.idCounter}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;
  }

  /**
   * Runs the one-time migration from the legacy flat saved-requests list into
   * a single "Default" collection. The legacy key is kept as a backup.
   */
  async migrate(): Promise<void> {
    const existing = this.context.globalState.get<Collection[]>(CollectionService.KEY);
    if (existing !== undefined) {
      return;
    }

    const legacy = this.context.globalState.get<any[]>(CollectionService.LEGACY_KEY, []);
    const requests: SavedRequest[] = legacy.map(r => this.normalizeRequest(r));
    const collections: Collection[] = [
      { id: this.generateId('col'), name: 'Default', requests }
    ];
    await this.context.globalState.update(CollectionService.KEY, collections);
  }

  /** Ensures a stored request has an id and all expected fields. */
  private normalizeRequest(r: any): SavedRequest {
    return {
      id: r.id || this.generateId('req'),
      name: r.name || 'Untitled',
      method: (r.method || 'GET').toUpperCase(),
      url: r.url || '',
      body: r.body || '',
      headers: Array.isArray(r.headers) ? r.headers : [],
      queryParams: Array.isArray(r.queryParams) ? r.queryParams : []
    };
  }

  getCollections(): Collection[] {
    return this.context.globalState.get<Collection[]>(CollectionService.KEY, []);
  }

  private async save(collections: Collection[]): Promise<void> {
    await this.context.globalState.update(CollectionService.KEY, collections);
  }

  getCollection(id: string): Collection | undefined {
    return this.getCollections().find(c => c.id === id);
  }

  async createCollection(name: string): Promise<Collection> {
    const collections = this.getCollections();
    const collection: Collection = { id: this.generateId('col'), name: name.trim() || 'Untitled', requests: [] };
    collections.push(collection);
    await this.save(collections);
    return collection;
  }

  async renameCollection(id: string, name: string): Promise<void> {
    const collections = this.getCollections();
    const c = collections.find(x => x.id === id);
    if (!c) { return; }
    c.name = name.trim() || c.name;
    await this.save(collections);
  }

  async deleteCollection(id: string): Promise<void> {
    const collections = this.getCollections().filter(c => c.id !== id);
    await this.save(collections);
  }

  /**
   * Inserts or updates a request inside a collection. Within a collection a
   * request is matched by name (case-sensitive) so re-saving overwrites.
   */
  async upsertRequest(collectionId: string, request: Omit<SavedRequest, 'id'> & { id?: string }): Promise<SavedRequest> {
    const collections = this.getCollections();
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) {
      throw new Error(`Collection ${collectionId} not found`);
    }
    const normalized = this.normalizeRequest({ ...request, id: request.id });
    const existingIndex = collection.requests.findIndex(r => r.name === normalized.name);
    if (existingIndex !== -1) {
      normalized.id = collection.requests[existingIndex].id;
      collection.requests[existingIndex] = normalized;
    } else {
      collection.requests.push(normalized);
    }
    await this.save(collections);
    return normalized;
  }

  async deleteRequest(collectionId: string, requestId: string): Promise<void> {
    const collections = this.getCollections();
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) { return; }
    collection.requests = collection.requests.filter(r => r.id !== requestId);
    await this.save(collections);
  }

  /**
   * Moves a request to another collection (or reorders within one). When
   * `targetIndex` is provided the request is inserted at that position in the
   * destination collection, otherwise appended.
   */
  async moveRequest(requestId: string, fromCollectionId: string, toCollectionId: string, targetIndex?: number): Promise<void> {
    const collections = this.getCollections();
    const from = collections.find(c => c.id === fromCollectionId);
    const to = collections.find(c => c.id === toCollectionId);
    if (!from || !to) { return; }

    const idx = from.requests.findIndex(r => r.id === requestId);
    if (idx === -1) { return; }
    const [request] = from.requests.splice(idx, 1);

    let insertAt = targetIndex === undefined ? to.requests.length : targetIndex;
    // Removing from the same collection before a later target shifts the index.
    if (from === to && targetIndex !== undefined && idx < targetIndex) {
      insertAt = targetIndex - 1;
    }
    insertAt = Math.max(0, Math.min(insertAt, to.requests.length));
    to.requests.splice(insertAt, 0, request);
    await this.save(collections);
  }

  /** Adds an imported collection, de-duplicating its name and minting fresh ids. */
  async addImportedCollection(collection: Collection): Promise<Collection> {
    const collections = this.getCollections();
    const existingNames = new Set(collections.map(c => c.name));
    let name = collection.name || 'Imported';
    if (existingNames.has(name)) {
      let n = 2;
      while (existingNames.has(`${name} (${n})`)) { n += 1; }
      name = `${name} (${n})`;
    }
    const fresh: Collection = {
      id: this.generateId('col'),
      name,
      requests: collection.requests.map(r => this.normalizeRequest({ ...r, id: undefined }))
    };
    collections.push(fresh);
    await this.save(collections);
    return fresh;
  }
}
