import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { fieldStyles as s } from "./field-styles";
import type { DnaFormValues } from "../types";

export function TemasField() {
  const { register, control } = useFormContext<DnaFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "temas_cobertos" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {fields.map((field, index) => (
        <div key={field.id} style={{ ...s.itemCard, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 2 }}>
            <label style={s.label}>Tema</label>
            <input {...register(`temas_cobertos.${index}.tema`)} style={s.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Subpilar</label>
            <input {...register(`temas_cobertos.${index}.subpilar`)} style={s.input} />
          </div>
          <div style={{ width: 120 }}>
            <label style={s.label}>Data</label>
            <input type="date" {...register(`temas_cobertos.${index}.data`)} style={s.input} />
          </div>
          <div style={{ width: 110 }}>
            <label style={s.label}>Formato</label>
            <input {...register(`temas_cobertos.${index}.formato`)} style={s.input} placeholder="carrossel" />
          </div>
          <button type="button" onClick={() => remove(index)} style={{ ...s.removeButton, marginTop: 20 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ tema: "", data: new Date().toISOString().slice(0, 10), subpilar: "", formato: "carrossel" })}
        style={s.addButton}
      >
        <Plus size={14} />
        Adicionar tema
      </button>
    </div>
  );
}
