import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type CustomerFormProps = {
  customerName: string
  phone: string
  email: string

  onCustomerNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onEmailChange: (value: string) => void
}

export function CustomerForm({
  customerName,
  phone,
  email,
  onCustomerNameChange,
  onPhoneChange,
  onEmailChange,
}: CustomerFormProps) {
  return (
    <div className='max-w-2xs space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='customerName'>お名前</Label>
        <Input
          id='customerName'
          placeholder='山田 太郎'
          className='placeholder:text-gray-400'
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='phone'>電話番号</Label>
        <Input
          id='phone'
          type='tel'
          placeholder='090-1234-5678'
          className='placeholder:text-gray-400'
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>メールアドレス</Label>
        <Input
          id='email'
          type='email'
          placeholder='sample@example.com'
          className='placeholder:text-gray-400'
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      <p className='text-sm'>※電話番号かEmailどちらかでも構いません</p>
    </div>
  )
}
