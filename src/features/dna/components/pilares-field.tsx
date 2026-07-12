import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { fieldStyles as s } from "./field-styles";
import type { DnaFormValues } from "../types";

export function PilaresField() {
  const { register, control } = useFormContext<DnaFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "pilares" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {fields.map((field, index) => (
        <div key={field.id} style={s.itemCard}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Nome do pilar</label>
              <input {...register(`pilares.${index}.nome`)} style={s.input} />
            </div>
            <div>
              <label style={s.label}>Peso %</label>
              <input
                type="number"
                {...register(`pilares.${index}.peso_pct`, { valueAsNumber: true })}
                style={s.inputSmall}
              />
            </div>
            <button type="button" onClick={() => remove(index)} style={s.removeButton}>
              <Trash2 size={14} />
            </button>
          </div>
          <div>
            <label style={s.label}>Subpilares (separar por vírgula)</label>
            <SubpilaresInput index={index} />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ nome: "", peso_pct: 0, subpilares: [] })}
        style={s.addButton}
      >
        <Plus size={14} />
        Adicionar pilar
      </button>
    </div>
  );
}

/** Bridges a string[] field with a comma-separated text input */
function SubpilaresInput({ index }: { index: number }) {
  const { setValue, watch } = useFormContext<DnaFormValues>();
  const subpilares = watch(`pilares.${index}.subpilares`) ?? [];
  const displayValue = subpilares.join(", ");

  return (
    <input
      style={s.input}
      value={displayValue}
      placeholder="Ex: CAT, Estabilidade, Perícia"
      onChange={(e) => {
        const items = e.target.value.split(",").map((s) => s.trim());
        setValue(`pilares.${index}.subpilares`, items, { shouldDirty: true });
      }}
    />
  );
}
