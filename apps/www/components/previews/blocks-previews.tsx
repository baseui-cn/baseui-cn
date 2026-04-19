"use client"

import { LoginBlock, SignupBlock } from "@/components/ui/auth"
import { EmptyState, EmptyStateIcons } from "@/components/ui/blocks"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function EmptyStatePreview() {
  return (
    <EmptyState
      icon={EmptyStateIcons.inbox}
      title="No messages yet"
      description="When you receive messages, they'll appear here."
      action={
        <Button size="sm" variant="outline">
          Compose message
        </Button>
      }
    />
  )
}

function LoginPreview() {
  return (
    <LoginBlock
      onGoogleLogin={() => {}}
      onGithubLogin={() => {}}
      signUpHref="#signup"
      variant="elevated"
      forgotPasswordHref="#forgot"
    />
  )
}

function LoginErrorPreview() {
  return (
    <LoginBlock
      showSocial={false}
      variant="elevated"
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        return {
          status: "error",
          message: "We could not verify those credentials. Map this to your server response later.",
          fieldErrors: {
            email: "Use your real auth action or swap in a demo credential.",
          },
        }
      }}
    />
  )
}

function SignupPreview() {
  return (
    <SignupBlock
      onGoogleLogin={() => {}}
      onGithubLogin={() => {}}
      signInHref="#login"
      termsHref="#terms"
      variant="elevated"
      privacyHref="#privacy"
    />
  )
}

function SignupSuccessPreview() {
  return (
    <SignupBlock
      showSocial={false}
      variant="elevated"
      successToast={{
        title: "Auth block ready",
        description:
          "Replace the demo submit callback with your real signup action when you're ready.",
      }}
    />
  )
}

function LoginInDialogPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open login dialog</Button>} />
      <DialogContent size="md" noPadding={true} showCloseButton={false}>
        <DialogHeader className="border-b-0 pb-0">
          <DialogTitle>Overlay-safe login</DialogTitle>
          <DialogDescription>
            This block keeps validation, focus, and toast feedback working inside a Base UI dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <LoginBlock
            showSocial={false}
            variant="minimal"
            animation="slide-up"
            signUpHref="#signup"
            forgotPasswordHref="#forgot"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const blocksPreviewMap: Record<string, React.ComponentType> = {
  "empty-state": EmptyStatePreview,
  "empty-state-demo": EmptyStatePreview,
  login: LoginPreview,
  "login-demo": LoginPreview,
  "login-error-demo": LoginErrorPreview,
  "login-dialog-demo": LoginInDialogPreview,
  signup: SignupPreview,
  "signup-demo": SignupPreview,
  "signup-success-demo": SignupSuccessPreview,
}
