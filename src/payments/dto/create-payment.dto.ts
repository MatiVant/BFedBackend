export class CreatePaymentDto {
  userId: string; // FK a User
  amount: number; // Monto del pago
  type: 'monthly' | 'quarterly' | 'annual' | 'other'; // Tipo de cuota
  description: string; // Descripción del pago
  file?: {
    // Comprobante adjunto (opcional)
    name: string; // Nombre del archivo
    url: string; // URL del archivo
    type: string; // MIME type
    size: number; // Tamaño en bytes
  };
  adminNotes?: string; // Notas del administrador (opcional)
}
