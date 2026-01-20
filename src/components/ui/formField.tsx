import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldError from "./FieldError";

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  register: any;
  error?: string;
}

export default function FormField({ name, label, placeholder = "", type = "text", register, error }: FormFieldProps) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input {...register(name)} type={type} placeholder={placeholder} />
      <div className="min-h-3 h-auto">
        <FieldError error={error} />
      </div>
    </div>
  );
}
