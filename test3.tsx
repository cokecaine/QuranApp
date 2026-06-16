import { useSignIn, useClerk } from '@clerk/expo'; const { signIn } = useSignIn(); const { setActive } = useClerk(); const a = signIn.createdSessionId;  
