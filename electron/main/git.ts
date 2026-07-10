import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

function fail(error: unknown): Result<never> {
  const message = error instanceof Error ? error.message : String(error);
  return { ok: false, error: message };
}

function getGit(repoPath: string): SimpleGit {
  return simpleGit({ baseDir: repoPath });
}

const IGNORED_DIR_NAMES = new Set(['.git', 'node_modules', '.gitarchitect', 'dist', 'dist-renderer', 'dist-electron']);

interface TreeNode {
  name: string;
  path: string; // relative to repo root
  type: 'file' | 'folder';
  children?: TreeNode[];
}

function readTree(rootPath: string, currentPath: string, depth: number, maxDepth: number, maxEntries: number, counter: { n: number }): TreeNode[] {
  if (depth > maxDepth || counter.n > maxEntries) return [];

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(currentPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: TreeNode[] = [];
  for (const entry of entries) {
    if (counter.n > maxEntries) break;
    if (IGNORED_DIR_NAMES.has(entry.name)) continue;

    const abs = path.join(currentPath, entry.name);
    const rel = path.relative(rootPath, abs).split(path.sep).join('/');
    counter.n += 1;

    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        path: rel,
        type: 'folder',
        children: readTree(rootPath, abs, depth + 1, maxDepth, maxEntries, counter),
      });
    } else if (entry.isFile()) {
      nodes.push({ name: entry.name, path: rel, type: 'file' });
    }
  }

  // Dossiers d'abord, puis fichiers, triés par nom.
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

// ---------------------------------------------------------------------------
// IPC handlers
// ---------------------------------------------------------------------------

export function registerGitHandlers() {
  ipcMain.handle('gitarch:selectFolder', async () => {
    try {
      const win = BrowserWindow.getFocusedWindow();
      const options = {
        properties: ['openDirectory', 'createDirectory'] as Array<
          | 'openDirectory'
          | 'createDirectory'
          | 'openFile'
          | 'multiSelections'
          | 'showHiddenFiles'
          | 'promptToCreate'
          | 'noResolveAliases'
          | 'treatPackageAsDirectory'
          | 'dontAddToRecent'
        >,
        title: 'Choisir un dossier de dépôt Git',
      };

      // Electron's OpenDialogOptions expects a mutable array type.
      // Avoid `as const` which makes it `readonly`. 

      const result = win ? await dialog.showOpenDialog(win, options) : await dialog.showOpenDialog(options);
      if (result.canceled || result.filePaths.length === 0) return ok(null);
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:selectParentForClone', async () => {
    try {
      const win = BrowserWindow.getFocusedWindow();
      const options = {
        properties: ['openDirectory', 'createDirectory'] as Array<
          | 'openDirectory'
          | 'createDirectory'
          | 'openFile'
          | 'multiSelections'
          | 'showHiddenFiles'
          | 'promptToCreate'
          | 'noResolveAliases'
          | 'treatPackageAsDirectory'
          | 'dontAddToRecent'
        >,
        title: 'Choisir le dossier de destination du clone',
      };
      const result = win ? await dialog.showOpenDialog(win, options) : await dialog.showOpenDialog(options);
      if (result.canceled || result.filePaths.length === 0) return ok(null);
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:openRepo', async (_e, repoPath: string) => {
    try {
      if (!repoPath || !fs.existsSync(repoPath)) {
        return fail(new Error(`Le dossier "${repoPath}" n'existe pas.`));
      }
      const git = getGit(repoPath);
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        return ok({ path: repoPath, isRepo: false, branch: null, status: null });
      }
      const status = await git.status();
      let branch = status.current ?? null;
      return ok({ path: repoPath, isRepo: true, branch, status });
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:initRepo', async (_e, repoPath: string) => {
    try {
      fs.mkdirSync(repoPath, { recursive: true });
      const git = getGit(repoPath);
      await git.init();
      return ok(true);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:cloneRepo', async (_e, { url, dest }: { url: string; dest: string }) => {
    try {
      if (!url) throw new Error('URL du dépôt manquante.');
      fs.mkdirSync(dest, { recursive: true });
      const folderName = url.replace(/\.git$/, '').split(/[\\/]/).pop() || 'repo';
      const target = path.join(dest, folderName);
      const git = simpleGit();
      await git.clone(url, target);
      return ok({ path: target });
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:status', async (_e, repoPath: string) => {
    try {
      const git = getGit(repoPath);
      const status = await git.status();
      return ok(status);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:log', async (_e, { repoPath, limit }: { repoPath: string; limit?: number }) => {
    try {
      const git = getGit(repoPath);
      const log = await git.log({ maxCount: limit ?? 50 });
      return ok(log.all);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:branches', async (_e, repoPath: string) => {
    try {
      const git = getGit(repoPath);
      const branches = await git.branch(['-a']);
      return ok(branches);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:commit', async (_e, { repoPath, title, description }: { repoPath: string; title: string; description?: string }) => {
    try {
      if (!title || !title.trim()) throw new Error('Le titre du commit est obligatoire.');
      const git = getGit(repoPath);
      await git.add(['-A']);
      const message = description && description.trim() ? `${title}\n\n${description}` : title;
      const commitResult = await git.commit(message);
      return ok(commitResult);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:push', async (_e, repoPath: string) => {
    try {
      const git = getGit(repoPath);
      const status = await git.status();
      const branch = status.current;
      if (!status.tracking && branch) {
        const pushResult = await git.push(['-u', 'origin', branch]);
        return ok(pushResult);
      }
      const pushResult = await git.push();
      return ok(pushResult);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:pull', async (_e, repoPath: string) => {
    try {
      const git = getGit(repoPath);
      const pullResult = await git.pull();
      return ok(pullResult);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:fetch', async (_e, repoPath: string) => {
    try {
      const git = getGit(repoPath);
      const fetchResult = await git.fetch();
      return ok(fetchResult);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:checkout', async (_e, { repoPath, branch }: { repoPath: string; branch: string }) => {
    try {
      const git = getGit(repoPath);
      await git.checkout(branch);
      return ok(true);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:stash', async (_e, repoPath: string) => {
    try {
      const git = getGit(repoPath);
      const res = await git.stash();
      return ok(res);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:reset', async (_e, { repoPath, mode }: { repoPath: string; mode: 'soft' | 'mixed' | 'hard' }) => {
    try {
      const git = getGit(repoPath);
      await git.reset(mode === 'hard' ? ['--hard'] : mode === 'soft' ? ['--soft'] : ['--mixed']);
      return ok(true);
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:readTree', async (_e, repoPath: string) => {
    try {
      const counter = { n: 0 };
      const tree = readTree(repoPath, repoPath, 0, 6, 5000, counter);
      return ok({ name: path.basename(repoPath), path: '', type: 'folder' as const, children: tree });
    } catch (e) {
      return fail(e);
    }
  });

  ipcMain.handle('gitarch:readFile', async (_e, { repoPath, relPath }: { repoPath: string; relPath: string }) => {
    try {
      const abs = path.join(repoPath, relPath);
      const content = fs.readFileSync(abs, 'utf-8');
      return ok(content);
    } catch (e) {
      return fail(e);
    }
  });
}
