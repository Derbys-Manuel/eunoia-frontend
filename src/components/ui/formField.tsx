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
  className?: string;
}

export default function FormField({ name, label, placeholder = "", type = "text", className, register, error }: FormFieldProps) {
  return (
    <div className={`grid gap-1 ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input {...register(name)} type={type} placeholder={placeholder}  />
      <div className="min-h-3 h-auto">
        <FieldError error={error} />
      </div>
    </div>
  );
}
