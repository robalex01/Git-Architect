import React from 'react';

type IconProps = { size?: number; className?: string };
const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const FolderIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></svg>
);

export const OpenFolderIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M3 8V6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1M3 8h18l-2.2 9.5A2 2 0 0 1 16.85 19H7.15a2 2 0 0 1-1.95-1.5L3 8Z" /></svg>
);

export const DownloadCloudIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M7 17a4 4 0 0 1-1-7.87A5.5 5.5 0 0 1 16.5 8.5 4 4 0 0 1 17 17M12 11v7M9 15l3 3 3-3" /></svg>
);

export const GitBranchIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="6" cy="6" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="9" r="2.2" /><path d="M6 8.2V15.8M6 8.2C6 12 9 9 12 9h3.8" /></svg>
);

export const UploadCloudIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M7 17a4 4 0 0 1-1-7.87A5.5 5.5 0 0 1 16.5 8.5 4 4 0 0 1 17 17M12 18v-7M9 14l3-3 3 3" /></svg>
);

export const RefreshIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M3 12a9 9 0 0 1 15.3-6.4M21 12a9 9 0 0 1-15.3 6.4M18.8 4v4.6h-4.6M5.2 20v-4.6h4.6" /></svg>
);

export const CheckCircleIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.3 2.5 2.5 4.8-5.2" /></svg>
);

export const AlertIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" /></svg>
);

export const XIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const SearchIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

export const HistoryIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 8v4l3 2" /></svg>
);

export const LayersIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>
);

export const ArchiveIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 13h4" /></svg>
);

export const UndoIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-1" /></svg>
);

export const MoreIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></svg>
);

export const PlusIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>
);

export const MinusIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M5 12h14" /></svg>
);

export const FitIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
);

export const FileIcon = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5" /></svg>
);
