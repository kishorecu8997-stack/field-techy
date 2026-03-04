# PR Summary (`Stripe_MockTest` vs `origin/dev`)

This branch implements Stripe-based wallet and bank onboarding flows, replacing prior mock/manual flows.

- **Commits:** 5
- **Files changed:** 17
- **Diff size:** +791 / -205

## What changed

1. **Client wallet top-up moved to real Stripe flow**
- Added new components:
  - `web/src/client/addFund/AddFundForm.tsx`
  - `web/src/client/addFund/AddFundModal.tsx`
- `WalletComponent` now opens an in-page Add Funds modal instead of routing to old add-fund screen.
- Uses `createPaymentIntent` + `stripe.confirmCardPayment(...)`.
- Fetches currency dynamically from client balance and refreshes wallet balance after successful payment.

2. **Stripe initialized app-wide**
- `web/src/main.tsx` now wraps app with Stripe `<Elements>` using `VITE_STRIPE_PUBLISHABLE_KEY`.

3. **Engineer bank details flow switched to Stripe Connect onboarding**
- `AddBankDetails.tsx` and `EditBankDetails.tsx` no longer use the old form submit flow.
- On open, they now:
  - call `connectStripeAccount`
  - request onboarding link
  - redirect/open Stripe onboarding URL
- Retry UI added for onboarding failures.
- `MyEarning.tsx` updated to trigger onboarding directly from “Add/Edit Bank Details” action.
- Withdraw action removed/hidden from affected earnings/profile sections.

4. **API service hooks added/refactored**
- Added client hook: `useCreatePaymentIntent`.
- Added engineer hooks:
  - `useConnectStripeAccount`
  - `useGetOnboardingLink`
- `useClientBalance` refactored to generated query options.
- Minor signature change: `useClientFiles` no longer accepts `_clientId`.

5. **Misc updates**
- Added Stripe deps in `web/package.json`:
  - `@stripe/react-stripe-js`
  - `@stripe/stripe-js`
- `vite.config.ts` dev server set to `host: "0.0.0.0"` and `port: 5174`.
- Some UI/data-safety cleanup for transaction array handling and optional bank detail fields.

## Notes to clean before merge
- Likely placeholder/typo strings present:
  - `"My Wallettt"` in sidebar config
  - `"Bankkkkk"` label in bank form
- Multiple `console.log`/`console.error` debug lines remain in Stripe onboarding components.
- Old form flows are commented out (not removed), so technical debt remains in those files.
