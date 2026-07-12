import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { fieldStyles as s } from "./field-styles";
import type { DnaFormValues } from "../types";

export function AprendizadosField() {
  const { register, control } = useFormContext<DnaFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "aprendizados" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex", gap: 8 }}>
          <input
            {...register(`aprendizados.${index}.value`)}
            style={{ ...s.input, flex: 1 }}
            placeholder="Ex: Prefere abrir com pergunta"
          />
          <button type="button" onClick={() => remove(index)} style={s.removeButton}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({ value: "" })} style={s.addButton}>
        <Plus size={14} />
        Adicionar aprendizado
      </button>
    </div>
  );
}

export function PerfisReferenciaField() {
  const { register, control } = useFormContext<DnaFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "perfis_referencia" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {fields.map((field, index) => (
        <div key={field.id} style={{ ...s.itemCard, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <div style={{ width: 160 }}>
            <label style={s.label}>Handle</label>
            <input {...register(`perfis_referencia.${index}.handle`)} style={s.input} placeholder="@perfil" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Notas</label>
            <input {...register(`perfis_referencia.${index}.notas`)} style={s.input} placeholder="O que observar" />
          </div>
          <button type="button" onClick={() => remove(index)} style={{ ...s.removeButton, marginTop: 20 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({ handle: "", notas: "" })} style={s.addButton}>
        <Plus size={14} />
        Adicionar perfil
      </button>
    </div>
  );
}
