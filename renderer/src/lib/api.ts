// Fine couche d'accès à l'API exposée par le preload (electron/main/utils.ts).
// Chaque appel passe par window.__electron.invoke(channel, ...args), qui
// envoie réellement 'gitarch:<channel>' au processus principal (voir preload).

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function bridge() {
  const b = window.__electron;
  if (!b) {
    throw new Error(
      "Le pont Electron n'est pas disponible (window.__electron manquant). " +
      "L'app doit être lancée via Electron, pas directement dans un navigateur."
    );
  }
  return b;
}

async function call<T>(channel: string, ...args: any[]): Promise<Result<T>> {
  try {
    return await bridge().invoke(channel, ...args);
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e) };
  }
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
}

export const api = {
  selectFolder: () => call<string | null>('selectFolder'),
  selectParentForClone: () => call<string | null>('selectParentForClone'),

  openRepo: (repoPath: string) => call<any>('openRepo', repoPath),
  initRepo: (repoPath: string) => call<true>('initRepo', repoPath),
  cloneRepo: (url: string, dest: string) => call<{ path: string }>('cloneRepo', { url, dest }),

  status: (repoPath: string) => call<any>('status', repoPath),
  log: (repoPath: string, limit?: number) => call<any[]>('log', { repoPath, limit }),
  branches: (repoPath: string) => call<any>('branches', repoPath),

  commit: (repoPath: string, title: string, description?: string) =>
    call<any>('commit', { repoPath, title, description }),
  push: (repoPath: string) => call<any>('push', repoPath),
  pull: (repoPath: string) => call<any>('pull', repoPath),
  fetch: (repoPath: string) => call<any>('fetch', repoPath),
  checkout: (repoPath: string, branch: string) => call<true>('checkout', { repoPath, branch }),
  stash: (repoPath: string) => call<any>('stash', repoPath),
  reset: (repoPath: string, mode: 'soft' | 'mixed' | 'hard') => call<true>('reset', { repoPath, mode }),

  readTree: (repoPath: string) => call<TreeNode>('readTree', repoPath),
  readFile: (repoPath: string, relPath: string) => call<string>('readFile', { repoPath, relPath }),
};
