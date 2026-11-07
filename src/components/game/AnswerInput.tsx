import { forwardRef } from "react";
import { CornerDownLeft } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  feedback: "idle" | "wrong" | "dupe" | "right";
  disabled?: boolean;
}

const messages = { idle: "Digite o nome de uma música", wrong: "Não está na lista", dupe: "Você já acertou essa", right: "Boa!" };

export const AnswerInput = forwardRef<HTMLInputElement, Props>(function AnswerInput(
  { value, onChange, onSubmit, feedback, disabled },
  ref,
) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className={`flex gap-2 ${feedback === "wrong" ? "animate-shake" : ""}`} key={feedback === "wrong" ? Math.random() : "s"}>
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex.: Blinding Lights"
          autoComplete="off"
          spellCheck={false}
          aria-label="Nome da música"
          className={`h-14 flex-1 rounded-xl border bg-card px-5 text-lg outline-none transition focus:border-primary disabled:opacity-50 ${
            feedback === "wrong" ? "border-primary" : "border-input"
          }`}
        />
        <button type="submit" disabled={disabled} aria-label="Enviar" className="grid h-14 w-14 place-items-center rounded-xl bg-red-grad text-primary-foreground disabled:opacity-50">
          <CornerDownLeft className="h-5 w-5" />
        </button>
      </div>
      <p className={`mt-2 text-xs ${feedback === "right" ? "text-amber" : feedback === "idle" ? "text-muted-foreground" : "text-primary"}`}>
        {messages[feedback]}
      </p>
    </form>
  );
});
