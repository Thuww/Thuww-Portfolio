// IndexedDB Persistence for Custom 3D Character Models (.glb / .gltf)

const DB_NAME = 'AetheriaCharacterDB';
const DB_VERSION = 1;
const STORE_NAME = 'models';

export interface ModelSettings {
  scale: number;
  yOffset: number;
  rotationY: number;
}

export const DEFAULT_MODEL_SETTINGS: ModelSettings = {
  scale: 1.0,
  yOffset: 0.0,
  rotationY: 0,
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save an uploaded GLB ArrayBuffer into IndexedDB
 */
export async function saveCustomModel(buffer: ArrayBuffer, name: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(
      {
        buffer,
        name,
        size: buffer.byteLength,
        updatedAt: Date.now(),
      },
      'active_model'
    );

    tx.oncomplete = () => {
      window.dispatchEvent(
        new CustomEvent('character-model-updated', {
          detail: { buffer, name },
        })
      );
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Retrieve the active custom GLB model
 */
export async function getCustomModel(): Promise<{ buffer: ArrayBuffer; name: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('active_model');

      req.onsuccess = () => {
        if (req.result && req.result.buffer) {
          resolve({
            buffer: req.result.buffer,
            name: req.result.name || 'CustomModel.glb',
          });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to get custom model from IndexedDB:', err);
    return null;
  }
}

/**
 * Remove the custom model to restore default avatar
 */
export async function clearCustomModel(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete('active_model');

    tx.oncomplete = () => {
      window.dispatchEvent(new CustomEvent('character-model-reset'));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Model transform settings (scale, yOffset, rotation)
 */
export function getStoredModelSettings(): ModelSettings {
  try {
    const raw = localStorage.getItem('aetheria_model_settings');
    if (raw) {
      return { ...DEFAULT_MODEL_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return { ...DEFAULT_MODEL_SETTINGS };
}

export function saveStoredModelSettings(settings: Partial<ModelSettings>): void {
  try {
    const current = getStoredModelSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('aetheria_model_settings', JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('character-settings-updated', { detail: updated })
    );
  } catch {}
}
