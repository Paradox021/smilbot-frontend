import { CircleAlert, CircleCheck, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { useLoginResult } from '../hooks/useLoginResult'
import { authTexts } from '../texts'

export function LoginResultNotice() {
  const { result, dismiss } = useLoginResult()
  if (!result) return null

  const isSuccess = result === 'success'
  const Icon = isSuccess ? CircleCheck : CircleAlert

  return (
    <Alert
      variant={isSuccess ? 'default' : 'destructive'}
      role={isSuccess ? 'status' : 'alert'}
      className="pr-12"
    >
      <Icon aria-hidden />
      <AlertDescription>
        {isSuccess ? authTexts.loginSuccess : authTexts.loginError}
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={dismiss}
        aria-label={authTexts.dismiss}
        className="absolute top-1.5 right-1.5"
      >
        <X aria-hidden />
      </Button>
    </Alert>
  )
}
