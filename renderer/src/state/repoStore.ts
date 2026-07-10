import { create } from 'zustand';
import { api, TreeNode } from '../lib/api';

interface RepoState {
  repoPath: string | null;
  isRepo: boolean;
  branch: string | null;
  status: any | null;
  tree: TreeNode | null;
  log: any[];
  loading: boolean;
  error: string | null;

  openFolder: () => Promise<void>;
  openPath: (p: string) => Promise<void>;
  cloneRepo: (url: string) => Promise<void>;
  initRepo: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  refreshTree: () => Promise<void>;
  refreshLog: () => Promise<void>;
  commit: (title: string, description?: string) => Promise<void>;
  push: () => Promise<void>;
  pull: () => Promise<void>;
  fetch: () => Promise<void>;
  clearError: () => void;
}

export const useRepoStore = create<RepoState>((set, get) => ({
  repoPath: null,
  isRepo: false,
  branch: null,
  status: null,
  tree: null,
  log: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  openFolder: async () => {
    const res = await api.selectFolder();
    if (!res.ok) return set({ error: res.error });
    if (!res.data) return; // annulé par l'utilisateur
    await get().openPath(res.data);
  },

  openPath: async (p: string) => {
    set({ loading: true, error: null });
    const res = await api.openRepo(p);
    if (!res.ok) {
      set({ loading: false, error: res.error });
      return;
    }
    set({
      repoPath: p,
      isRepo: res.data.isRepo,
      branch: res.data.branch,
      status: res.data.status,
      loading: false,
    });
    if (res.data.isRepo) {
      await Promise.all([get().refreshTree(), get().refreshLog()]);
    } else {
      await get().refreshTree();
    }
  },

  cloneRepo: async (url: string) => {
    set({ loading: true, error: null });
    const destRes = await api.selectParentForClone();
    if (!destRes.ok) return set({ loading: false, error: destRes.error });
    if (!destRes.data) return set({ loading: false });
    const cloneRes = await api.cloneRepo(url, destRes.data);
    if (!cloneRes.ok) return set({ loading: false, error: cloneRes.error });
    await get().openPath(cloneRes.data.path);
  },

  initRepo: async () => {
    const { repoPath } = get();
    if (!repoPath) return;
    const res = await api.initRepo(repoPath);
    if (!res.ok) return set({ error: res.error });
    await get().openPath(repoPath);
  },

  refreshStatus: async () => {
    const { repoPath } = get();
    if (!repoPath) return;
    const res = await api.status(repoPath);
    if (!res.ok) return set({ error: res.error });
    set({ status: res.data, branch: res.data.current ?? null });
  },

  refreshTree: async () => {
    const { repoPath } = get();
    if (!repoPath) return;
    const res = await api.readTree(repoPath);
    if (!res.ok) return set({ error: res.error });
    set({ tree: res.data });
  },

  refreshLog: async () => {
    const { repoPath, isRepo } = get();
    if (!repoPath || !isRepo) return;
    const res = await api.log(repoPath, 50);
    if (!res.ok) return set({ error: res.error });
    set({ log: res.data });
  },

  commit: async (title: string, description?: string) => {
    const { repoPath } = get();
    if (!repoPath) return;
    set({ loading: true, error: null });
    const res = await api.commit(repoPath, title, description);
    if (!res.ok) {
      set({ loading: false, error: res.error });
      return;
    }
    // Le prompt d'origine spécifie : commit -> add -> commit -> push automatique.
    const pushRes = await api.push(repoPath);
    set({ loading: false });
    if (!pushRes.ok) {
      // Le commit a réussi mais le push a échoué (pas de remote, pas de réseau...) :
      // on affiche l'erreur sans la masquer, mais on garde le commit fait.
      set({ error: `Commit effectué, mais le push a échoué : ${pushRes.error}` });
    }
    await Promise.all([get().refreshStatus(), get().refreshTree(), get().refreshLog()]);
  },

  push: async () => {
    const { repoPath } = get();
    if (!repoPath) return;
    set({ loading: true, error: null });
    const res = await api.push(repoPath);
    set({ loading: false });
    if (!res.ok) return set({ error: res.error });
    await get().refreshStatus();
  },

  pull: async () => {
    const { repoPath } = get();
    if (!repoPath) return;
    set({ loading: true, error: null });
    const res = await api.pull(repoPath);
    set({ loading: false });
    if (!res.ok) return set({ error: res.error });
    await Promise.all([get().refreshStatus(), get().refreshTree(), get().refreshLog()]);
  },

  fetch: async () => {
    const { repoPath } = get();
    if (!repoPath) return;
    set({ loading: true, error: null });
    const res = await api.fetch(repoPath);
    set({ loading: false });
    if (!res.ok) return set({ error: res.error });
    await get().refreshStatus();
  },
}));
