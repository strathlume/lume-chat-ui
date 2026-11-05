import { useState } from "react";
import { copy } from "../copy";

interface ToolsPanelProps {
  mcpUrl: string;
  onClose: () => void;
}

export function ToolsPanel({ mcpUrl, onClose }: ToolsPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(mcpUrl);
    setCopied(true);
  };

  return (
    <aside className="tools-panel" aria-label={copy.toolsTitle}>
      <h2>{copy.toolsTitle}</h2>
      <p>{copy.toolsBody}</p>
      <div className="tools-url">
        <code>{mcpUrl}</code>
        <button type="button" onClick={() => void copyUrl()}>
          {copied ? copy.toolsCopied : copy.toolsCopy}
        </button>
      </div>
      <p className="tools-note">{copy.toolsNote}</p>
      <button type="button" className="link-button" onClick={onClose}>
        {copy.close}
      </button>
    </aside>
  );
}
