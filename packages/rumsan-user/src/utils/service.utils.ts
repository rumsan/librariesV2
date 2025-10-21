import { AuthService } from '@rumsan/sdk/types';
import { ERRORS, EVENTS } from '../constants';

export function getServiceTypeByAddress(input: string): AuthService | null {
  // Regular expressions for email, Ethereum wallet address, and phone number
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const walletRegex = /^0x[a-fA-F0-9]{40}$/;
  const phoneRegex = /^\+\d{11,}$/;

  if (emailRegex.test(input)) {
    return AuthService.EMAIL;
  } else if (walletRegex.test(input)) {
    return AuthService.WALLET;
  } else if (phoneRegex.test(input)) {
    return AuthService.PHONE;
  } else {
    throw ERRORS.SERVICE_TYPE_INVALID;
  }
}

// Helper function to get the appropriate verification event name
export function getVerificationEventName(service: AuthService) {
  switch (service) {
    case AuthService.EMAIL:
      return EVENTS.EMAIL_TO_VERIFY;
    case AuthService.PHONE:
      return EVENTS.PHONE_TO_VERIFY;
    case AuthService.WALLET:
      return EVENTS.WALLET_TO_VERIFY;
    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}
