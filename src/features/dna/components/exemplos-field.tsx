import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { fieldStyles as s } from "./field-styles";
import type { DnaFormValues } from "../types";

export function ExemplosAprovadosField() {
  const { register, control } = useFormContext<DnaFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "exemplos_aprovados" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {fields.map((field, index) => (
        <div key={field.id} style={s.itemCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Título</label>
              <input {...register(`exemplos_aprovados.${index}.titulo`)} style={s.input} />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              style={{ ...s.removeButton, marginLeft: 10, marginTop: 20 }}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div>
            <label style={s.label}>Abertura</label>
            <textarea
              {...register(`exemplos_aprovados.${index}.abertura`)}
              style={{ ...s.textarea, minHeight: 60 }}
            />
          </div>
          <div>
            <label style={s.label}>Fechamento</label>
            <textarea
              {...register(`exemplos_aprovados.${index}.fechamento`)}
              style={{ ...s.textarea, minHeight: 60 }}
            />
          </div>
          <div>
            <label style={s.label}>Notas</label>
            <input {...register(`exemplos_aprovados.${index}.notas`)} style={s.input} />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ titulo: "", abertura: "", fechamento: "", notas: "" })}
        style={s.addButton}
      >
        <Plus size={14} />
        Adicionar exemplo aprovado
      </button>
    </div>
  );
}

export function ExemplosReprovadosField() {
  const { register, control } = useFormContext<DnaFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "exemplos_reprovados" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {fields.map((field, index) => (
        <div key={field.id} style={s.itemCard}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Título</label>
              <input {...register(`exemplos_reprovados.${index}.titulo`)} style={s.input} />
            </div>
            <button type="button" onClick={() => remove(index)} style={s.removeButton}>
              <Trash2 size={14} />
            </button>
          </div>
          <div>
            <label style={s.label}>Problema</label>
            <textarea
              {...register(`exemplos_reprovados.${index}.problema`)}
              style={{ ...s.textarea, minHeight: 60 }}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ titulo: "", problema: "" })}
        style={s.addButton}
      >
        <Plus size={14} />
        Adicionar exemplo reprovado
      </button>
    </div>
  );
}
