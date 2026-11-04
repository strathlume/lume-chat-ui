import { useState, type FormEvent, type KeyboardEvent } from "react";
import { copy } from "../copy";

interface ComposerProps {
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function Composer({ busy, onSend, onStop }: ComposerProps) {
  const [text, setText] = useState("");

  const submit = () => {
    const value = text.trim();
    if (!value || busy) return;
    onSend(value);
    setText("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form className="composer" onSubmit={onSubmit}>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={copy.placeholder}
        aria-label={copy.placeholder}
        rows={2}
      />
      {busy ? (
        <button type="button" onClick={onStop}>
          {copy.stop}
        </button>
      ) : (
        <button type="submit">{copy.send}</button>
      )}
    </form>
  );
}
